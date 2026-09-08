# geins

Talk to the [Geins Management API](https://www.geins.io/developers/management-api) from any
repository.

## What you get

`/geins:mgmtapi` — Claude reads and writes your Geins account through two PowerShell entry points
bundled with the skill, with the API's 162 endpoints across 21 resources documented locally so it
picks the right route without probing.

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
a second account (`_<PROFILE>` suffix, used with `-ProfileName`) or retarget the base URL.

Credentials are never written to the repository, and the skill instructs Claude never to read or
print those files.

## Requirements

PowerShell 7 (`pwsh`) on the PATH.

## Layout

```
skills/mgmtapi/
├── SKILL.md
├── references/        generated endpoint and schema reference, one file per resource
└── scripts/
    ├── GeinsApi.psm1          transport: auth, retries, paging, batching
    ├── Get-GeinsApi.ps1       reads
    ├── Send-GeinsApi.ps1      writes, confirmation required
    ├── Set-GeinsCredential.ps1  optional SecretManagement vault storage
    └── sync-api-spec.js       maintainer tool, regenerates references/
```

## Updating the reference

`references/` is generated from the API's OpenAPI spec:

```
node scripts/sync-api-spec.js --spec ../geins-web/content/api-refs/rest/mgmtapi.yaml
```

It finds a `geins-web` checkout beside any ancestor directory on its own, so `--spec` is usually
unnecessary. Regenerate when the spec changes, then bump the plugin version.
