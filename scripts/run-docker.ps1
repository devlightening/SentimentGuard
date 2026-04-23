#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Starts SentimentGuard with Docker Compose.
#>
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

if (-not (Test-Path "$root\.env")) {
  Copy-Item "$root\.env.example" "$root\.env"
  Write-Host "Created .env from .env.example — edit HMAC_SECRET if needed." -ForegroundColor Yellow
}

Write-Host "Starting SentimentGuard..." -ForegroundColor Cyan
docker-compose -f "$root\docker-compose.yml" up --build -d

Write-Host ""
Write-Host "Services starting:" -ForegroundColor Green
Write-Host "  Web UI  -> http://localhost:3000"
Write-Host "  API     -> http://localhost:5000/swagger"
Write-Host "  MongoDB -> mongodb://localhost:27017"
Write-Host ""
Write-Host "Run 'docker-compose logs -f' to watch logs."
