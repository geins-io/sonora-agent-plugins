<#
.SYNOPSIS
    Stores a Geins Management API user and API key in a SecretManagement vault.

.DESCRIPTION
    Prompts for the API user's username, password and API key and writes them to the vault as
    "geins-mgmtapi-<profile>" (a PSCredential) and "geins-mgmtapi-<profile>-apikey" (a string).
    Nothing is echoed and nothing is written to the repository.

    This is the alternative to a .env.geins file, for anyone who would rather not keep credentials
    in plaintext. It needs a SecretManagement vault extension installed, and the scripts read the
    file first regardless, so a filled-in .env.geins wins over anything stored here.

    Run this interactively, once per account you automate against. The credentials come from the
    API User you create in the Geins Merchant Center.

    Prefers the Windows Credential Manager vault when one is registered, because its secrets are
    per-user and need no separate unlock password. It falls back to registering a local
    Microsoft.PowerShell.SecretStore vault, which is what ships with SecretManagement.

.PARAMETER ProfileName
    The profile these credentials belong to, e.g. "default" or a customer name.

.PARAMETER VaultName
    Write to a specific registered vault instead of picking one.

.EXAMPLE
    ./Set-GeinsCredential.ps1 -ProfileName default
#>
[CmdletBinding()]
param(
    [string]$ProfileName = "default",

    [string]$VaultName
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Get-Module -ListAvailable -Name Microsoft.PowerShell.SecretManagement)) {
    throw "Microsoft.PowerShell.SecretManagement is not installed. Run: Install-Module Microsoft.PowerShell.SecretManagement -Scope CurrentUser"
}

Import-Module Microsoft.PowerShell.SecretManagement

if (-not $VaultName) {
    $vaults = @(Get-SecretVault)
    $credentialManagerVault = $vaults | Where-Object { $_.ModuleName -like "*CredMan*" } | Select-Object -First 1

    if ($credentialManagerVault) {
        $VaultName = $credentialManagerVault.Name
    } elseif ($vaults.Count -gt 0) {
        $VaultName = ($vaults | Where-Object { $_.IsDefault } | Select-Object -First 1 -ExpandProperty Name)
        if (-not $VaultName) {
            $VaultName = $vaults[0].Name
        }
    } else {
        if (-not (Get-Module -ListAvailable -Name Microsoft.PowerShell.SecretStore)) {
            # Printed rather than thrown: PowerShell collapses a multi-line exception message
            # into one paragraph, which makes the commands unreadable.
            Write-Host "No SecretManagement vault is registered and no vault module is installed."
            Write-Host "Install one, then run this script again:"
            Write-Host ""
            Write-Host "  Install-Module SecretManagement.JustinGrote.CredMan -Scope CurrentUser"
            Write-Host "      Windows Credential Manager. Per-user, no unlock prompt, so unattended runs work."
            Write-Host ""
            Write-Host "  Install-Module Microsoft.PowerShell.SecretStore -Scope CurrentUser"
            Write-Host "      Microsoft-authored encrypted file. Prompts for an unlock password unless you also"
            Write-Host "      run Set-SecretStoreConfiguration -Authentication None -Interaction None."
            Write-Host ""
            Write-Host "Or skip the vault and set GEINS_MGMT_API_USER, GEINS_MGMT_API_PWD and GEINS_MGMT_API_KEY."

            throw "No vault module installed."
        }

        $VaultName = "GeinsSecretStore"
        Write-Host "No vault registered. Registering the local SecretStore vault '$VaultName'."
        Register-SecretVault -Name $VaultName -ModuleName Microsoft.PowerShell.SecretStore -DefaultVault
    }
}

Write-Host "Storing credentials for profile '$ProfileName' in vault '$VaultName'."

$credential = Get-Credential -Message "Geins Management API user for profile '$ProfileName'"
$apiKey = Read-Host -Prompt "X-ApiKey value" -AsSecureString

Set-Secret -Name "geins-mgmtapi-$ProfileName" -Secret $credential -Vault $VaultName
Set-Secret -Name "geins-mgmtapi-$ProfileName-apikey" -Secret $apiKey -Vault $VaultName

Write-Host "Stored. Verify with: Get-GeinsApi.ps1 -Path Market/List -ProfileName $ProfileName"
