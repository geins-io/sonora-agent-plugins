# geins

Talk to the [Geins Management API](https://www.geins.io/developers/management-api) from any
repository.

## What you get

`/geins:mgmtapi` — Claude reads and writes your Geins account through two Node entry points bundled
with the skill, with the API's 162 endpoints across 21 resources documented locally so it picks the
right route without probing.

Reads run without a permission prompt. Writes always prompt, and the skill requires a count and a
preview before any bulk change.

```
How many orders were created in the last 30 days, by status?
Which products have no price in the SEK price list?
Set Custom1 sort orders on all products, scarcest stock first.
```

## Setup

Put three values from an API User in Geins Merchant Center into `~/.geins/.env`:

```
GEINS_MGMT_API_USER=
GEINS_MGMT_API_PWD=
GEINS_MGMT_API_KEY=
```

A `.env.geins` in the repository you are working in is read first if present, and real environment
variables win over both, so CI needs no file. Copy `.env.geins.example` for the extra keys that add
a second account (`_<PROFILE>` suffix, used with `--profile`) or retarget the base URL.

Credentials are never written to the repository, and the skill instructs Claude never to read or
print those files.

### Keeping credentials out of files entirely

Optional, and recommended once more than one person uses this. Configure a `credentialCommand` and
the plugin fetches credentials from your vault at call time instead of reading a file:

```json
// ~/.geins/config.json, or .geins.json in a repository. No secrets in here.
{
  "profiles": {
    "default": { "credentialCommand": "az keyvault secret show --vault-name geins-kv --name mgmtapi-labs --query value -o tsv" },
    "prod":    { "credentialCommand": "op read op://Private/geins-mgmtapi-prod/credential" }
  }
}
```

The command prints either JSON with `username`, `password` and `apiKey`, or `key=value` lines using
`GEINS_MGMT_API_USER`, `GEINS_MGMT_API_PWD` and `GEINS_MGMT_API_KEY`. Anything that writes a secret
to stdout works, with no dependency added to the plugin:

| Store | Command |
| --- | --- |
| Azure Key Vault | `az keyvault secret show --vault-name <kv> --name <secret> --query value -o tsv` |
| 1Password | `op read "op://Private/geins-mgmtapi/credential"` |
| macOS Keychain | `security find-generic-password -s geins-mgmtapi -a default -w` |
| Linux libsecret | `secret-tool lookup service geins-mgmtapi account default` |
| Windows Credential Manager | `powershell.exe -NoProfile -Command "..."`, using the built-in 5.1 |

Resolution order is environment variables, then `credentialCommand`, then the `.env` files, so
adding a command changes nothing for anyone still using a file. The command runs once per process,
so a paged read costs one vault call rather than one per request.

Check which source answers without printing any value:

```
node scripts/get.js --check-credentials [--profile <name>]
```

## Requirements

Node 18 or later on the PATH, for global `fetch`. The scripts have no dependencies, so there is no
install step.

## Layout

```
skills/mgmtapi/
├── SKILL.md
├── references/        generated endpoint and schema reference, one file per resource
└── scripts/
    ├── geins-api.js       transport: credentials, auth, retries, paging, batching
    ├── get.js             reads
    ├── send.js            writes, --confirm required
    └── sync-api-spec.js   maintainer tool, regenerates references/
```

## Command line

```
node scripts/get.js  --path <route> [--query k=v]... [--profile <name>]
node scripts/get.js  --resource <name> [--all] [--filter <json>] [--max-pages <n>]
node scripts/send.js --method POST|PUT|PATCH|DELETE --path <route>
                     [--body <json> | --body-file <path>] [--query k=v]... --confirm
```

`get.js` cannot mutate: it issues `GET`, or the `Query` endpoints that read via `POST`. `send.js`
prints the request and sends nothing without `--confirm`, and refuses `GET` outright.

## Updating the reference

`references/` is generated from the API's OpenAPI spec:

```
node scripts/sync-api-spec.js --spec ../geins-web/content/api-refs/rest/mgmtapi.yaml
```

It finds a `geins-web` checkout beside any ancestor directory on its own, so `--spec` is usually
unnecessary. Regenerate when the spec changes, then bump the plugin version.
