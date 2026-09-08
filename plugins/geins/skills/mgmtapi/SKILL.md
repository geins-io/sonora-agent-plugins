---
name: mgmtapi
description: Call the Geins Management API (mgmtapi.geins.io/API) to read or write products, orders, users, campaigns, prices, webhooks and more. Use whenever a task means talking to a live Geins account rather than changing local code.
allowed-tools: Bash(pwsh -File ${CLAUDE_SKILL_DIR}/scripts/Get-GeinsApi.ps1 *)
---

# Geins Management API

Two entry points, split so reads run unprompted while every write asks. Never call the API with
raw `curl` or `Invoke-RestMethod`: credentials would land in the command line and the transcript,
and paging, batching and retries would be hand-rolled per task.

Always invoke through `pwsh -File`, exactly as written below. That form is what the pre-approved
read permission matches.

## Reads

```
pwsh -File ${CLAUDE_SKILL_DIR}/scripts/Get-GeinsApi.ps1 -Path "Product/1234" -Query "include=Names"
pwsh -File ${CLAUDE_SKILL_DIR}/scripts/Get-GeinsApi.ps1 -Resource Brand -Filter '{"ExternalIds":["abc"]}'
pwsh -File ${CLAUDE_SKILL_DIR}/scripts/Get-GeinsApi.ps1 -Resource Product -All -Filter '{"UpdatedAfter":"2026-09-01T00:00:00Z"}'
```

`-Resource X` posts the filter to `X/Query`. Adding `-All` walks `X/Query/{page}` instead, which
only Order, Product and User expose. Page size is 1000 and `-MaxPages` defaults to 100, so a run
warns rather than truncating in silence.

Pages 2 and up must resend the `BatchId` that page 1 returned, not the filter. `-All` does that;
a hand-rolled loop that resends the filter silently rereads page 1 forever.

All three forms print JSON. Pipe to `jq` and select what the task needs instead of reading whole
payloads into context.

## Writes

```
pwsh -File ${CLAUDE_SKILL_DIR}/scripts/Send-GeinsApi.ps1 -Method PUT -Path "Product/1234" -BodyFile ./product.json -Confirm:$false
```

Without `-Confirm:$false` the script prints the request and sends nothing. Run it that way first
and show the user the request. Use `-BodyFile` for anything beyond a couple of fields.

Before any bulk write: read the affected set, report the count, and get the user to confirm that
number. Never loop the write script over a set you have not counted and shown.

**Verify writes by reading back.** The batch endpoints return `{"Message": "Success."}` with
`UpdateCount`, `Invalid` and `NotFound` all null, even on a write that changed hundreds of rows.
The response is not evidence. A re-read compared against what you sent is.

## Finding the route

`references/endpoints.md` lists all 21 resources, how many endpoints each has, and which support a
paged query. Open the one file for the resource you need. Each holds every route with its
parameters, request and response schema names, and the schemas expanded into field tables, so a
first attempt can be correct without a trial call.

`product.md` and `variant.md` are large. Grep them for the route you want rather than reading them
whole.

Check the `Returns` line before parsing a response. Most endpoints wrap the payload in an envelope
under `Resource` alongside `Message` and `Details`; an unpaged `Query` and several `List` routes
return a bare array instead.

## Things the spec does not say

- **Sort orders rank ascending, low value first.** `1000000000` is the unset sentinel that parks a
  product at the end. `Default` values run in steps of 100, so leave gaps when assigning `Custom1`
  to `Custom5` rather than numbering densely.
- **Stock lives on items, not products.** Aggregate across a product's items, and decide between
  `Stock` (physical) and `StockSellable` (after reservations) deliberately, because they diverge on
  oversold products. Sellable can be negative.
- **Language codes are per account.** Norwegian is usually `nb`, not `no`. Read an existing
  translated record before writing a new locale.

## Credentials

Three values from an API User in Geins Merchant Center, read in this order:

1. `GEINS_MGMT_API_USER`, `GEINS_MGMT_API_PWD`, `GEINS_MGMT_API_KEY` in the environment
2. `.env.geins` in the repository you are working in
3. `~/.geins/.env`

The home file is the one to recommend, since it serves every repository. `.env.geins.example` in
the plugin is the template. A second account is the same three keys suffixed with `_<PROFILE>`,
reached with `-ProfileName <profile>`.

Never read, print or echo these files, and never include their values in output. The scripts
resolve them; nothing else needs to.

A 401 with `{"Message":"Unauthorized"}` means the credentials or API key are wrong for that
account, not that the route is wrong.

`scripts/Set-GeinsCredential.ps1` stores the same values in a SecretManagement vault instead, for
anyone who would rather not keep a plaintext file. It needs a vault extension module installed,
and the scripts check the files first either way.

## Maintaining this skill

`references/` is generated from the Management API's OpenAPI spec by
`node scripts/sync-api-spec.js --spec <path to mgmtapi.yaml>`. Regenerate and release a new plugin
version when the spec changes. Nobody installing the plugin needs to run it.
