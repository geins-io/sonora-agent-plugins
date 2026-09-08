Set-StrictMode -Version Latest

$script:SecretPrefix = "geins-mgmtapi"
$script:EnvFileValues = $null

function Get-GeinsApiEnvFilePath {
    [CmdletBinding()]
    param()

    # Resolved against the caller's working directory, never $PSScriptRoot: these scripts ship
    # inside a plugin, so paths relative to the module land in the plugin cache rather than in
    # the repository the user is working on. The home copy serves every repository at once.
    $paths = [System.Collections.Generic.List[string]]::new()

    if (-not [string]::IsNullOrWhiteSpace($env:CLAUDE_PROJECT_DIR)) {
        $paths.Add((Join-Path $env:CLAUDE_PROJECT_DIR ".env.geins"))
    }

    $paths.Add((Join-Path (Get-Location).Path ".env.geins"))
    $paths.Add((Join-Path ([Environment]::GetFolderPath("UserProfile")) ".geins/.env"))

    return $paths
}

function Import-GeinsApiEnvFile {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path
    )

    $values = @{}

    if (-not (Test-Path -Path $Path)) {
        return $values
    }

    foreach ($line in (Get-Content -Path $Path)) {
        $trimmed = $line.Trim()

        if ($trimmed.Length -eq 0 -or $trimmed.StartsWith("#")) {
            continue
        }

        $separator = $trimmed.IndexOf("=")
        if ($separator -lt 1) {
            continue
        }

        $key = $trimmed.Substring(0, $separator).Trim()
        $value = $trimmed.Substring($separator + 1).Trim()

        $isQuoted = $value.Length -ge 2 -and (
            ($value.StartsWith('"') -and $value.EndsWith('"')) -or
            ($value.StartsWith("'") -and $value.EndsWith("'"))
        )
        if ($isQuoted) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        $values[$key] = $value
    }

    return $values
}

function Get-GeinsApiSetting {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Name
    )

    $value = [Environment]::GetEnvironmentVariable($Name)
    if (-not [string]::IsNullOrWhiteSpace($value)) {
        return $value
    }

    if ($null -eq $script:EnvFileValues) {
        $script:EnvFileValues = @{}
        foreach ($path in (Get-GeinsApiEnvFilePath)) {
            foreach ($entry in (Import-GeinsApiEnvFile -Path $path).GetEnumerator()) {
                if (-not $script:EnvFileValues.ContainsKey($entry.Key)) {
                    $script:EnvFileValues[$entry.Key] = $entry.Value
                }
            }
        }
    }

    if ($script:EnvFileValues.ContainsKey($Name)) {
        return $script:EnvFileValues[$Name]
    }

    return $null
}

function Get-GeinsApiBaseUrl {
    [CmdletBinding()]
    param()

    $configured = Get-GeinsApiSetting -Name "GEINS_MGMT_API_BASEURL"
    if ([string]::IsNullOrWhiteSpace($configured)) {
        return "https://mgmtapi.geins.io/API"
    }

    return $configured.TrimEnd("/")
}

function Get-GeinsApiCredential {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$ProfileName
    )

    $suffix = if ($ProfileName -eq "default") { "" } else { "_" + ($ProfileName.ToUpperInvariant() -replace "[^A-Z0-9]", "_") }

    $resolved = @{}
    foreach ($field in @("USER", "PWD", "KEY")) {
        $resolved[$field] = Get-GeinsApiSetting -Name "GEINS_MGMT_API_$field$suffix"
    }

    if (-not ($resolved.Values | Where-Object { [string]::IsNullOrWhiteSpace($_) })) {
        return @{
            Username = $resolved["USER"]
            Password = $resolved["PWD"]
            ApiKey   = $resolved["KEY"]
        }
    }

    $credentialSecret = "$script:SecretPrefix-$ProfileName"

    if (Get-Command -Name Get-Secret -ErrorAction SilentlyContinue) {
        try {
            # SecretManagement warns loudly when no vault is registered, which is the normal case
            # once credentials live in a .env file.
            $credential = Get-Secret -Name $credentialSecret -ErrorAction Stop -WarningAction SilentlyContinue
            $apiKey = Get-Secret -Name "$credentialSecret-apikey" -AsPlainText -ErrorAction Stop -WarningAction SilentlyContinue

            return @{
                Username = $credential.UserName
                Password = $credential.GetNetworkCredential().Password
                ApiKey   = $apiKey
            }
        } catch {
            Write-Verbose "Vault lookup for '$credentialSecret' failed: $($_.Exception.Message)"
        }
    }

    $homeEnvFile = Join-Path ([Environment]::GetFolderPath("UserProfile")) ".geins/.env"
    $searched = (Get-GeinsApiEnvFilePath) -join ", "
    throw "No credentials for profile '$ProfileName'. Set GEINS_MGMT_API_USER$suffix, GEINS_MGMT_API_PWD$suffix and GEINS_MGMT_API_KEY$suffix in $homeEnvFile to serve every repository, or in a .env.geins in this repository. Searched: $searched"
}

function Get-GeinsApiHeaders {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [hashtable]$Credential
    )

    $pair = "$($Credential.Username):$($Credential.Password)"
    $basic = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($pair))

    return @{
        Authorization = "Basic $basic"
        "X-ApiKey"    = $Credential.ApiKey
        Accept        = "application/json"
    }
}

