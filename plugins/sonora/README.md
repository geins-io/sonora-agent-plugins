# sonora

Talk to the [Sonora Management API](https://www.geins.io/developers/management-api) from any
repository.

## What you get

`/sonora:mgmtapi` — Claude reads and writes your Sonora account through two Node entry points bundled
with the skill, with the API's 162 endpoints across 21 resources documented locally so it picks the
right route without probing.

`/sonora:profile` — pick which Sonora account the session works with. With more than one configured,
you are asked at the start of a session rather than left to remember a flag.

Reads run without a permission prompt. Writes always prompt, and the skill requires a count and a
preview before any bulk change.

## Using it

Nothing to invoke: ask for what you want, and the skill loads when the request means talking to
your account rather than changing local code.

```
> How many orders were created in the last 30 days, by status?
> Which products have no price in the SEK price list?
> Show me order 100234 with its rows and shipping address.
> What stock do we have on the Bestseller brand, by size?
> Which customers ordered more than five times this year?
```

Writes take the same route but stop for you first. Ask for the change, and Claude reads the
affected set, reports the count, shows one example request and waits:

```
> Set Custom1 sort orders on all products, scarcest stock first.
> Move every product in the Sale category to the Clearance category.
> Delete the test products whose SKU starts with ZZZ-.
```

Nothing is sent until you agree to the number it shows you. Every write names the account first:

```
PUT Product/1234  (profile prod — Production, from session selection)
```

Two phrasings worth knowing. To stay read-only while you think:

```
> Don't change anything yet — how many products would that touch?
```

And to confirm a bulk write actually landed, because the batch endpoints report success either way:

```
> Read those back and compare against what you sent.
```

If more than one account is configured, Claude asks which to use at the start of the session; see
[Profiles](#profiles). With one account it never asks.

## Setup

Put three values from an API User in Sonora Merchant Center into `~/.sonora/.env`:

```
SONORA_MGMT_API_USER=
SONORA_MGMT_API_PWD=
SONORA_MGMT_API_KEY=
```

A `.env.sonora` in the repository you are working in is read first if present, and real environment
variables win over both, so CI needs no file. Copy `.env.sonora.example` for the extra keys that add
a second account (`_<PROFILE>` suffix) or retarget the base URL. With one account configured there
is nothing more to do — profiles only start asking anything of you once there are two.

Credentials are never written to the repository, and the skill instructs Claude never to read or
print those files.

## Upgrading from 3.x

The plugin was called `geins` before 4.0.0, and everything it reads was named to match. The old
names still work, so an existing setup keeps running untouched, but each variable warns once per
run:

| 3.x | 4.0.0 |
| --- | --- |
| `GEINS_MGMT_API_*` | `SONORA_MGMT_API_*` |
| `~/.geins/.env` | `~/.sonora/.env` |
| `~/.geins/config.json` | `~/.sonora/config.json` |
| `.env.geins` | `.env.sonora` |
| `.geins.json` | `.sonora.json` |

Sonora-named files and variables win wherever both are present, so profiles can move one at a time.
The fallback is meant to be temporary and will go in a later major version.

Two things do not carry over. The selected profile lives in `~/.sonora/sessions` now, so the first
call in an already-open session asks which profile to use again. And `mgmtapi.geins.io` is
unchanged: the API host has not been rebranded, so the default base URL still points at it.

## Keeping credentials out of files entirely

Optional, and worth doing once more than one person uses this. Configure a `credentialCommand` and
the plugin fetches credentials from your vault at call time instead of reading them off disk.

Config says only *where* to fetch from, so it contains no secrets and is safe to read, print and
commit:

```jsonc
// ~/.sonora/config.json, or .sonora.json in a repository
{
  "profiles": {
    "default": { "credentialCommand": "az keyvault secret show --vault-name sonora-kv --name mgmtapi-labs --query value -o tsv" },
    "prod":    { "credentialCommand": "op read op://Private/sonora-mgmtapi-prod/credential" }
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
SONORA_MGMT_API_USER=api-user
SONORA_MGMT_API_PWD=...
SONORA_MGMT_API_KEY=...
```

Store all three as **one** secret in whatever shape suits your vault. One secret means one fetch,
one thing to rotate, and one thing to grant access to. The examples below all store the JSON form.

Only stdout is read. Anything the command writes to stderr is shown when it fails, and its stdout
never appears in an error message, because that is the secret.

### Azure Key Vault

Central, revocable, and `az login` is usually already on the machine. The best fit for a team.

```bash
# store, once, by whoever administers the vault
az keyvault secret set --vault-name sonora-kv --name mgmtapi-labs \
  --value '{"username":"api-user","password":"...","apiKey":"..."}'

# grant each person read access to that one secret
az role assignment create --role "Key Vault Secrets User" \
  --assignee person@example.com \
  --scope "$(az keyvault show --name sonora-kv --query id -o tsv)/secrets/mgmtapi-labs"
```

```json
{ "credentialCommand": "az keyvault secret show --vault-name sonora-kv --name mgmtapi-labs --query value -o tsv" }
```

### 1Password

```bash
op item create --category=login --title='sonora-mgmtapi' \
  'credential[text]={"username":"api-user","password":"...","apiKey":"..."}'
```

```json
{ "credentialCommand": "op read \"op://Private/sonora-mgmtapi/credential\"" }
```

### macOS Keychain

No extra tooling: `security` ships with macOS.

```bash
security add-generic-password -s sonora-mgmtapi -a default \
  -w '{"username":"api-user","password":"...","apiKey":"..."}'
```

```json
{ "credentialCommand": "security find-generic-password -s sonora-mgmtapi -a default -w" }
```

### Linux, libsecret

Needs `secret-tool` from `libsecret-tools`, and an unlocked keyring in the session.

```bash
secret-tool store --label='Sonora Management API' service sonora-mgmtapi account default
# paste the JSON on stdin
```

```json
{ "credentialCommand": "secret-tool lookup service sonora-mgmtapi account default" }
```

### Windows, DPAPI file

Windows Credential Manager has no built-in CLI that reads a secret back out, so the dependency-free
option is a DPAPI-encrypted file. The ciphertext is bound to your Windows user account, so another
user on the same machine cannot decrypt it.

```powershell
# store, once
'{"username":"api-user","password":"...","apiKey":"..."}' |
  ConvertTo-SecureString -AsPlainText -Force | ConvertFrom-SecureString |
  Set-Content "$env:USERPROFILE\.sonora\credential.dpapi"
```

```json
{ "credentialCommand": "set \"PSModulePath=\" && powershell.exe -NoProfile -Command \"[Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR((Get-Content $env:USERPROFILE\\.sonora\\credential.dpapi | ConvertTo-SecureString)))\"" }
```

The `set "PSModulePath="` prefix is not optional. Without it, a PowerShell 7 parent leaks its
module path into the built-in 5.1 and `ConvertTo-SecureString` fails to load with a module or
type-data error.

If `az` or `op` is available on your Windows machines, prefer one of those instead: same command on
every platform, and nothing encrypted on local disk.

### CI

Set `SONORA_MGMT_API_USER`, `SONORA_MGMT_API_PWD` and `SONORA_MGMT_API_KEY` as environment variables
from your runner's secret store. They outrank both the command and the files, so CI needs no
config at all.

### Profiles

Every source is per profile, so accounts can come from different places. A profile is a key under
`profiles`, and `label` and `description` are optional text that make it recognisable when you are
asked to pick one:

```jsonc
{
  "profiles": {
    "labs": {
      "label": "Labs",
      "credentialCommand": "az keyvault secret show --vault-name sonora-kv --name mgmtapi-labs --query value -o tsv"
    },
    "prod": {
      "label": "Production",
      "description": "Live store — writes are real",
      "credentialCommand": "op read op://Private/sonora-mgmtapi-prod/credential"
    }
  }
}
```

#### Listing them

```
node scripts/profile.js --list
```

```
  labs  Labs        credentialCommand
  prod  Production  credentialCommand <- selected for this session
```

`--list --verify` additionally runs each `credentialCommand` to prove it resolves. Plain `--list`
runs nothing, so it never sets off a vault prompt per profile.

#### Choosing one for a session

`/sonora:profile` lists the profiles, asks which to use, and remembers the answer for the rest of the
session. With more than one profile configured, a SessionStart hook raises the question before any
call is made, so a session starts by naming the account it is about to touch.

```
/sonora:profile          # list and choose
/sonora:profile prod     # switch straight to prod
```

Under the hood that is:

```
node scripts/profile.js --use prod      # record the choice
node scripts/profile.js --current       # what is active, and why
node scripts/profile.js --clear         # forget it
```

The choice lives in `~/.sonora/sessions/<session id>.json` and holds a profile name, nothing else.
Two sessions can therefore work against two accounts at once without interfering, and the file is
swept after seven days. Outside Claude Code there is no session, so use `--profile` or
`SONORA_MGMT_API_PROFILE` there.

Set `"profilePrompt"` to `"first-use"` to be asked lazily at the first API call instead of at session
start, or `"never"` to be left alone:

```jsonc
{ "profilePrompt": "first-use", "profiles": { } }
```

#### Which profile a call uses

1. `--profile <name>` on the command line
2. `SONORA_MGMT_API_PROFILE` in the environment
3. the profile selected for this session
4. the single configured profile, when only one is configured

**With two or more configured and none selected, the call fails** and lists them, rather than
quietly falling back to `default`:

```
2 profiles are configured and none is selected for this session:
  labs  Labs        credentialCommand
  prod  Production  credentialCommand
Choose one with /sonora:profile, or pass --profile <name>.
```

A single-profile setup never sees any of this: no hook question, no error, no new flag.

Sources can be mixed. A profile with no `credentialCommand` falls back to the `.env` files on its
own, so `labs` can come from a vault while a scratch account stays in a file under its
suffixed keys:

```
SONORA_MGMT_API_USER_LABS=...
SONORA_MGMT_API_PWD_LABS=...
SONORA_MGMT_API_KEY_LABS=...
```

The suffix is the profile name uppercased, with anything outside `A-Z0-9` replaced by `_`. The
`default` profile takes no suffix.

To override one profile's command for a single run, set
`SONORA_MGMT_API_CREDENTIAL_COMMAND_<PROFILE>`. It beats the config file and affects only that
profile.

Each profile resolves once per process, so a paged read against `prod` costs one vault call and
never touches the credentials of another profile.

Keeping production behind its own profile name is the point. A write always names the account it is
about to hit, and where that choice came from, before it sends anything:

```
$ node scripts/send.js --method PUT --path "Product/1234" --body-file ./product.json
PUT Product/1234  (profile prod — Production, from session selection)
{ ... }
Not sent. Re-run with --confirm to send this request.
```

### Checking it works

Names the resolving source and proves all three values arrive, printing no value:

```
node scripts/get.js --check-credentials [--profile <name>]
```

```
profile 'default' resolves from credentialCommand: az keyvault secret show --vault-name sonora-kv ...
All three values resolved.
```

## Requirements

Node 18 or later on the PATH, for global `fetch`. The scripts have no dependencies, so there is no
install step.

Check with `node --version`. If it errors or prints a lower number, install it — `winget install
OpenJS.NodeJS.LTS` on Windows, `brew install node` on macOS, your package manager on Linux, or the
installer from [nodejs.org](https://nodejs.org). See
[Prerequisites](../../README.md#prerequisites).

## Layout

```
commands/profile.md        /sonora:profile, the session profile picker
hooks/hooks.json           SessionStart, raises the profile question
skills/mgmtapi/
├── SKILL.md
├── references/        generated endpoint and schema reference, one file per resource
└── scripts/
    ├── sonora-api.js      transport: credentials, profiles, auth, retries, paging, batching
    ├── get.js             reads
    ├── send.js            writes, --confirm required
    ├── profile.js         lists profiles, records the session's choice
    └── sync-api-spec.js   maintainer tool, regenerates references/
```

## Command line

```
node scripts/get.js     --path <route> [--query k=v]... [--profile <name>]
node scripts/get.js     --resource <name> [--all] [--filter <json>] [--max-pages <n>]
node scripts/send.js    --method POST|PUT|PATCH|DELETE --path <route>
                        [--body <json> | --body-file <path>] [--query k=v]... --confirm
node scripts/profile.js --list [--verify] | --use <name> | --current | --clear
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
