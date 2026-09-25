#!/usr/bin/env node

/**
 * Regenerates this skill's endpoint reference from the Sonora Management API's OpenAPI spec.
 *
 * Maintainer tool, not part of using the skill: the generated files are committed into the
 * plugin, so nobody installing it needs node, a YAML parser, or a copy of the spec. Run it when
 * the spec changes, then release a new plugin version.
 *
 * Usage:
 *   node scripts/sync-api-spec.js --spec <path to mgmtapi.yaml> [--out <dir>]
 *
 * --spec defaults to a geins-web checkout found beside any ancestor of this plugin.
 */

const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

const SKILL_ROOT = path.resolve(__dirname, '..');
const SPEC_RELATIVE_PATH = path.join('geins-web', 'content', 'api-refs', 'rest', 'mgmtapi.yaml');
const DEFAULT_OUT = path.join(SKILL_ROOT, 'references');
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const MAX_SCHEMA_DEPTH = 3;

/** Looks for a geins-web checkout beside any ancestor directory, so --spec is usually unneeded. */
function findDefaultSpec() {
  let directory = SKILL_ROOT;

  while (directory !== path.dirname(directory)) {
    const candidate = path.join(path.dirname(directory), SPEC_RELATIVE_PATH);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    directory = path.dirname(directory);
  }

  return path.join(path.dirname(SKILL_ROOT), SPEC_RELATIVE_PATH);
}

function parseArguments(argv) {
  const options = { spec: findDefaultSpec(), out: DEFAULT_OUT };

  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];

    if (!value) {
      throw new Error(`Missing value for ${flag}`);
    }

    if (flag === '--spec') {
      options.spec = path.resolve(value);
    } else if (flag === '--out') {
      options.out = path.resolve(value);
    } else {
      throw new Error(`Unknown argument ${flag}. Usage: --spec <path> --out <dir>`);
    }
  }

  return options;
}

/**
 * Resolves the `yaml` package from this repo or from the checkout the spec came from, neither of
 * which is guaranteed to have had its dependencies installed.
 */
function loadYamlParser(specPath) {
  const candidates = [SKILL_ROOT];

  let directory = path.dirname(specPath);
  while (directory !== path.dirname(directory)) {
    candidates.push(directory);
    directory = path.dirname(directory);
  }

  for (const candidate of candidates) {
    const entry = path.join(candidate, 'node_modules', 'yaml', 'package.json');
    if (fs.existsSync(entry)) {
      return createRequire(entry)('yaml');
    }
  }

  throw new Error(
    'Could not find the `yaml` package. Run `npm install yaml --no-save` in this repo, or point --spec at a JSON spec.'
  );
}

function readSpec(specPath) {
  const text = fs.readFileSync(specPath, 'utf8');

  if (specPath.toLowerCase().endsWith('.json')) {
    return JSON.parse(text);
  }

  return loadYamlParser(specPath).parse(text);
}

function schemaNameFromRef(ref) {
  return ref.split('/').pop();
}

/** Renders a schema as a short type name, keeping `$ref` names so they can be looked up below. */
function describeSchema(schema) {
  if (!schema) {
    return '';
  }

  if (schema.$ref) {
    return schemaNameFromRef(schema.$ref);
  }

  if (schema.type === 'array') {
    const item = describeSchema(schema.items);
    return item ? `${item}[]` : 'array';
  }

  if (schema.enum) {
    return `enum(${schema.enum.join(', ')})`;
  }

  if (schema.format) {
    return `${schema.type} (${schema.format})`;
  }

  return schema.type || '';
}

function collectRefs(schema, into, depth = 0) {
  if (!schema || depth > MAX_SCHEMA_DEPTH) {
    return into;
  }

  if (schema.$ref) {
    into.add(schemaNameFromRef(schema.$ref));
    return into;
  }

  if (schema.items) {
    collectRefs(schema.items, into, depth + 1);
  }

  for (const property of Object.values(schema.properties || {})) {
    collectRefs(property, into, depth + 1);
  }

  return into;
}

