---
name: mgmtapi
description: Call the Sonora Management API (mgmtapi.geins.io/API) to read or write products, orders, users, campaigns, prices, webhooks and more. Use whenever a task means talking to a live Sonora account rather than changing local code.
allowed-tools: Bash(node ${CLAUDE_SKILL_DIR}/scripts/get.js *), Bash(node ${CLAUDE_SKILL_DIR}/scripts/profile.js *)
---

# Sonora Management API

Two entry points, split so reads run unprompted while every write asks. Never call the API with
raw `curl`: credentials would land in the command line and the transcript, and paging, batching
and retries would be hand-rolled per task.

Always invoke through `node`, exactly as written below. That form is what the pre-approved read
permission matches.

## Reads

```
node ${CLAUDE_SKILL_DIR}/scripts/get.js --path "Product/1234" --query include=Names
node ${CLAUDE_SKILL_DIR}/scripts/get.js --resource Brand --filter '{"ExternalIds":["abc"]}'
node ${CLAUDE_SKILL_DIR}/scripts/get.js --resource Product --all --filter '{"UpdatedAfter":"2026-09-01T00:00:00Z"}'
```

`--resource X` posts the filter to `X/Query`. Adding `--all` walks `X/Query/{page}` instead, which
only Order, Product and User expose. Page size is 1000 and `--max-pages` defaults to 100, so a run
warns rather than truncating in silence. Repeat `--query` for more than one value.

Pages 2 and up must resend the `BatchId` that page 1 returned, not the filter. `--all` does that;
a hand-rolled loop that resends the filter silently rereads page 1 forever.

All three forms print JSON. Pipe to `jq` and select what the task needs instead of reading whole
payloads into context.

## Writes

```
node ${CLAUDE_SKILL_DIR}/scripts/send.js --method PUT --path "Product/1234" --body-file ./product.json --confirm
```

Without `--confirm` the script prints the request and sends nothing. Run it that way first and show
the user the request. Use `--body-file` for anything beyond a couple of fields. `send.js` refuses
`GET`, so reads cannot arrive through the write path.

Before any bulk write: read the affected set, report the count, and get the user to confirm that
number. Never loop the write script over a set you have not counted and shown.

**Verify writes by reading back.** The product batch endpoints (items, stock, sort orders,
purchase prices, relations, image relations) answer with a top-level `{"Message": "Success."}` that
has no counts; the real `UpdateCount`, `Invalid` and `NotFound` sit under `Resource`, and on an error
the same object comes back unwrapped. Read the counts from `Resource`, and treat any `Invalid` or
`NotFound` row as a partial failure. Even then the response is not proof. A re-read compared against
what you sent is.

## Finding the route

`references/endpoints.md` lists all 21 resources, how many endpoints each has, and which support a
paged query. Open the one file for the resource you need. Each holds every route with its
parameters, request and response schema names, and the schemas expanded into field tables, so a
first attempt can be correct without a trial call.

`product.md` and `variant.md` are large. Grep them for the route you want rather than reading them
whole.

Resources marked "pitfalls" in the index open with a Pitfalls section: behaviour the spec does not
state, such as defaults that silently change the outcome. Read it before any write to that resource.

Check the `Returns` line before parsing a response. Most endpoints wrap the payload in an envelope
under `Resource` alongside `Message` and `Details`; an unpaged `Query` and several `List` routes
return a bare array instead. Zero rows when the data plainly exists usually means `.Resource` was read
off a bare array.

## Things the spec does not say

- **Sort orders rank ascending, low value first.** `1000000000` is the unset sentinel that parks a
  product at the end. `Default` values run in steps of 100, so leave gaps when assigning `Custom1`
  to `Custom5` rather than numbering densely.
- **Stock lives on items, not products.** Aggregate across a product's items, and decide between
  `Stock` (physical) and `StockSellable` (after reservations) deliberately, because they diverge on
  oversold products. Sellable can be negative.
