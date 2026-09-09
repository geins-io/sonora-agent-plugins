'use strict';

/**
 * Transport for the Geins Management API: credential resolution, auth headers, retries and the
 * batched paging protocol. Used by get.js and send.js.
 *
 * No dependencies, so the plugin needs no install step. Requires Node 18 or later for global
 * fetch.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const DEFAULT_BASE_URL = 'https://mgmtapi.geins.io/API';
const MAX_ATTEMPTS = 4;

let envFileValues = null;

/**
 * Resolved against the caller's working directory, never __dirname: these scripts ship inside a
 * plugin, so paths relative to the module land in the plugin cache rather than in the repository
 * the user is working on. The home copy serves every repository at once.
 */
function envFilePaths() {
  const paths = [];

  if (process.env.CLAUDE_PROJECT_DIR) {
    paths.push(path.join(process.env.CLAUDE_PROJECT_DIR, '.env.geins'));
  }

  paths.push(path.join(process.cwd(), '.env.geins'));
  paths.push(path.join(os.homedir(), '.geins', '.env'));

  return paths;
}

function parseEnvFile(file) {
  const values = {};

  if (!fs.existsSync(file)) {
    return values;
  }

  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) {
      continue;
    }

    const separator = trimmed.indexOf('=');
    if (separator < 1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    const quoted =
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")));
    if (quoted) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

function setting(name) {
  const fromEnvironment = process.env[name];
  if (fromEnvironment && fromEnvironment.trim() !== '') {
    return fromEnvironment;
  }

  if (envFileValues === null) {
    envFileValues = {};
    for (const file of envFilePaths()) {
      for (const [key, value] of Object.entries(parseEnvFile(file))) {
        if (!(key in envFileValues)) {
          envFileValues[key] = value;
        }
      }
    }
  }

  const fromFile = envFileValues[name];
  return fromFile && fromFile.trim() !== '' ? fromFile : null;
}

/** Overridable so the scripts can be aimed at a stub or a staging host without editing them. */
function baseUrl() {
  const configured = setting('GEINS_MGMT_API_BASEURL');
  return configured ? configured.replace(/\/+$/, '') : DEFAULT_BASE_URL;
}

function profileSuffix(profile) {
  if (!profile || profile === 'default') {
    return '';
  }

  return `_${profile.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
}

function credentials(profile) {
  const suffix = profileSuffix(profile);
  const username = setting(`GEINS_MGMT_API_USER${suffix}`);
  const password = setting(`GEINS_MGMT_API_PWD${suffix}`);
  const apiKey = setting(`GEINS_MGMT_API_KEY${suffix}`);

  if (username && password && apiKey) {
    return { username, password, apiKey };
  }

  const homeFile = path.join(os.homedir(), '.geins', '.env');
  throw new Error(
    `No credentials for profile '${profile}'. Set GEINS_MGMT_API_USER${suffix}, ` +
      `GEINS_MGMT_API_PWD${suffix} and GEINS_MGMT_API_KEY${suffix} in ${homeFile} to serve every ` +
      `repository, or in a .env.geins in this repository. Searched: ${envFilePaths().join(', ')}`
  );
}

function authHeaders(credential) {
  const basic = Buffer.from(`${credential.username}:${credential.password}`, 'utf8').toString('base64');

  return {
    Authorization: `Basic ${basic}`,
    'X-ApiKey': credential.apiKey,
    Accept: 'application/json',
  };
}

function buildUrl(apiPath, query) {
  const url = new URL(`${baseUrl()}/${String(apiPath).replace(/^\/+/, '')}`);

  for (const [key, value] of Object.entries(query || {})) {
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

/** Query values arrive from the command line as key=value strings. */
function parseQueryPairs(pairs) {
  const query = {};

  for (const pair of pairs || []) {
    if (!pair || pair.trim() === '') {
      continue;
    }

    const separator = pair.indexOf('=');
    if (separator < 1) {
      throw new Error(`Query values must be key=value, got '${pair}'.`);
    }

    query[pair.slice(0, separator)] = pair.slice(separator + 1);
  }

  return query;
}

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function request({ method, apiPath, query, body, profile = 'default' }) {
  const credential = credentials(profile);
  const url = buildUrl(apiPath, query);

  const options = { method, headers: authHeaders(credential) };
  if (body !== undefined && body !== null && body !== '') {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
    options.headers['Content-Type'] = 'application/json';
  }

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const response = await fetch(url, options);
    const text = await response.text();

    if (response.ok) {
      return text.trim() === '' ? null : JSON.parse(text);
    }

    const transient = response.status === 429 || response.status >= 500;
    if (!transient || attempt === MAX_ATTEMPTS) {
      throw new Error(`${method} ${url} failed with HTTP ${response.status}. ${text.slice(0, 2000)}`);
    }

    const retryAfter = Number(response.headers.get('retry-after'));
    const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 2 ** attempt;

    process.stderr.write(
      `${method} ${url} returned HTTP ${response.status}, retrying in ${delay}s (attempt ${attempt} of ${MAX_ATTEMPTS}).\n`
    );
    await sleep(delay);
  }
}

/**
 * Walks POST {Resource}/Query/{page}. Page 1 creates a batch from the filter and returns its
 * BatchId; later pages must send that id instead of the filter, which the server then reuses.
 */
async function queryAll({ resource, filter, query, profile = 'default', maxPages = 100 }) {
  const items = [];
  let batchId = null;
  let pageCount = null;

  for (let page = 1; page <= maxPages; page++) {
    const body = page === 1 || !batchId ? filter : { BatchId: batchId };
    const response = await request({
      method: 'POST',
      apiPath: `${resource}/Query/${page}`,
      query,
      body,
      profile,
    });

    const pageItems = (response && Array.isArray(response.Resource) ? response.Resource : []).filter(
      (item) => item !== null && item !== undefined
    );
    items.push(...pageItems);

    const pageResult = (response && response.PageResult) || null;
    batchId = pageResult && pageResult.BatchId ? pageResult.BatchId : null;
    pageCount = pageResult && Number.isFinite(pageResult.PageCount) ? pageResult.PageCount : null;

    if (pageCount !== null && page >= pageCount) {
      return items;
    }

    if (pageCount === null && pageItems.length === 0) {
      return items;
    }
  }

  const total = pageCount === null ? 'an unknown number of' : pageCount;
  process.stderr.write(`Read ${maxPages} of ${total} pages of ${resource}; raise --max-pages to read the rest.\n`);
  return items;
}

/** Minimal parser: `--flag value` for everything except the boolean flags named in `booleans`. */
function parseArguments(argv, booleans = []) {
  const options = {};
  const repeatable = new Set(['query']);

  for (let index = 0; index < argv.length; index++) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      throw new Error(`Unexpected argument '${token}'. Every option is passed as --name value.`);
    }

    const name = token.slice(2);

    if (booleans.includes(name)) {
      options[name] = true;
      continue;
    }

    const value = argv[index + 1];
    if (value === undefined || value.startsWith('--')) {
      throw new Error(`Missing value for --${name}.`);
    }
    index++;

    if (repeatable.has(name)) {
      options[name] = [...(options[name] || []), value];
    } else {
      options[name] = value;
    }
  }

  return options;
}

function fail(error) {
  process.stderr.write(`${error && error.message ? error.message : error}\n`);
  process.exit(1);
}

module.exports = { request, queryAll, parseQueryPairs, parseArguments, fail };
