# Geins Claude Code plugins

A [plugin marketplace](https://code.claude.com/docs/en/plugin-marketplaces) for working with Geins
from Claude Code.

## Install

```
/plugin marketplace add jmandery/geins-claude-plugins
/plugin install geins@geins
```

`geins@geins` is `<plugin>@<marketplace>`, both named in the manifests, so it stays the same
wherever the repository is hosted.

If the install summary says `Run /reload-plugins to activate.`, run that.

Then store your API credentials once, in `~/.geins/.env`:

```
GEINS_MGMT_API_USER=
GEINS_MGMT_API_PWD=
GEINS_MGMT_API_KEY=
```

Those come from an API User in Geins Merchant Center. That one file serves every repository you
open. See [`plugins/geins/.env.geins.example`](plugins/geins/.env.geins.example) for the extra keys
that add a second account or point at a staging host.

## Plugins

| Plugin | Skill | What it does |
| --- | --- | --- |
| `geins` | `/geins:mgmtapi` | Reads and writes the Geins Management API, with the full endpoint reference bundled |

## Requirements

PowerShell 7 (`pwsh`) on the PATH. Nothing else: the endpoint reference ships generated, so no
node, YAML parser or copy of the API spec is needed to use the plugin.

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