- **Language codes are per account.** Norwegian is usually `nb`, not `no`. Read an existing
  translated record before writing a new locale, and when creating anything with names or texts,
  supply every language the account uses; a single-language record shows blank in the other locales.
- **A 2xx does not mean every field took effect.** Some fields are silently ignored (`VatId` and
  `MainCategoryId` on a product) and some defaults are surprising (a new category is inactive, a new
  campaign applies to sale items only). Read back anything whose outcome matters.
- **`PUT` means different things per resource.** `Product/{id}` merges: omitted fields stay, and
  localized lists merge by language. `Campaign/{id}` and `Brand/{id}` replace the whole record, so read
  it, change what you need, and send it all back.
- **A 500 `A database error occured.` usually means a bad body, not an outage.** The scripts retry
  5xx, so it takes about 15 seconds to surface. Check the body against the resource's Pitfalls
  rather than retrying again.

## Profiles

A profile is one Sonora account. Which one a call uses is decided once, in this order:

1. `--profile <name>` on the command line
2. `SONORA_MGMT_API_PROFILE` in the environment
3. the profile selected for this session
4. the single configured profile, when only one is configured

With two or more configured and none selected, every call **fails** with the list rather than
quietly using `default`. That is deliberate: production is a profile too.

```
node ${CLAUDE_SKILL_DIR}/scripts/profile.js --list        # names, labels, where each resolves from
node ${CLAUDE_SKILL_DIR}/scripts/profile.js --use prod    # record the choice for this session
node ${CLAUDE_SKILL_DIR}/scripts/profile.js --current     # what is active, and why
```

When you have to choose one, ask the user with `AskUserQuestion` and use each profile's label as the
option description. Never guess, and never pick production to get past an error.

The selection is per session, in `~/.sonora/sessions/<session id>.json`, and holds a name only. A
profile listed as `no credentials` is configured but will fail until its credentials exist.

## Credentials

Three values from an API User in Sonora Merchant Center, read in this order:

1. `SONORA_MGMT_API_USER`, `SONORA_MGMT_API_PWD`, `SONORA_MGMT_API_KEY` in the environment
2. a `credentialCommand` configured for the profile, if there is one
3. `.env.sonora` in the repository you are working in, then `~/.sonora/.env`

A second account is the same three keys suffixed with `_<PROFILE>`.

Never read, print or echo the env files, and never include their values in output. The scripts
resolve them; nothing else needs to.

To find out which source answers, without printing any value:

```
node ${CLAUDE_SKILL_DIR}/scripts/get.js --check-credentials [--profile <name>]
```

### credentialCommand

Optional. When configured, the plugin runs a command that fetches the credentials from a vault
instead of reading them from a file, so nothing sensitive sits on disk. Config lives in
`~/.sonora/config.json`, or `.sonora.json` in the repository, and holds no secrets itself:

```json
{
  "profiles": {
    "default": {
      "label": "Labs",
      "credentialCommand": "az keyvault secret show --vault-name sonora-kv --name mgmtapi-labs --query value -o tsv"
    }
  }
}
```

`label` and `description` are optional and exist to make the picker readable. Only
`credentialCommand` affects resolution.

The command prints either JSON with `username`, `password` and `apiKey`, or `key=value` lines
using the three variable names. It runs once per process, so a paged read does not re-prompt a
keychain per request.

Each profile is a key under `profiles` with its own command, and sources can be mixed: a profile
with no command falls back to the `.env` files under its `_<PROFILE>` suffixed keys. So one account
can come from a vault while another stays in a file.

Config files are safe to read and show the user. The command string is not a secret; its output
is, so never echo that.

A 401 with `{"Message":"Unauthorized"}` means the credentials or API key are wrong for that
account, not that the route is wrong.

If a plaintext file is not acceptable, use a `credentialCommand` rather than asking the user to
paste credentials anywhere.

## Maintaining this skill

`references/` is generated from the Management API's OpenAPI spec by
`node scripts/sync-api-spec.js --spec <path to mgmtapi.yaml>`. Regenerate and release a new plugin
version when the spec changes. Nobody installing the plugin needs to run it.
