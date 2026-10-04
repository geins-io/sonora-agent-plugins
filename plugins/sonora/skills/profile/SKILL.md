---
name: profile
description: List the Sonora profiles and choose which account this session works with.
license: MIT
argument-hint: "[profile name]"
disable-model-invocation: true
allowed-tools: Bash(node "${CLAUDE_SKILL_DIR}/../mgmtapi/scripts/profile.js" *)
---

# Choose a Sonora profile

A profile is one Sonora account. The choice is remembered for this session only, so another session
can work against another account at the same time.

If `${CLAUDE_SKILL_DIR}` appears literally below, it stands for the directory that contains this
SKILL.md; substitute that absolute path.

Do not read the scripts' source; their output is all you need.

Requested profile: `$ARGUMENTS`

That line is empty when no name was given. If it still shows a placeholder instead of a name, your
agent did not fill it in: take the profile name, if any, from the user's message.

If a profile name was given, run this with the name in place, report the result in one line, and
stop. Do not list the profiles or ask the user anything. Never run it with a placeholder left in;
the shell expands that to nothing:

```
node "${CLAUDE_SKILL_DIR}/../mgmtapi/scripts/profile.js" --use $ARGUMENTS
```

If `--use` answers that no profile has that name, show the user its list of configured profiles and
ask which they meant.

Only if no profile name was given, list them and let the user pick:

```
node "${CLAUDE_SKILL_DIR}/../mgmtapi/scripts/profile.js" --list
```

Then ask the user (with `AskUserQuestion` where you have it), using each profile's label as the
option description, and record the answer with `--use <name>`. Report the choice in one line and
stop; do not call the API afterwards unless the user asked for something else.

If `--use` reports that it cannot record the selection (no session id, or the directory is not
writable), tell the user the choice will be passed as `--profile <name>` on each call for the rest
of the conversation, and do that.

A profile shown as `no credentials` is configured but cannot resolve. Offer it only if the user
insists, and say that it will fail until its `credentialCommand` or its `_<PROFILE>` env keys exist.
