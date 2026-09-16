---
description: List the Geins profiles and choose which account this session works with.
argument-hint: [profile name]
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/skills/mgmtapi/scripts/profile.js" *)
---

# Choose a Geins profile

A profile is one Geins account. The choice is remembered for this session only, so another session
can work against another account at the same time.

If `$1` is given, switch straight to it:

```
node "${CLAUDE_PLUGIN_ROOT}/skills/mgmtapi/scripts/profile.js" --use $1
```

Otherwise list them and let the user pick:

```
node "${CLAUDE_PLUGIN_ROOT}/skills/mgmtapi/scripts/profile.js" --list
```

Then ask with `AskUserQuestion`, using each profile's label as the option description, and record the
answer with `--use <name>`. Report the choice in one line and stop; do not call the API afterwards
unless the user asked for something else.

A profile shown as `no credentials` is configured but cannot resolve. Offer it only if the user
insists, and say that it will fail until its `credentialCommand` or its `_<PROFILE>` env keys exist.
