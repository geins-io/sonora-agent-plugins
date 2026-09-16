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
const { execSync } = require('child_process');

const DEFAULT_BASE_URL = 'https://mgmtapi.geins.io/API';
const MAX_ATTEMPTS = 4;
const CREDENTIAL_COMMAND_TIMEOUT_MS = 60000;
const SESSION_STATE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const PROFILE_PROMPTS = ['session', 'first-use', 'never'];

let envFileValues = null;
let configValues = null;
let configTopLevel = null;
const credentialCache = new Map();

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

/** Config holds no secrets, only where to fetch them from, so it is safe to read and commit. */
function configFilePaths() {
  const paths = [];

  if (process.env.CLAUDE_PROJECT_DIR) {
    paths.push(path.join(process.env.CLAUDE_PROJECT_DIR, '.geins.json'));
  }

  paths.push(path.join(process.cwd(), '.geins.json'));
  paths.push(path.join(os.homedir(), '.geins', 'config.json'));

  return paths;
}

function loadConfig() {
  if (configValues !== null) {
    return;
  }

  configValues = {};
  configTopLevel = {};

  for (const file of configFilePaths()) {
    if (!fs.existsSync(file)) {
      continue;
    }

    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      throw new Error(`${file} is not valid JSON: ${error.message}`);
    }

    for (const [profile, entry] of Object.entries(parsed.profiles || {})) {
      if (!(profile in configValues)) {
        configValues[profile] = entry;
      }
    }

    for (const [key, value] of Object.entries(parsed)) {
      if (key !== 'profiles' && !(key in configTopLevel)) {
        configTopLevel[key] = value;
      }
    }
  }
}

function config() {
  loadConfig();
  return configValues;
}

/** Top-level config keys, the ones that are not a profile. Same first-file-wins merge. */
function configSetting(name) {
  loadConfig();
  return configTopLevel[name];
}

function profileEntry(profile) {
  const entry = config()[profile];
  return entry && typeof entry === 'object' ? entry : {};
}

function profileLabel(profile) {
  const { label } = profileEntry(profile);
  return label && String(label).trim() !== '' ? String(label).trim() : null;
}

/** When to make the user choose: at session start, lazily at the first call, or never. */
function profilePrompt() {
  const configured = process.env.GEINS_MGMT_API_PROFILE_PROMPT || configSetting('profilePrompt');
  const value = configured ? String(configured).trim().toLowerCase() : '';
  return PROFILE_PROMPTS.includes(value) ? value : 'session';
}

function credentialCommand(profile) {
  const fromEnvironment = process.env[`GEINS_MGMT_API_CREDENTIAL_COMMAND${profileSuffix(profile)}`];
  if (fromEnvironment && fromEnvironment.trim() !== '') {
    return fromEnvironment.trim();
  }

  const entry = config()[profile];
  const configured = entry && entry.credentialCommand;
  return configured && configured.trim() !== '' ? configured.trim() : null;
}

/**
 * Accepts either a JSON object or .env-shaped lines, because vault CLIs are usually asked for a
 * whole secret rather than three separate ones and teams store it in whichever shape suits them.
 */
function parseCredentialOutput(output, suffix) {
  const text = output.trim();

  if (text.startsWith('{')) {
    const parsed = JSON.parse(text);
    const pick = (...names) => names.map((name) => parsed[name]).find((value) => value);

    return {
      username: pick('username', 'user', `GEINS_MGMT_API_USER${suffix}`, 'GEINS_MGMT_API_USER'),
      password: pick('password', 'pwd', `GEINS_MGMT_API_PWD${suffix}`, 'GEINS_MGMT_API_PWD'),
      apiKey: pick('apiKey', 'apikey', 'key', `GEINS_MGMT_API_KEY${suffix}`, 'GEINS_MGMT_API_KEY'),
    };
  }

  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const separator = line.indexOf('=');
    if (separator > 0) {
      values[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
    }
  }

  return {
    username: values[`GEINS_MGMT_API_USER${suffix}`] || values.GEINS_MGMT_API_USER,
    password: values[`GEINS_MGMT_API_PWD${suffix}`] || values.GEINS_MGMT_API_PWD,
    apiKey: values[`GEINS_MGMT_API_KEY${suffix}`] || values.GEINS_MGMT_API_KEY,
  };
}

/** Never include the command's stdout in an error: that is the secret. */
function runCredentialCommand(command, profile) {
  const suffix = profileSuffix(profile);
  let output;

  try {
    output = execSync(command, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: CREDENTIAL_COMMAND_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,
    });
  } catch (error) {
    const stderr = error.stderr ? String(error.stderr).trim().slice(0, 1000) : '';
    throw new Error(
      `The credentialCommand for profile '${profile}' failed: ${command}\n${stderr || error.message}`
    );
  }

  let credential;
  try {
    credential = parseCredentialOutput(output, suffix);
  } catch (error) {
    throw new Error(
      `The credentialCommand for profile '${profile}' produced output that is neither JSON nor ` +
        `key=value lines: ${error.message}`
    );
  }

  if (!credential.username || !credential.password || !credential.apiKey) {
    throw new Error(
      `The credentialCommand for profile '${profile}' did not supply all three values. Return ` +
        `JSON with username, password and apiKey, or key=value lines using GEINS_MGMT_API_USER, ` +
        `GEINS_MGMT_API_PWD and GEINS_MGMT_API_KEY.`
    );
  }

  return credential;
}

