#!/usr/bin/env node
'use strict';

/**
 * The write gate: send.js sends a request only after it was shown to the user and the user has
 * replied. It applies wherever nothing else asks before send.js runs:
 *   - Codex, which runs sandboxed commands unasked, and the Copilot CLI once shell is allowed;
 *   - Claude Code in a permission mode that does not prompt, such as auto or bypassPermissions.
 *     In its prompting modes the permission prompt is the gate, because the skill pre-approves
 *     reads only. An "always allow" rule for send.js is not visible here, so it is not gated.
 *
 * send.js records each dry run as a file. A UserPromptSubmit hook records each user message, and
 * Claude Code's permission mode with it. --confirm then needs a dry run of the same request made
 * before the user's latest message. A dry run lapses once the user sends the message after that,
 * so a "no" followed by anything else never turns into a yes.
 *
 * This stops an eager model from writing in one step. It is not a security boundary: anything that
 * can run send.js can also write these files.
 *
 * Usage:
 *   node write-gate.js --hook       (UserPromptSubmit hook; reads the hook payload on stdin)
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  agentSession,
  sessionStateDir,
  sessionFilePath,
  listProfiles,
  parseArguments,
  fail,
} = require('./sonora-api');

/** Claude Code modes that prompt before a Bash call the skill has not pre-approved. */
const PROMPTING_CLAUDE_MODES = ['default', 'acceptEdits', 'plan'];

/** A dry run approves nothing after this long, even if the user has not written since. */
const DRY_RUN_MAX_AGE_MS = 60 * 60 * 1000;

const NOT_WRITABLE = ['EPERM', 'EACCES', 'EROFS'];

function ensureStateDir() {
  fs.mkdirSync(sessionStateDir(), { recursive: true, mode: 0o700 });
}

function turnPath(id) {
  return sessionFilePath(id, '.turn');
}

/** The user's latest message in a session: when, and Claude Code's permission mode at the time. */
function readTurn(id) {
  try {
    const parsed = JSON.parse(fs.readFileSync(turnPath(id), 'utf8'));
    return { at: Number(parsed.at) || 0, permissionMode: parsed.permissionMode || null };
  } catch (error) {
    return null;
  }
}

function dryRunPrefix(id) {
  return path.basename(sessionFilePath(id, '.dryrun')).replace(/\.json$/, '.');
}

/** One file per dry run, <session>.dryrun.<hash>.<ms>.json, so parallel runs never collide. */
function listDryRuns(id) {
  let names;
  try {
    names = fs.readdirSync(sessionStateDir());
  } catch (error) {
    return [];
  }

  const prefix = dryRunPrefix(id);
  return names
    .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
    .map((name) => {
      const [hash, at] = name.slice(prefix.length, -'.json'.length).split('.');
      return { file: path.join(sessionStateDir(), name), hash, at: Number(at) };
    })
    .filter((entry) => entry.hash && Number.isFinite(entry.at));
}

/** The session the gate applies to, or null where something else already asks. */
function gatedSession() {
  const session = agentSession();
  if (!session) {
    // A plain terminal: a person typed the command.
    return null;
  }
  if (session.agent !== 'claude') {
    return session;
  }

  // No record means the hook has not run yet in this session, and Claude Code prompts by default.
  const turn = readTurn(session.id);
  const mode = turn && turn.permissionMode;
  return mode && !PROMPTING_CLAUDE_MODES.includes(mode) ? session : null;
}

function gated() {
  return gatedSession() !== null;
}

function requestHash({ method, apiPath, query, body, profile }) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify([method, apiPath, query || {}, body || '', profile]))
    .digest('hex');
}

function stateWritable() {
  const probe = path.join(sessionStateDir(), `.write-probe-${process.pid}`);
  try {
    ensureStateDir();
    fs.writeFileSync(probe, '');
    fs.unlinkSync(probe);
    return true;
  } catch (error) {
    return !NOT_WRITABLE.includes(error.code);
  }
}

/**
 * Records a dry run so a later --confirm of the same request can pass. Returns a note for the
 * output when the record could not be written, because --confirm will then be refused.
 */
