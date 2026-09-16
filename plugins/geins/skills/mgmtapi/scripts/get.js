#!/usr/bin/env node
'use strict';

/**
 * Reads from the Geins Management API. Cannot mutate anything: GET, or the Query endpoints that
 * read via POST. Writes go through send.js, which is a separate entry point so the two can carry
 * different permissions.
 *
 * Usage:
 *   node get.js --path "Product/1234" [--query include=Names]
 *   node get.js --resource Brand [--filter '{"ExternalIds":["abc"]}']
 *   node get.js --resource Product --all [--filter '{...}'] [--max-pages 100]
 *   node get.js --check-credentials [--profile <name>]
 *
 * Without --profile the profile comes from GEINS_MGMT_API_PROFILE, then the session selection made
 * through profile.js, then the single configured profile. See effectiveProfile in geins-api.js.
 *
 * --all walks POST {Resource}/Query/{page}, which only Order, Product and User expose. Page size
 * is 1000 and --max-pages defaults to 100, so a run warns rather than truncating in silence.
 */

const {
  request,
  queryAll,
  parseQueryPairs,
  parseArguments,
  credentials,
  credentialSource,
  effectiveProfile,
  fail,
} = require('./geins-api');

async function main() {
  const options = parseArguments(process.argv.slice(2), ['all', 'check-credentials']);
  const { profile } = effectiveProfile(options.profile);

  if (options['check-credentials']) {
    const { source, detail } = credentialSource(profile);
    process.stdout.write(`profile '${profile}' resolves from ${source}: ${detail}\n`);

    // Resolving proves the source works end to end. Values are never printed.
    credentials(profile);
    process.stdout.write('All three values resolved.\n');
    return;
  }

  const query = parseQueryPairs(options.query);

  if (options.path && options.resource) {
    throw new Error('Pass either --path or --resource, not both.');
  }

  let result;

  if (options.path) {
    result = await request({ method: 'GET', apiPath: options.path, query, profile });
  } else if (options.resource) {
    if (options.all) {
      const maxPages = options['max-pages'] ? Number(options['max-pages']) : 100;
      if (!Number.isInteger(maxPages) || maxPages < 1) {
        throw new Error('--max-pages must be a positive integer.');
      }

      result = await queryAll({ resource: options.resource, filter: options.filter, query, profile, maxPages });
    } else {
      result = await request({
        method: 'POST',
        apiPath: `${options.resource}/Query`,
        query,
        body: options.filter,
        profile,
      });
    }
  } else {
    throw new Error('Pass --path <route> for a single GET, or --resource <name> to query.');
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch(fail);