function jsonSchemaOf(container) {
  const content = (container || {}).content || {};
  const media = content['application/json'] || content['text/json'] || Object.values(content)[0];
  return (media || {}).schema;
}

function successResponseSchema(operation) {
  const responses = operation.responses || {};
  const code = Object.keys(responses).find((key) => key.startsWith('2'));
  return code ? jsonSchemaOf(responses[code]) : undefined;
}

function collapse(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untagged';
}

function readOperations(spec) {
  const operations = [];

  for (const [route, pathItem] of Object.entries(spec.paths || {})) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation) {
        continue;
      }

      const tag = (operation.tags || []).find((value) => value && value.trim()) || 'Untagged';
      const parameters = [...(pathItem.parameters || []), ...(operation.parameters || [])];

      operations.push({
        tag,
        method: method.toUpperCase(),
        route,
        // The spec's paths carry the /API prefix that the scripts' base URL already holds.
        callPath: route.replace(/^\/API\//, '').replace(/^\//, ''),
        summary: collapse(operation.summary || operation.description),
        description: operation.summary ? collapse(operation.description) : '',
        parameters: parameters.map((parameter) => ({
          name: parameter.name,
          location: parameter.in,
          required: Boolean(parameter.required),
          type: describeSchema(parameter.schema),
          description: collapse(parameter.description),
        })),
        requestSchema: jsonSchemaOf(operation.requestBody),
        responseSchema: successResponseSchema(operation),
      });
    }
  }

  return operations;
}

function renderSchema(name, schemas, lines) {
  const schema = schemas[name];
  if (!schema) {
    return;
  }

  lines.push(`### ${name}`);
  lines.push('');

  if (schema.description) {
    lines.push(collapse(schema.description));
    lines.push('');
  }

  const properties = Object.entries(schema.properties || {});
  if (properties.length === 0) {
    lines.push(`Type: ${describeSchema(schema) || 'object'}`);
    lines.push('');
    return;
  }

  const required = new Set(schema.required || []);

  lines.push('| Field | Type | Required | Description |');
  lines.push('|---|---|---|---|');
  for (const [propertyName, property] of properties) {
    const flag = required.has(propertyName) ? 'yes' : '';
    lines.push(`| ${propertyName} | ${describeSchema(property)} | ${flag} | ${collapse(property.description)} |`);
  }
  lines.push('');
}

