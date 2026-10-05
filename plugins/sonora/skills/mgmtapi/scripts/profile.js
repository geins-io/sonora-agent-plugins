#!/usr/bin/env node
'use strict';

/**
 * Lists the configured Sonora profiles and records which one this session works with. Holds a
 * profile name and nothing else, so nothing here is a secret and every mode is safe to run.
 *
 * Usage:
 *   node profile.js --list [--verify]
 *   node profile.js --use <name>
 *   node profile.js --current
 *   node profile.js --clear
 *   node profile.js --hook          (SessionStart hook; reads the hook payload on stdin)
 *
 * The selection lives in ~/.sonora/sessions/<session id>.json, so two sessions can work against
 * two accounts at once and neither leaks into the other.
 */

const fs = require('fs');
const path = require('path');
const {
  parseArguments,
  listProfiles,
  formatProfileRows,
  profileLabel,
  profilePrompt,
  effectiveProfile,
  sessionId,
  readSessionProfile,
  writeSessionProfile,
  clearSessionProfile,
  fail,
} = require('./sonora-api');

const BOOLEANS = ['list', 'verify', 'current', 'clear', 'hook'];

function describe(profile) {
  const label = profileLabel(profile);
  return label ? `${profile} — ${label}` : profile;
}

function list(verify) {
  const profiles = listProfiles({ verify });

  if (profiles.length === 0) {
    process.stdout.write('No Sonora profiles are configured.\n');
    return;
  }

  const selected = readSessionProfile();
  const rows = formatProfileRows(profiles);

  profiles.forEach((profile, index) => {
    const marker = profile.name === selected ? ' <- selected for this session' : '';
    process.stdout.write(`${rows[index]}${marker}\n`);
  });
}

function use(name) {
  if (!name || name.trim() === '') {
    throw new Error('--use needs a profile name. Run --list to see them.');
  }

  const wanted = name.trim();
  const profiles = listProfiles();
  const known = profiles.some((profile) => profile.name === wanted);

  if (!known) {
    const names = profiles.length === 0 ? 'none are configured' : profiles.map((p) => p.name).join(', ');
    throw new Error(`No profile named '${wanted}'. Configured: ${names}.`);
  }

  writeSessionProfile(wanted);
  process.stdout.write(`This session now works with profile ${describe(wanted)}.\n`);
}

function current() {
  const { profile, origin } = effectiveProfile(null);
  process.stdout.write(`${describe(profile)}, from ${origin}.\n`);
}

function clear() {
  const removed = clearSessionProfile();
  process.stdout.write(
    removed ? 'Cleared the profile selected for this session.\n' : 'No profile was selected for this session.\n'
  );
}

/**
 * SessionStart cannot ask anything itself, so it hands the agent the list and the instruction to ask.
 * Copilot CLI runs the hook but (as of 1.0.92) drops its context, which is why the no-selection error
 * from effectiveProfile carries the same instruction.
 * Everything it reports comes off disk, which makes it correct for every source including compact,
 * where it re-injects a choice the model has already lost.
 */
function hook() {
  let payload = {};
  try {
    payload = JSON.parse(fs.readFileSync(0, 'utf8')) || {};
  } catch (error) {
    // Run by hand, or handed something unparseable. Fall back to the environment.
  }

  // Claude Code, Codex and Copilot's PascalCase events send session_id; Copilot's camelCase sessionId.
  const payloadSessionId = payload.session_id || payload.sessionId;
  if (payloadSessionId) {
    process.env.CLAUDE_CODE_SESSION_ID = String(payloadSessionId);
  }

  const context = hookContext();
  if (context) {
    process.stdout.write(
      `${JSON.stringify({
        hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context },
      })}\n`
    );
  }
}

function hookContext() {
  const profiles = listProfiles();

  // Nothing configured: the plugin is not in use here, so say nothing at all.
  if (profiles.length === 0) {
    return null;
  }

  const selected = readSessionProfile();
  if (selected) {
    return `Sonora Management API: this session works with profile ${describe(selected)}.`;
  }

  if (profiles.length === 1) {
    const only = profiles[0].name;
    if (sessionId()) {
      writeSessionProfile(only);
    }
    return `Sonora Management API: profile ${describe(only)}, the only one configured.`;
  }

  const prompt = profilePrompt();
  if (prompt === 'never') {
    return null;
  }

  const when =
    prompt === 'first-use'
      ? 'Before the first Sonora Management API call in this session, ask'
      : 'Ask';

  const record = sessionId()
    ? ['then record the answer with:', `  node "${path.resolve(__filename)}" --use <name>`]
    : ['then pass --profile <name> on every Sonora call; this agent has no session to record it in.'];

  return [
    `Sonora Management API: ${profiles.length} profiles are configured and none is selected for this session.`,
    '',
    ...formatProfileRows(profiles),
    '',
    `${when} the user which one to work with (with AskUserQuestion where you have it), ${record[0]}`,
    ...record.slice(1),
    '',
    'Until one is chosen, every Sonora API call fails with this same list.',
  ].join('\n');
}

function main() {
  const options = parseArguments(process.argv.slice(2), BOOLEANS);

  if (options.hook) {
    return hook();
  }

  if (options.use !== undefined) {
    return use(options.use);
  }

  if (options.clear) {
    return clear();
  }

  if (options.current) {
    return current();
  }

  return list(Boolean(options.verify));
}

try {
  main();
} catch (error) {
  fail(error);
}