/**
 * Environment variables first for CI, then a configured credentialCommand, then the .env files.
 * Memoized per profile so a paged read resolves once instead of prompting a keychain per request.
 */
function credentials(profile) {
  if (credentialCache.has(profile)) {
    return credentialCache.get(profile);
  }

  const suffix = profileSuffix(profile);
  const resolved = resolveCredentials(profile, suffix);
  credentialCache.set(profile, resolved);
  return resolved;
}

function resolveCredentials(profile, suffix) {
  const fromEnvironment = {
    username: process.env[`GEINS_MGMT_API_USER${suffix}`],
    password: process.env[`GEINS_MGMT_API_PWD${suffix}`],
    apiKey: process.env[`GEINS_MGMT_API_KEY${suffix}`],
  };
  if (fromEnvironment.username && fromEnvironment.password && fromEnvironment.apiKey) {
    return fromEnvironment;
  }

  const command = credentialCommand(profile);
  if (command) {
    return runCredentialCommand(command, profile);
  }

  const fromFiles = {
    username: setting(`GEINS_MGMT_API_USER${suffix}`),
    password: setting(`GEINS_MGMT_API_PWD${suffix}`),
    apiKey: setting(`GEINS_MGMT_API_KEY${suffix}`),
  };
  if (fromFiles.username && fromFiles.password && fromFiles.apiKey) {
    return fromFiles;
  }

  const homeFile = path.join(os.homedir(), '.geins', '.env');
  throw new Error(
    `No credentials for profile '${profile}'. Either configure a credentialCommand for it in ` +
      `${path.join(os.homedir(), '.geins', 'config.json')}, or set GEINS_MGMT_API_USER${suffix}, ` +
      `GEINS_MGMT_API_PWD${suffix} and GEINS_MGMT_API_KEY${suffix} in ${homeFile}. ` +
      `Searched: ${envFilePaths().join(', ')}`
  );
}

/** Reports which source answers for a profile, naming no values. */
function credentialSource(profile) {
  const suffix = profileSuffix(profile);

  if (
    process.env[`GEINS_MGMT_API_USER${suffix}`] &&
    process.env[`GEINS_MGMT_API_PWD${suffix}`] &&
    process.env[`GEINS_MGMT_API_KEY${suffix}`]
  ) {
    return { source: 'environment variables', detail: `GEINS_MGMT_API_*${suffix}` };
  }

  const command = credentialCommand(profile);
  if (command) {
    return { source: 'credentialCommand', detail: command };
  }

  for (const file of envFilePaths()) {
    const values = parseEnvFile(file);
    if (
      values[`GEINS_MGMT_API_USER${suffix}`] &&
      values[`GEINS_MGMT_API_PWD${suffix}`] &&
      values[`GEINS_MGMT_API_KEY${suffix}`]
    ) {
      return { source: 'env file', detail: file };
    }
  }

  return { source: 'nothing', detail: `searched ${configFilePaths().join(', ')} and ${envFilePaths().join(', ')}` };
}

/**
 * A profile is never declared in one place: it is a key under `profiles`, or the existence of
 * `_<PROFILE>` suffixed keys in an env file or the environment. Collect the names from all of them.
 *
 * Names recovered from a suffix are lossy, because `my-prof` and `my_prof` both suffix to
 * `_MY_PROF`. Reporting the underscore form is safe: it resolves to exactly the same keys.
 */
function profileNameFromKey(key) {
  const match = /^GEINS_MGMT_API_(?:USER|CREDENTIAL_COMMAND)(?:_(.+))?$/.exec(key);
  if (!match) {
    return null;
  }

  return match[1] ? match[1].toLowerCase() : 'default';
}

/**
 * Cheap by default: `credentialSource` executes nothing, so listing cannot set off a vault prompt
 * per profile. Pass `{ verify: true }` to prove each one resolves, which does run the commands.
 */
function listProfiles({ verify = false } = {}) {
  const names = new Set(Object.keys(config()));

  const keySources = [process.env, ...envFilePaths().map(parseEnvFile)];
  for (const values of keySources) {
    for (const [key, value] of Object.entries(values)) {
      if (!value || String(value).trim() === '') {
        continue;
      }

      const name = profileNameFromKey(key);
      if (name) {
        names.add(name);
      }
    }
  }

  const ordered = [...names].sort((a, b) => {
    if (a === 'default') return -1;
    if (b === 'default') return 1;
    return a.localeCompare(b);
  });

  return ordered.map((name) => {
    const entry = profileEntry(name);
    const { source, detail } = credentialSource(name);

    let resolvable = null;
    if (verify) {
      try {
        credentials(name);
        resolvable = true;
      } catch (error) {
        resolvable = false;
      }
    }

    return {
      name,
      label: profileLabel(name),
      description: entry.description || null,
      source,
      detail,
      resolvable,
    };
  });
}

