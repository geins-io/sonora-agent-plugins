# Litium agent plugins

A plugin marketplace for working with Litium Sonora from Claude Code, the GitHub Copilot CLI or
OpenAI Codex. All three read the same
[Claude Code marketplace format](https://code.claude.com/docs/en/plugin-marketplaces).

## Prerequisites

[Node](https://nodejs.org) 18 or later on the PATH, for global `fetch`. Nothing else: the scripts
have no dependencies and the endpoint reference ships generated, so there is no install step, YAML
parser or copy of the API spec needed.

Check what you have:

```
node --version
```

If that prints `v18` or higher, skip ahead to [Install](#install). If it errors, or the number is
lower, install it:

| Platform | |
| --- | --- |
| Windows | `winget install OpenJS.NodeJS.LTS`, or the installer from [nodejs.org](https://nodejs.org) |
| macOS | `brew install node`, or the installer from [nodejs.org](https://nodejs.org) |
| Linux | your package manager, or [nodesource.com](https://github.com/nodesource/distributions) for a current LTS |

To keep several versions side by side, use [nvm](https://github.com/nvm-sh/nvm) (macOS and Linux)
or [nvm-windows](https://github.com/coreybutler/nvm-windows) and then `nvm install --lts`.

Open a new terminal afterwards so the PATH change is picked up, and run `node --version` again to
confirm. The agent reads the PATH of the shell it was started from, so restart it too if it was
already running.

## Install

```
/plugin marketplace add geins-io/sonora-agent-plugins
/plugin install sonora@litium-plugins
```

`sonora@litium-plugins` is `<plugin>@<marketplace>`, both named in the manifests, so it stays the
same wherever the repository is hosted.

If the install summary says `Run /reload-plugins to activate.`, run that.

### Other agents

GitHub Copilot CLI and OpenAI Codex read this same marketplace, so the same repository and plugin
name install there too:

```
copilot plugin marketplace add geins-io/sonora-agent-plugins
copilot plugin install sonora@litium-plugins

codex plugin marketplace add geins-io/sonora-agent-plugins
codex plugin add sonora@litium-plugins
```

Credentials and profiles are shared across all three, since they live in `~/.sonora`.

Codex runs sandboxed commands without asking, and Copilot does once you allow shell commands, so
neither has Claude Code's prompt before each write. The plugin gates writes itself there: the agent
has to show you the request, and you have to reply, before it can send it. See
[the write gate](plugins/sonora/README.md#the-write-gate).

**Copilot CLI**

- Network access is approved per domain. Approve `mgmtapi.geins.io` when asked, or start with
  `--allow-url=mgmtapi.geins.io`.
- It runs the SessionStart hook but does not show its output to the model, so with several
  profiles you are asked when the first call fails rather than at session start.
- The profile picker is `/sonora:profile`, as in Claude Code.
- VS Code's Copilot agent mode picks up plugins installed by the CLI. That is untested: if VS Code
  does not set `COPILOT_AGENT_SESSION_ID` for shell commands, profiles are not remembered there and
  writes are not gated.

**Codex**

- It runs a plugin's hooks only after you trust them in `/hooks`. Trust both of sonora's:
  SessionStart (`profile.js --hook`) raises the profile question, and UserPromptSubmit
  (`write-gate.js --hook`) records your replies. Without the second, every write is refused. Codex
  asks again when an update changes a hook.
- The profile picker is `$sonora:profile`.
- The plugin keeps session state in `~/.sonora/sessions`. Codex's sandbox writes only inside the
  workspace, or nowhere in read-only mode, so run in workspace-write mode and make that directory
  writable. If it is not, a chosen profile is passed as `--profile` on each call, and **writes to
  the API are refused**.

  ```
  mkdir -p ~/.sonora/sessions
  ```

  ```toml
  # ~/.codex/config.toml
  [sandbox_workspace_write]
  writable_roots = ["C:\\Users\\<you>\\.sonora\\sessions"]   # or "/home/<you>/.sonora/sessions"
  ```

- On Windows, use `[windows] sandbox = "unelevated"`. The `elevated` mode runs commands as a
  separate user that cannot read the plugin's files.
- Tested on Windows, where the API was reachable from workspace-write mode without enabling network
  access. If calls fail with a network error on macOS or Linux, add `network_access = true` under
  `[sandbox_workspace_write]`.

## Credentials

Three values from an API User in Sonora Merchant Center, supplied one of three ways. First match
wins:

| | Source | Use it for |
| --- | --- | --- |
| 1 | `SONORA_MGMT_API_USER`, `SONORA_MGMT_API_PWD`, `SONORA_MGMT_API_KEY` environment variables | CI, and one-off overrides |
| 2 | a `credentialCommand` that fetches them from a vault | teams, and anywhere a plaintext file is not acceptable |
| 3 | `.env.sonora` in the repository, then `~/.sonora/.env` | getting started on one machine |

### The quick way

```
mkdir -p ~/.sonora
printf 'SONORA_MGMT_API_USER=\nSONORA_MGMT_API_PWD=\nSONORA_MGMT_API_KEY=\n' > ~/.sonora/.env
chmod 600 ~/.sonora/.env
```

Fill in the three values. That one file serves every repository you open, on every platform, since
the path comes from the OS home directory. On Windows it is `%USERPROFILE%\.sonora\.env` and the
profile's own ACL already restricts it to you. See
[`plugins/sonora/.env.sonora.example`](plugins/sonora/.env.sonora.example) for the extra keys that add
a second account or point at a staging host.

### The safer way

A file the plugin can read is a file it can print. Point a profile at your vault instead and no
secret touches disk:

```jsonc
// ~/.sonora/config.json — where to fetch from, not what to fetch. No secrets in here.
{
  "profiles": {
    "default": { "credentialCommand": "az keyvault secret show --vault-name sonora-kv --name mgmtapi-labs --query value -o tsv" }
  }
}
```

Worked examples for Azure Key Vault, 1Password, macOS Keychain, Linux libsecret, a Windows DPAPI
file and CI are in
[the plugin's README](plugins/sonora/README.md#keeping-credentials-out-of-files-entirely), including
how to store the secret in each.

### More than one account

A second key under `profiles` is a second account. Each resolves independently, so production can
sit behind a vault while a scratch account stays in a file.

Once there are two, the agent asks which one the session works with before the first call, and
every call after that uses it without a flag. To choose or switch yourself:

```
/sonora:profile          # list them and choose
/sonora:profile prod     # switch straight to prod
```

The same works in the Copilot CLI; Codex writes it `$sonora:profile`.

Nothing is assumed on your behalf: with two profiles configured and none chosen, a call fails and
lists them instead of quietly using `default`. With a single profile configured, none of this
appears. See [Profiles](plugins/sonora/README.md#profiles).

Verify whichever you chose, without printing anything:

```
node plugins/sonora/skills/mgmtapi/scripts/get.js --check-credentials
node plugins/sonora/skills/mgmtapi/scripts/profile.js --list --verify
```

## Using it

There is no command to remember. Ask for what you want and the skill loads itself when the request
means talking to your account rather than changing local code:

```
> How many orders were created in the last 30 days, by status?
```

The agent picks the route from the bundled endpoint reference, calls the API through the plugin's
scripts, and answers. In Claude Code, reads run without a permission prompt.

### Your first session

If you have more than one account configured, the agent asks which one to work with before the
first call, and every call for the rest of the session uses it. In Claude Code that looks like:

```
> Which profile do you want to work with?
  ● labs  Labs        credentialCommand
  ● prod  Production  Live store — writes are real
```

Pick one and carry on. To change account later, or to choose before being asked:

```
/sonora:profile          # list them and choose
/sonora:profile prod     # switch straight to prod
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

Nothing is written until you agree. Claude Code asks before each write; in Codex, in Copilot, and in
Claude Code modes that do not prompt, the plugin refuses to send a request you have not been shown
and answered. A bulk change also needs a count first:

```
> Set Custom1 sort orders on all products, scarcest stock first.
```

The agent reads the affected products, tells you how many it found, shows one example request, and
waits. Every write names the account it is about to touch:

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

| Plugin | Claude Code and Copilot CLI | Codex | What it does |
| --- | --- | --- | --- |
| `sonora` | `/sonora:mgmtapi` | `$sonora:mgmtapi` | Reads and writes the Sonora Management API, with the full endpoint reference bundled |
| `sonora` | `/sonora:profile` | `$sonora:profile` | Lists the configured accounts and picks the one this session works with |

## Development

Test without installing:

```
claude --plugin-dir ./plugins/sonora
```

The same directory loads in the Copilot CLI with `copilot --plugin-dir ./plugins/sonora`, and
`copilot --plugin-dir ./plugins/sonora skill list` reports skills that fail to load.

Codex has no such flag. Add the checkout as a local marketplace; Codex installs a copy, so remove
and add the plugin again after each change:

```
codex plugin marketplace add .
codex plugin add sonora@litium-plugins
codex plugin remove sonora@litium-plugins   # before re-adding
```

Validate before publishing, and bump `version` in `plugins/sonora/.claude-plugin/plugin.json` on
every release so installs pick the change up:

```
claude plugin validate ./plugins/sonora
```
