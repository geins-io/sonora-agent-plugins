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

More than one account is a second key under `profiles`, selected with `--profile <name>`. Each
profile resolves independently, so production can sit behind a vault while a scratch account stays
in a file. See [Profiles](plugins/geins/README.md#profiles).

Verify whichever you chose, without printing anything:

```
node plugins/geins/skills/mgmtapi/scripts/get.js --check-credentials
```

## Plugins

| Plugin | Skill | What it does |
| --- | --- | --- |
| `geins` | `/geins:mgmtapi` | Reads and writes the Geins Management API, with the full endpoint reference bundled |

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