function Get-GeinsApiUri {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path,

        [hashtable]$Query
    )

    $uri = "$(Get-GeinsApiBaseUrl)/$($Path.TrimStart('/'))"

    if ($Query -and $Query.Count -gt 0) {
        $pairs = foreach ($key in $Query.Keys) {
            "{0}={1}" -f [System.Uri]::EscapeDataString([string]$key), [System.Uri]::EscapeDataString([string]$Query[$key])
        }
        $uri = "$uri" + "?" + ($pairs -join "&")
    }

    return $uri
}

function ConvertTo-GeinsApiQuery {
    [CmdletBinding()]
    param(
        [AllowNull()]
        [string[]]$Pair
    )

    $query = @{}

    foreach ($value in @($Pair)) {
        if ([string]::IsNullOrWhiteSpace($value)) {
            continue
        }

        $separator = $value.IndexOf("=")
        if ($separator -lt 1) {
            throw "Query values must be key=value, got '$value'."
        }

        $query[$value.Substring(0, $separator)] = $value.Substring($separator + 1)
    }

    return $query
}

function Get-GeinsApiProperty {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [AllowNull()]
        $InputObject,

        [Parameter(Mandatory)]
        [string]$Name
    )

    if ($null -eq $InputObject) {
        return $null
    }

    if ($InputObject -is [hashtable]) {
        return $InputObject[$Name]
    }

    $property = $InputObject.PSObject.Properties[$Name]
    if ($null -eq $property) {
        return $null
    }

    return $property.Value
}

function Invoke-GeinsApiRequest {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [ValidateSet("GET", "POST", "PUT", "PATCH", "DELETE")]
        [string]$Method,

        [Parameter(Mandatory)]
        [string]$Path,

        [string]$ProfileName = "default",

        [hashtable]$Query,

        [AllowNull()]
        $Body,

        [int]$MaxAttempts = 4
    )

    $credential = Get-GeinsApiCredential -ProfileName $ProfileName
    $uri = Get-GeinsApiUri -Path $Path -Query $Query

    $arguments = @{
        Uri                     = $uri
        Method                  = $Method
        Headers                 = Get-GeinsApiHeaders -Credential $credential
        SkipHttpErrorCheck      = $true
        StatusCodeVariable      = "statusCode"
        ResponseHeadersVariable = "responseHeaders"
    }

    if ($null -ne $Body) {
        $arguments["Body"] = if ($Body -is [string]) { $Body } else { $Body | ConvertTo-Json -Depth 100 }
        $arguments["ContentType"] = "application/json"
    }

    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        $response = Invoke-RestMethod @arguments

        if ($statusCode -lt 400) {
            return $response
        }

        $isTransient = $statusCode -eq 429 -or $statusCode -ge 500
        if (-not $isTransient -or $attempt -eq $MaxAttempts) {
            $detail = if ($null -eq $response) { "" } else { $response | ConvertTo-Json -Depth 5 -Compress }
            throw "$Method $uri failed with HTTP $statusCode. $detail"
        }

        $delaySeconds = [Math]::Pow(2, $attempt)
        $retryAfter = $responseHeaders["Retry-After"] | Select-Object -First 1
        $parsedRetryAfter = 0.0
        if ($retryAfter -and [double]::TryParse($retryAfter, [ref]$parsedRetryAfter)) {
            $delaySeconds = $parsedRetryAfter
        }

        Write-Warning "$Method $uri returned HTTP $statusCode, retrying in $delaySeconds s (attempt $attempt of $MaxAttempts)."
        Start-Sleep -Seconds $delaySeconds
    }
}

function Invoke-GeinsApiQuery {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Resource,

        [string]$ProfileName = "default",

        [AllowNull()]
        $Body,

        [hashtable]$Query,

        [int]$MaxPages = 100
    )

    $items = [System.Collections.Generic.List[object]]::new()
    $batchId = $null
    $pageCount = $null

    for ($page = 1; $page -le $MaxPages; $page++) {
        # Page 1 creates a batch from the filter and returns its BatchId; later pages must send
        # that id instead of the filter, which the server then reuses.
        $pageBody = if ($page -eq 1 -or [string]::IsNullOrWhiteSpace($batchId)) { $Body } else { @{ BatchId = $batchId } }

        $response = Invoke-GeinsApiRequest -Method POST -Path "$Resource/Query/$page" -Query $Query -Body $pageBody -ProfileName $ProfileName
        $pageItems = @(@(Get-GeinsApiProperty -InputObject $response -Name "Resource") | Where-Object { $null -ne $_ })

        if ($pageItems.Count -gt 0) {
            $items.AddRange($pageItems)
        }

        $pageResult = Get-GeinsApiProperty -InputObject $response -Name "PageResult"
        $batchId = Get-GeinsApiProperty -InputObject $pageResult -Name "BatchId"
        $pageCount = Get-GeinsApiProperty -InputObject $pageResult -Name "PageCount"

        if ($null -ne $pageCount -and $page -ge [int]$pageCount) {
            return $items
        }

        if ($null -eq $pageCount -and $pageItems.Count -eq 0) {
            return $items
        }
    }

    $total = if ($null -eq $pageCount) { "an unknown number of" } else { [int]$pageCount }
    Write-Warning "Read $MaxPages of $total pages of $Resource; raise -MaxPages to read the rest."
    return $items
}

Export-ModuleMember -Function Get-GeinsApiCredential, Invoke-GeinsApiRequest, Invoke-GeinsApiQuery, Get-GeinsApiProperty, ConvertTo-GeinsApiQuery