function recordDryRun(requestDetails) {
  const session = gatedSession();
  if (!session) {
    return null;
  }

  const hash = requestHash(requestDetails);
  try {
    ensureStateDir();
    for (let at = Date.now(); ; at += 1) {
      try {
        const file = sessionFilePath(session.id, `.dryrun.${hash}.${at}`);
        fs.writeFileSync(file, '', { flag: 'wx', mode: 0o600 });
        break;
      } catch (error) {
        if (error.code !== 'EEXIST') {
          throw error;
        }
      }
    }
  } catch (error) {
    const reason = error.code || error.message;
    return (
      `Could not record this dry run in ${sessionStateDir()} (${reason}), so --confirm will be ` +
      'refused. The agent needs write access to that directory.'
    );
  }
  return null;
}

/** Throws unless this exact request was dry-run before the user's latest message. */
function checkConfirm(requestDetails) {
  const session = gatedSession();
  if (!session) {
    return;
  }

  const hash = requestHash(requestDetails);
  const dryRuns = listDryRuns(session.id).filter((entry) => entry.hash === hash);

  if (dryRuns.length === 0) {
    if (!stateWritable()) {
      throw new Error(
        `Refused: ${sessionStateDir()} is not writable for this agent, so no write can be ` +
          'confirmed. Tell the user; in Codex it belongs in sandbox_workspace_write.writable_roots.'
      );
    }
    throw new Error(
      'Refused: no dry run of this exact request is recorded. Run the same command without ' +
        '--confirm, show the user the request, and wait for their reply. A dry run lapses once ' +
        'the user has sent a second message after it.'
    );
  }

  const turn = readTurn(session.id);
  if (!turn) {
    throw new Error(
      "Refused: no user message has been recorded in this session, so the sonora plugin's " +
        'UserPromptSubmit hook is not running. Tell the user; in Codex they trust it in /hooks ' +
        'and start a new session. Retrying will not help.'
    );
  }

  const shown = dryRuns.filter((entry) => entry.at < turn.at);
  if (shown.length === 0) {
    throw new Error(
      'Refused: the user has not replied since this request was shown. Show them the request and ' +
        'wait for their answer; re-run with --confirm only if they agree.'
    );
  }

  const now = Date.now();
  const fresh = shown.filter((entry) => now - entry.at < DRY_RUN_MAX_AGE_MS);
  if (fresh.length === 0) {
    throw new Error(
      'Refused: the dry run of this request is more than an hour old. Run it again without ' +
        '--confirm and ask the user again.'
    );
  }

  // Deleting the file claims the approval, so two parallel --confirm runs cannot share one.
  for (const entry of fresh) {
    try {
      fs.unlinkSync(entry.file);
      return;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
  throw new Error(
    'Refused: the approval for this request was already used. Dry-run it again and ask the user.'
  );
}

/** Records the user's message. Runs on every prompt, so it does nothing where Sonora is unused. */
function hook() {
  let payload = {};
  try {
    payload = JSON.parse(fs.readFileSync(0, 'utf8')) || {};
  } catch (error) {
    return;
  }

  const id = payload.session_id || payload.sessionId;
  if (!id || listProfiles().length === 0) {
    return;
  }

  // Dry runs shown before the previous message had that message as their answer. They lapse now.
  const previous = readTurn(String(id));
  if (previous) {
    for (const entry of listDryRuns(String(id))) {
      if (entry.at < previous.at) {
        try {
          fs.unlinkSync(entry.file);
        } catch (error) {
          // Already claimed or swept.
        }
      }
    }
  }

  ensureStateDir();
  fs.writeFileSync(
    turnPath(String(id)),
    `${JSON.stringify({ at: Date.now(), permissionMode: payload.permission_mode || null })}\n`,
    { mode: 0o600 }
  );
}

if (require.main === module) {
  try {
    const options = parseArguments(process.argv.slice(2), ['hook']);
    if (options.hook) {
      hook();
    }
  } catch (error) {
    fail(error);
  }
}

module.exports = { gated, recordDryRun, checkConfirm };
