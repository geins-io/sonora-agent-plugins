#!/usr/bin/env node
'use strict';

/**
 * Writes to the Geins Management API. Prints the request and sends nothing unless --confirm is
 * passed, so an unattended run has to state its intent on the command line where a reviewer or a
 * permission prompt can see it.
 *
 * Usage:
 *   node send.js --method PUT --path "Product/1234" --body-file ./product.json --confirm
 *   node send.js --method DELETE --path "Product/1234" --confirm
 *
 * Prefer --body-file over --body for anything large: it keeps the payload out of the command line.
 */

const fs = require('fs');
const { request, parseQueryPairs, parseArguments, effectiveProfile, profileLabel, fail } = require('./geins-api');

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

  if (!options.confirm) {
    process.stdout.write('Not sent. Re-run with --confirm to send this request.\n');
    return;
  }

  const result = await request({
    method,
    apiPath: options.path,
    query: parseQueryPairs(options.query),
    body: payload,
    profile,
  });

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch(fail);
