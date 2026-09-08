<#
.SYNOPSIS
    Reads from the Geins Management API (https://mgmtapi.geins.io/API).

.DESCRIPTION
    Three read shapes: a single GET by path, one unpaged POST {Resource}/Query, and -All to walk
    every page of POST {Resource}/Query/{page}. Credentials come from the SecretManagement vault,
    falling back to the GEINS_MGMT_API_* environment variables. The response goes to stdout as
    JSON so it can be piped into jq.

    This script cannot mutate anything: GET, or the Query endpoints that read via POST. Use
    Send-GeinsApi.ps1 for writes, which is deliberately a separate entry point so the two can
    carry different permissions.

.PARAMETER Path
    The path below /API, e.g. "Product/1234" or "Order/Statuses".

.PARAMETER Resource
    The resource to query, e.g. "Product". Posts the filter to {Resource}/Query, or with -All
    walks {Resource}/Query/{page}.

.PARAMETER All
    Reads every page. Only Order, Product and User expose a paged Query endpoint; the reference
    index marks which.

.PARAMETER Query
    Query string values as key=value strings, e.g. -Query "include=names".

.PARAMETER Filter
    The query object as a JSON string, e.g. '{"UpdatedAfter":"2026-09-01T00:00:00Z"}'.

.PARAMETER MaxPages
    Page cap for -All. Defaults to 100, which is 100k rows at the API's page size of 1000. The run
    warns rather than truncating silently.

.NOTES
    Every parameter takes strings so the script binds correctly under `pwsh -File`, which passes
    arguments through as text and would hand a [hashtable] parameter the literal "@{...}".

.EXAMPLE
    pwsh -File scripts/geins/Get-GeinsApi.ps1 -Path "Product/1234" -Query "include=names"

.EXAMPLE
    pwsh -File scripts/geins/Get-GeinsApi.ps1 -Resource Brand -Filter '{"ExternalIds":["abc"]}'

.EXAMPLE
    pwsh -File scripts/geins/Get-GeinsApi.ps1 -Resource Product -All -Filter '{"UpdatedAfter":"2026-09-01T00:00:00Z"}'
#>
[CmdletBinding(DefaultParameterSetName = "Single")]
param(
    [Parameter(Mandatory, ParameterSetName = "Single", Position = 0)]
    [string]$Path,

    [Parameter(Mandatory, ParameterSetName = "Query")]
    [string]$Resource,

    [Parameter(ParameterSetName = "Query")]
    [switch]$All,

    [Parameter(ParameterSetName = "Query")]
    [string]$Filter,

    [Parameter(ParameterSetName = "Query")]
    [int]$MaxPages = 100,

    [string[]]$Query,

    [string]$ProfileName = "default"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Import-Module (Join-Path $PSScriptRoot "GeinsApi.psm1") -Force

$queryValues = ConvertTo-GeinsApiQuery -Pair $Query

$response = if ($PSCmdlet.ParameterSetName -eq "Single") {
    Invoke-GeinsApiRequest -Method GET -Path $Path -Query $queryValues -ProfileName $ProfileName
} elseif ($All) {
    Invoke-GeinsApiQuery -Resource $Resource -Body $Filter -Query $queryValues -ProfileName $ProfileName -MaxPages $MaxPages
} else {
    Invoke-GeinsApiRequest -Method POST -Path "$Resource/Query" -Query $queryValues -Body $Filter -ProfileName $ProfileName
}

$response | ConvertTo-Json -Depth 100
