<#
.SYNOPSIS
    Writes to the Geins Management API (https://mgmtapi.geins.io/API).

.DESCRIPTION
    Issues one POST, PUT, PATCH or DELETE. Prints the request and refuses to send it unless
    -Confirm:$false is passed, so an unattended run has to state its intent in the command line
    where a reviewer or a permission prompt can see it.

    Writes live here rather than in Get-GeinsApi.ps1 so the read path can be allowlisted while
    every write still prompts.

.PARAMETER Method
    POST, PUT, PATCH or DELETE.

.PARAMETER Path
    The path below /API, e.g. "Product/1234".

.PARAMETER Body
    The request body as a JSON string.

.PARAMETER BodyFile
    A file holding the request body as JSON. Preferred over -Body for anything large, and it
    keeps the payload out of the command line.

.PARAMETER Query
    Query string values as key=value strings.

.PARAMETER ProfileName
    Which stored credential set to use. Defaults to "default".

.EXAMPLE
    pwsh -File scripts/geins/Send-GeinsApi.ps1 -Method PUT -Path "Product/1234" -BodyFile ./product.json -Confirm:$false
#>
[CmdletBinding(SupportsShouldProcess, ConfirmImpact = "High")]
param(
    [Parameter(Mandatory)]
    [ValidateSet("POST", "PUT", "PATCH", "DELETE")]
    [string]$Method,

    [Parameter(Mandatory)]
    [string]$Path,

    [string]$Body,

    [string]$BodyFile,

    [string[]]$Query,

    [string]$ProfileName = "default"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Import-Module (Join-Path $PSScriptRoot "GeinsApi.psm1") -Force

if ($Body -and $BodyFile) {
    throw "Pass either -Body or -BodyFile, not both."
}

$payload = if ($BodyFile) { Get-Content -Path $BodyFile -Raw } else { $Body }

$description = "$Method $Path"
Write-Host $description
if (-not [string]::IsNullOrWhiteSpace($payload)) {
    Write-Host $payload
}

if (-not $PSCmdlet.ShouldProcess("profile '$ProfileName'", $description)) {
    return
}

$body = if ([string]::IsNullOrWhiteSpace($payload)) { $null } else { $payload }
$response = Invoke-GeinsApiRequest -Method $Method -Path $Path -Query (ConvertTo-GeinsApiQuery -Pair $Query) -Body $body -ProfileName $ProfileName

$response | ConvertTo-Json -Depth 100
