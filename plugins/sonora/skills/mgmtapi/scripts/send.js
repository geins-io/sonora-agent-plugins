#!/usr/bin/env node
'use strict';

/**
 * Writes to the Sonora Management API. Prints the request and sends nothing unless --confirm is
 * passed, so an unattended run has to state its intent on the command line where a reviewer or a
 * permission prompt can see it. Where no permission prompt runs, write-gate.js also requires the
 * user to have replied after a dry run of the same request.
 *
 * Usage:
 *   node send.js --method PUT --path "Product/1234" --body-file ./product.json --confirm
 *   node send.js --method DELETE --path "Product/1234" --confirm
 *
 * Prefer --body-file over --body for anything large: it keeps the payload out of the command line.
 */

const fs = require('fs');
const {
  request,
  credentials,
  parseQueryPairs,
  parseArguments,
  effectiveProfile,
  profileLabel,
  fail,
} = require('./sonora-api');
const writeGate = require('./write-gate');

const METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

async function main() {
  const options = parseArguments(process.argv.slice(2), ['confirm']);
  const { profile, origin } = effectiveProfile(options.profile);

  if (!options.method || !options.path) {
    throw new Error('Both --method and --path are required.');
  }

  const method = options.method.toUpperCase();
  if (!METHODS.includes(method)) {
    throw new Error(`--method must be one of ${METHODS.join(', ')}. Reads go through get.js.`);
  }

  if (options.body && options['body-file']) {
    throw new Error('Pass either --body or --body-file, not both.');
  }

  const payload = options['body-file'] ? fs.readFileSync(options['body-file'], 'utf8') : options.body;

  // Always name the account, never only when --profile was typed: once the profile can come from
  // session state, this line is the last place it is visible before the write lands.
  const label = profileLabel(profile);
  process.stdout.write(
    `${method} ${options.path}  (profile ${profile}${label ? ` — ${label}` : ''}, from ${origin})\n`
  );
  if (payload) {
    process.stdout.write(`${payload}\n`);
  }

  const requestDetails = {
    method,
    apiPath: options.path,
    query: parseQueryPairs(options.query),
    body: payload,
    profile,
  };

  if (!options.confirm) {
    if (!writeGate.gated()) {
      // Claude Code's permission prompt, or a person at a terminal, is the gate here.
      process.stdout.write('Not sent. Re-run with --confirm to send this request.\n');
      return;
    }

    const problem = writeGate.recordDryRun(requestDetails);
    process.stdout.write(
      'Not sent. Show the user this request and wait for their reply. --confirm is refused until ' +
        'they have answered, and sends only this exact request.\n'
    );
    if (problem) {
      process.stdout.write(`${problem}\n`);
    }
    return;
  }

  // Resolve credentials before claiming the approval, so an unknown profile or an expired vault
  // login does not use it up. They are cached, so request() does not resolve them twice.
  credentials(profile);

  const gated = writeGate.gated();
  writeGate.checkConfirm(requestDetails);

  let result;
  try {
    result = await request(requestDetails);
  } catch (error) {
    // The approval is claimed before sending, so a parallel --confirm cannot use it too. A failed
    // send may still have landed, so retrying is the user's call, not the script's.
    if (gated) {
      error.message +=
        '\nThe approval for this request is used up. Read back to check whether anything ' +
        'landed, then dry-run again and ask the user before retrying.';
    }
    throw error;
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch(fail);
