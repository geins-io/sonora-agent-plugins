#!/usr/bin/env node
'use strict';

/**
 * The write gate for agents that run shell commands without asking. Claude Code prompts before
 * every send.js call because the skill leaves it out of allowed-tools; Codex runs sandboxed
 * commands unasked, and Copilot does once shell is allowed. In those two, send.js only sends a
 * request that was dry-run before the user's latest message: send.js records each dry run, and a
 * UserPromptSubmit hook records each user turn.
 *
 * It keeps an eager model from writing in one step. It is not a security boundary: anything that
 * can run send.js can also edit the state file.
 *
 * Usage:
 *   node write-gate.js --hook       (UserPromptSubmit hook; reads the hook payload on stdin)
 */

const crypto = require('crypto');
const fs = require('fs');
const { sessionStateDir, sessionFilePath, parseArguments, fail } = require('./sonora-api');

/** The agents whose shell calls are not prompted per command. Observed in tool calls. */
const GATED_SESSION_VARIABLES = ['CODEX_SESSION_ID', 'COPILOT_AGENT_SESSION_ID'];

/** A dry run approves nothing after this long, so a stale one cannot be confirmed by accident. */
const PENDING_MAX_AGE_MS = 60 * 60 * 1000;

function gatedSessionId() {
  for (const name of GATED_SESSION_VARIABLES) {
    const id = process.env[name];
    if (id && id.trim() !== '') {
      return id.trim();
    }
  }
  return null;
}

function statePath(id) {
  return sessionFilePath(id, '.writes');
}

function readState(file) {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return {
      lastPromptAt: Number(parsed.lastPromptAt) || 0,
      pending: Array.isArray(parsed.pending) ? parsed.pending : [],
    };
  } catch (error) {
    return { lastPromptAt: 0, pending: [] };
  }
}

function writeState(file, state) {
  fs.mkdirSync(sessionStateDir(), { recursive: true, mode: 0o700 });
  fs.writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
}

function requestHash({ method, apiPath, query, body, profile }) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify([method, apiPath, query || [], body || '', profile]))
    .digest('hex');
}

function fresh(entry, now) {
  return entry && typeof entry.hash === 'string' && now - Number(entry.at) < PENDING_MAX_AGE_MS;
}

/** Whether this process runs under an agent the gate applies to. */
function gated() {
  return gatedSessionId() !== null;
}

/**
 * Records a dry run so a later --confirm of the same request can pass. Returns a note for the
 * output when the record could not be written, since --confirm will then be refused.
 */
function recordDryRun(requestDetails) {
  const id = gatedSessionId();
  if (!id) {
    return null;
  }

  const file = statePath(id);
  const now = Date.now();
  const state = readState(file);
  state.pending = state.pending.filter((entry) => fresh(entry, now));
  state.pending.push({ hash: requestHash(requestDetails), at: now });

  try {
    writeState(file, state);
  } catch (error) {
    return (
      `Could not record this dry run in ${sessionStateDir()} (${error.code || error.message}), ` +
      'so --confirm will be refused. Allow the agent to write there.'
    );
  }
  return null;
}

/** Throws unless this exact request was dry-run before the user's latest message. */
function checkConfirm(requestDetails) {
  const id = gatedSessionId();
  if (!id) {
    return;
  }

  const file = statePath(id);
  const now = Date.now();
  const state = readState(file);
  const hash = requestHash(requestDetails);
  const dryRuns = state.pending.filter((entry) => fresh(entry, now) && entry.hash === hash);

  if (dryRuns.length === 0) {
    throw new Error(
      'Refused: this request was not dry-run first. Run the same command without --confirm, show ' +
        'the user the request, and wait for their reply before adding --confirm.'
    );
  }

  const approved = dryRuns.find((entry) => Number(entry.at) < state.lastPromptAt);
  if (!approved) {
    throw new Error(
      'Refused: the user has not replied since this request was shown. Show them the request ' +
        'above and wait for their answer; re-run with --confirm only if they agree.'
    );
  }

  // One approval sends one request; a bulk write is approved by dry-running every item first.
  state.pending = state.pending.filter((entry) => entry !== approved && fresh(entry, now));
  writeState(file, state);
}

/**
 * Stamps the user's turn. Only a session that has dry-run a write has a state file, so in every
 * other session, Claude Code's included, this reads one path and exits.
 */
function hook() {
  let payload = {};
  try {
    payload = JSON.parse(fs.readFileSync(0, 'utf8')) || {};
  } catch (error) {
    return;
  }

  const id = payload.session_id || payload.sessionId;
  if (!id) {
    return;
  }

  const file = statePath(String(id));
  if (!fs.existsSync(file)) {
    return;
  }

  const state = readState(file);
  state.lastPromptAt = Date.now();
  writeState(file, state);
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