function renderTagFile(tag, tagOperations, schemas, generatedOn) {
  const lines = [`# ${tag}`, ''];
  lines.push(`Generated on ${generatedOn} from the Sonora Management API spec. Do not edit; regenerate with \`node scripts/sync-api-spec.js\`.`);
  lines.push('');
  lines.push('Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.');
  lines.push('');
  lines.push('| Method | Path | Summary |');
  lines.push('|---|---|---|');

  const sorted = [...tagOperations].sort((left, right) =>
    left.callPath.localeCompare(right.callPath) || left.method.localeCompare(right.method)
  );

  for (const operation of sorted) {
    lines.push(`| ${operation.method} | \`${operation.callPath}\` | ${operation.summary} |`);
  }
  lines.push('');

  const referenced = new Set();

  for (const operation of sorted) {
    const requestType = describeSchema(operation.requestSchema);
    const responseType = describeSchema(operation.responseSchema);
    const hasDetail = operation.parameters.length > 0 || requestType || responseType || operation.description;

    if (!hasDetail) {
      continue;
    }

    lines.push(`## ${operation.method} ${operation.callPath}`);
    lines.push('');

    if (operation.description) {
      lines.push(operation.description);
      lines.push('');
    }

    if (operation.parameters.length > 0) {
      lines.push('| Parameter | In | Type | Required | Description |');
      lines.push('|---|---|---|---|---|');
      for (const parameter of operation.parameters) {
        lines.push(`| ${parameter.name} | ${parameter.location} | ${parameter.type} | ${parameter.required ? 'yes' : ''} | ${parameter.description} |`);
      }
      lines.push('');
    }

    if (requestType) {
      lines.push(`Body: \`${requestType}\``);
      lines.push('');
    }

    if (responseType) {
      lines.push(`Returns: \`${responseType}\``);
      lines.push('');
    }

    collectRefs(operation.requestSchema, referenced);
    collectRefs(operation.responseSchema, referenced);
  }

  const expanded = new Set();
  const pending = [...referenced];

  const schemaLines = [];
  while (pending.length > 0) {
    const name = pending.shift();
    if (expanded.has(name)) {
      continue;
    }
    expanded.add(name);

    renderSchema(name, schemas, schemaLines);

    const nested = collectRefs(schemas[name], new Set());
    for (const child of nested) {
      if (!expanded.has(child)) {
        pending.push(child);
      }
    }
  }

  if (schemaLines.length > 0) {
    lines.push('## Schemas');
    lines.push('');
    lines.push(...schemaLines);
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

function renderIndex(groups, spec, generatedOn) {
  const version = (spec.info || {}).version || 'unknown';
  const lines = ['# Sonora Management API endpoint index', ''];

  lines.push(`Spec version ${version}, generated on ${generatedOn}. Do not edit; regenerate with \`node scripts/sync-api-spec.js\`.`);
  lines.push('');
  lines.push('Open only the file for the resource you need.');
  lines.push('');
  lines.push('| Resource | Endpoints | Paged query | File |');
  lines.push('|---|---|---|---|');

  for (const [tag, tagOperations] of groups) {
    const paged = tagOperations.some((operation) => /\/Query\/\{/.test(operation.route)) ? 'yes' : '';
    lines.push(`| ${tag} | ${tagOperations.length} | ${paged} | [${slugify(tag)}.md](./${slugify(tag)}.md) |`);
  }

  lines.push('');
  lines.push('Read the `Returns` line before parsing a response. Most endpoints wrap the payload in an envelope, under `Resource` alongside `Message` and `Details`, but an unpaged `Query` returns a bare array.');
  lines.push('');
  lines.push('A resource marked "paged query" exposes `POST {Resource}/Query/{page}`, which is what `Get-SonoraApi.ps1 -All` walks. The rest expose only the unpaged `POST {Resource}/Query`.');

  return lines.join('\n');
}

function main() {
  const options = parseArguments(process.argv.slice(2));

  if (!fs.existsSync(options.spec)) {
    throw new Error(`Spec not found at ${options.spec}. Pass --spec <path>.`);
  }

  const spec = readSpec(options.spec);
  const operations = readOperations(spec);

  if (operations.length === 0) {
    throw new Error('The spec parsed but produced no operations.');
  }

  const schemas = ((spec.components || {}).schemas) || {};
  const generatedOn = new Date().toISOString().slice(0, 10);

  const grouped = new Map();
  for (const operation of operations) {
    if (!grouped.has(operation.tag)) {
      grouped.set(operation.tag, []);
    }
    grouped.get(operation.tag).push(operation);
  }

  const groups = [...grouped.entries()].sort((left, right) => left[0].localeCompare(right[0]));

  fs.mkdirSync(options.out, { recursive: true });
  for (const file of fs.readdirSync(options.out)) {
    if (file.endsWith('.md')) {
      fs.unlinkSync(path.join(options.out, file));
    }
  }

  for (const [tag, tagOperations] of groups) {
    fs.writeFileSync(
      path.join(options.out, `${slugify(tag)}.md`),
      `${renderTagFile(tag, tagOperations, schemas, generatedOn)}\n`,
      'utf8'
    );
  }

  fs.writeFileSync(path.join(options.out, 'endpoints.md'), `${renderIndex(groups, spec, generatedOn)}\n`, 'utf8');

  console.log(`Wrote ${operations.length} endpoints across ${groups.length} resources to ${options.out}`);
}

main();
