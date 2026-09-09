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

## Keeping credentials out of files entirely

Optional, and worth doing once more than one person uses this. Configure a `credentialCommand` and
the plugin fetches credentials from your vault at call time instead of reading them off disk.

Config says only *where* to fetch from, so it contains no secrets and is safe to read, print and
commit:

```jsonc
// ~/.geins/config.json, or .geins.json in a repository
{
  "profiles": {
    "default": { "credentialCommand": "az keyvault secret show --vault-name geins-kv --name mgmtapi-labs --query value -o tsv" },
    "prod":    { "credentialCommand": "op read op://Private/geins-mgmtapi-prod/credential" }
  }
}
```

Resolution order is environment variables, then `credentialCommand`, then the `.env` files, so
adding a command changes nothing for anyone still using a file. The command runs once per process,
so a paged read costs one vault call rather than one per HTTP request, and a keychain prompts once.

### What the command must print

Either JSON:

```json
{ "username": "api-user", "password": "...", "apiKey": "..." }
```

or `key=value` lines:

```
GEINS_MGMT_API_USER=api-user
GEINS_MGMT_API_PWD=...
GEINS_MGMT_API_KEY=...
```

Store all three as **one** secret in whatever shape suits your vault. One secret means one fetch,
one thing to rotate, and one thing to grant access to. The examples below all store the JSON form.

Only stdout is read. Anything the command writes to stderr is shown when it fails, and its stdout
never appears in an error message, because that is the secret.

### Azure Key Vault

Central, revocable, and `az login` is usually already on the machine. The best fit for a team.

```bash
# store, once, by whoever administers the vault
az keyvault secret set --vault-name geins-kv --name mgmtapi-labs \
  --value '{"username":"api-user","password":"...","apiKey":"..."}'

# grant each person read access to that one secret
az role assignment create --role "Key Vault Secrets User" \
  --assignee person@example.com \
  --scope "$(az keyvault show --name geins-kv --query id -o tsv)/secrets/mgmtapi-labs"
```

```json
{ "credentialCommand": "az keyvault secret show --vault-name geins-kv --name mgmtapi-labs --query value -o tsv" }
```

### 1Password

```bash
op item create --category=login --title='geins-mgmtapi' \
  'credential[text]={"username":"api-user","password":"...","apiKey":"..."}'
```

```json
{ "credentialCommand": "op read \"op://Private/geins-mgmtapi/credential\"" }
```

### macOS Keychain

No extra tooling: `security` ships with macOS.

```bash
security add-generic-password -s geins-mgmtapi -a default \
  -w '{"username":"api-user","password":"...","apiKey":"..."}'
```

```json
{ "credentialCommand": "security find-generic-password -s geins-mgmtapi -a default -w" }
```

### Linux, libsecret

Needs `secret-tool` from `libsecret-tools`, and an unlocked keyring in the session.

```bash
secret-tool store --label='Geins Management API' service geins-mgmtapi account default
# paste the JSON on stdin
```

```json
{ "credentialCommand": "secret-tool lookup service geins-mgmtapi account default" }
```

### Windows, DPAPI file

Windows Credential Manager has no built-in CLI that reads a secret back out, so the dependency-free
option is a DPAPI-encrypted file. The ciphertext is bound to your Windows user account, so another
user on the same machine cannot decrypt it.

```powershell
# store, once
'{"username":"api-user","password":"...","apiKey":"..."}' |
  ConvertTo-SecureString -AsPlainText -Force | ConvertFrom-SecureString |
  Set-Content "$env:USERPROFILE\.geins\credential.dpapi"
```

```json
{ "credentialCommand": "set \"PSModulePath=\" && powershell.exe -NoProfile -Command \"[Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR((Get-Content $env:USERPROFILE\\.geins\\credential.dpapi | ConvertTo-SecureString)))\"" }
```

The `set "PSModulePath="` prefix is not optional. Without it, a PowerShell 7 parent leaks its
module path into the built-in 5.1 and `ConvertTo-SecureString` fails to load with a module or
type-data error.

If `az` or `op` is available on your Windows machines, prefer one of those instead: same command on
every platform, and nothing encrypted on local disk.

### CI

Set `GEINS_MGMT_API_USER`, `GEINS_MGMT_API_PWD` and `GEINS_MGMT_API_KEY` as environment variables
from your runner's secret store. They outrank both the command and the files, so CI needs no
config at all.

### Checking it works

Names the resolving source and proves all three values arrive, printing no value:

```
node scripts/get.js --check-credentials [--profile <name>]
```

```
profile 'default' resolves from credentialCommand: az keyvault secret show --vault-name geins-kv ...
All three values resolved.
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
