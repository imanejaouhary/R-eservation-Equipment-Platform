# Script de demarrage local pour Equipment Service
# Charge les variables depuis .env a la racine du projet, puis lance Spring Boot.
# Usage : depuis backend/equipment-service -> .\start-local.ps1

$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$envFile = Join-Path $projectRoot ".env"

if (-not (Test-Path $envFile)) {
    Write-Error "Fichier .env introuvable a l'emplacement $envFile. Copiez .env.example vers .env et renseignez POSTGRES_PASSWORD."
    exit 1
}

Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not ($line.StartsWith("#"))) {
        $parts = $line -split "=", 2
        if ($parts.Count -eq 2) {
            $key = $parts[0].Trim()
            $val = $parts[1].Trim()
            if (($val.StartsWith('"') -and $val.EndsWith('"')) -or ($val.StartsWith("'") -and $val.EndsWith("'"))) {
                if ($val.Length -ge 2) {
                    $val = $val.Substring(1, $val.Length - 2)
                }
            }
            [System.Environment]::SetEnvironmentVariable($key, $val, "Process")
        }
    }
}

$user = [System.Environment]::GetEnvironmentVariable("POSTGRES_USER", "Process")
$password = [System.Environment]::GetEnvironmentVariable("POSTGRES_PASSWORD", "Process")

if ([string]::IsNullOrWhiteSpace($user) -or [string]::IsNullOrWhiteSpace($password)) {
    Write-Error "Erreur : POSTGRES_USER ou POSTGRES_PASSWORD n'est pas renseigne dans le fichier .env."
    exit 1
}

Write-Host "Variables d'environnement chargees et validees."
Set-Location $PSScriptRoot
.\mvnw.cmd spring-boot:run