/** Aligned `name  label  source` rows, shared by the listing, the hook and the unselected error. */
function formatProfileRows(profiles) {
  if (profiles.length === 0) {
    return [];
  }

  const nameWidth = Math.max(...profiles.map((profile) => profile.name.length));
  const labels = profiles.map((profile) => profile.label || '');
  const labelWidth = Math.max(...labels.map((label) => label.length));

  return profiles.map((profile, index) => {
    const state = profile.resolvable === false || profile.source === 'nothing' ? 'no credentials' : profile.source;
    const label = labelWidth > 0 ? `${labels[index].padEnd(labelWidth)}  ` : '';
    return `  ${profile.name.padEnd(nameWidth)}  ${label}${state}`;
  });
}

/**
 * Which session is asking. The hook is handed a session_id on stdin; a Bash tool call gets the same
 * value as CLAUDE_CODE_SESSION_ID. Outside Claude Code there is none, and there is no session state.
 */
function sessionId() {
  const id = process.env.CLAUDE_CODE_SESSION_ID;
  return id && id.trim() !== '' ? id.trim() : null;
}

function sessionStateDir() {
  return path.join(os.homedir(), '.geins', 'sessions');
}

function sessionStatePath() {
  const id = sessionId();
  return id ? path.join(sessionStateDir(), `${id.replace(/[^A-Za-z0-9._-]/g, '_')}.json`) : null;
}

function readSessionProfile() {
  const file = sessionStatePath();
  if (!file || !fs.existsSync(file)) {
    return null;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return parsed && parsed.profile ? String(parsed.profile) : null;
  } catch (error) {
    // A corrupt state file must not block every call; treat it as no selection.
    return null;
  }
}

/** Holds a profile name and nothing else, so the file is not a secret. */
function writeSessionProfile(profile) {
  const file = sessionStatePath();
  if (!file) {
    throw new Error(
      'No CLAUDE_CODE_SESSION_ID in the environment, so there is no session to record a profile ' +
        'for. Pass --profile <name>, or set GEINS_MGMT_API_PROFILE.'
    );
  }

  fs.mkdirSync(sessionStateDir(), { recursive: true, mode: 0o700 });
  fs.writeFileSync(file, `${JSON.stringify({ profile }, null, 2)}\n`, { mode: 0o600 });
  pruneSessionState();

  return file;
}

function clearSessionProfile() {
  const file = sessionStatePath();
  if (!file || !fs.existsSync(file)) {
    return null;
  }

  fs.unlinkSync(file);
  return file;
}

/** Sessions never announce their end, so old state is swept on write rather than tracked. */
function pruneSessionState() {
  let entries;
  try {
    entries = fs.readdirSync(sessionStateDir());
  } catch (error) {
    return;
  }

  const cutoff = Date.now() - SESSION_STATE_MAX_AGE_MS;
  for (const name of entries) {
    const file = path.join(sessionStateDir(), name);
    try {
      if (fs.statSync(file).mtimeMs < cutoff) {
        fs.unlinkSync(file);
      }
    } catch (error) {
      // Another session may have swept the same file; nothing to do.
    }
  }
}

/**
 * The single place a profile name is decided. An explicit flag always wins; past that the point is
 * that more than one configured profile and no selection is an error, not a quiet fall back to
 * 'default'. A single-profile setup never sees any of this.
 */
function effectiveProfile(explicit) {
  if (explicit && explicit.trim() !== '') {
    return { profile: explicit.trim(), origin: '--profile' };
  }

  const fromEnvironment = process.env.GEINS_MGMT_API_PROFILE;
  if (fromEnvironment && fromEnvironment.trim() !== '') {
    return { profile: fromEnvironment.trim(), origin: 'GEINS_MGMT_API_PROFILE' };
  }

  const fromSession = readSessionProfile();
  if (fromSession) {
    return { profile: fromSession, origin: 'session selection' };
  }

  const profiles = listProfiles();

  if (profiles.length === 1) {
    return { profile: profiles[0].name, origin: 'the only configured profile' };
  }

  if (profiles.length === 0) {
    // Nothing is configured at all. Carry on to the existing "No credentials" error, which names
    // every path searched and is more useful here than a list of zero profiles.
    return { profile: 'default', origin: 'fallback' };
  }

  throw new Error(
    `${profiles.length} profiles are configured and none is selected for this session:\n` +
      `${formatProfileRows(profiles).join('\n')}\n` +
      `Choose one with /geins:profile, or pass --profile <name>.`
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

module.exports = {
  request,
  queryAll,
  parseQueryPairs,
  parseArguments,
  credentials,
  credentialSource,
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
};
