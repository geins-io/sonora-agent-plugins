# Geins Claude Code plugins

A [plugin marketplace](https://code.claude.com/docs/en/plugin-marketplaces) for working with Geins
from Claude Code.

## Install

```
/plugin marketplace add jmandery/geins-claude-plugins
/plugin install geins@geins-plugins
```

`geins@geins-plugins` is `<plugin>@<marketplace>`, both named in the manifests, so it stays the
same wherever the repository is hosted.

If the install summary says `Run /reload-plugins to activate.`, run that.

## Credentials

Three values from an API User in Geins Merchant Center, supplied one of three ways. First match
wins:

| | Source | Use it for |
| --- | --- | --- |
| 1 | `GEINS_MGMT_API_USER`, `GEINS_MGMT_API_PWD`, `GEINS_MGMT_API_KEY` environment variables | CI, and one-off overrides |
| 2 | a `credentialCommand` that fetches them from a vault | teams, and anywhere a plaintext file is not acceptable |
| 3 | `.env.geins` in the repository, then `~/.geins/.env` | getting started on one machine |

### The quick way

```
mkdir -p ~/.geins
printf 'GEINS_MGMT_API_USER=\nGEINS_MGMT_API_PWD=\nGEINS_MGMT_API_KEY=\n' > ~/.geins/.env
chmod 600 ~/.geins/.env
```

Fill in the three values. That one file serves every repository you open, on every platform, since
the path comes from the OS home directory. On Windows it is `%USERPROFILE%\.geins\.env` and the
profile's own ACL already restricts it to you. See
[`plugins/geins/.env.geins.example`](plugins/geins/.env.geins.example) for the extra keys that add
a second account or point at a staging host.

### The safer way

A file the plugin can read is a file it can print. Point a profile at your vault instead and no
secret touches disk:

```jsonc
// ~/.geins/config.json — where to fetch from, not what to fetch. No secrets in here.
{
  "profiles": {
    "default": { "credentialCommand": "az keyvault secret show --vault-name geins-kv --name mgmtapi-labs --query value -o tsv" }
  }
}
```

Worked examples for Azure Key Vault, 1Password, macOS Keychain, Linux libsecret, a Windows DPAPI
file and CI are in
[the plugin's README](plugins/geins/README.md#keeping-credentials-out-of-files-entirely), including
how to store the secret in each.

### More than one account

A second key under `profiles` is a second account. Each resolves independently, so production can
sit behind a vault while a scratch account stays in a file.

Once there are two, `/geins:profile` asks which one the session works with, at the start of the
session, and every call after that uses it without a flag:

```
/geins:profile          # list them and choose
/geins:profile prod     # switch straight to prod
```

Nothing is assumed on your behalf: with two profiles configured and none chosen, a call fails and
lists them instead of quietly using `default`. With a single profile configured, none of this
appears. See [Profiles](plugins/geins/README.md#profiles).

Verify whichever you chose, without printing anything:

```
node plugins/geins/skills/mgmtapi/scripts/get.js --check-credentials
node plugins/geins/skills/mgmtapi/scripts/profile.js --list --verify
```

## Using it

There is no command to remember. Ask for what you want and the skill loads itself when the request
means talking to your account rather than changing local code:

```
> How many orders were created in the last 30 days, by status?
```

Claude picks the route from the bundled endpoint reference, calls the API through the plugin's
scripts, and answers. Reads run without a permission prompt.

### Your first session

If you have more than one account configured, Claude asks which one to work with before anything
else happens, and every call for the rest of the session uses it:

```
> Which profile do you want to work with?
  ● labs  Labs        credentialCommand
  ● prod  Production  Live store — writes are real
```

Pick one and carry on. To change account later, or to choose before being asked:

```
/geins:profile          # list them and choose
/geins:profile prod     # switch straight to prod
```

With a single account configured, none of this appears — you are never asked anything.

### Asking for things

```
> Which products have no price in the SEK price list?
> Show me order 100234 with its rows and shipping address.
> What stock do we have on the Bestseller brand, by size?
> List the markets and their currencies.
> Which customers ordered more than five times this year?
> Are any webhooks pointing at a URL that no longer resolves?
```

Vague is fine. `How is stock looking?` gets a useful answer; naming a brand, market or date range
gets a sharper one.

### Changing things

Writes always prompt, and the skill will not make a bulk change without showing you a count first:

```
> Set Custom1 sort orders on all products, scarcest stock first.
```

Claude reads the affected products, tells you how many it found, shows one example request, and
waits. Nothing is sent until you say so. Every write names the account it is about to touch:

```
PUT Product/1234  (profile prod — Production, from session selection)
```

If you want to be sure before starting, ask it to do the read half first:

```
> Don't change anything yet — how many products would that touch?
```

### Being explicit

Useful when you want no ambiguity about the account or the shape of the answer:

```
> Using the labs profile, delete the test products whose SKU starts with ZZZ-.
> Give me that as CSV, one row per variant.
> Verify that by reading the products back and comparing against what you sent.
```

## Plugins

| Plugin | Provides | What it does |
| --- | --- | --- |
| `geins` | `/geins:mgmtapi` | Reads and writes the Geins Management API, with the full endpoint reference bundled |
| `geins` | `/geins:profile` | Lists the configured accounts and picks the one this session works with |

## Requirements

Node 18 or later on the PATH. Nothing else: the scripts have no dependencies and the endpoint
reference ships generated, so no install step, YAML parser or copy of the API spec is needed.

## Development

Test without installing:

```
claude --plugin-dir ./plugins/geins
```

Validate before publishing, and bump `version` in `plugins/geins/.claude-plugin/plugin.json` on
every release so installs pick the change up:

```
claude plugin validate ./plugins/geins
```
