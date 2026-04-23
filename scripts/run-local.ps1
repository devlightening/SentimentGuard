#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Starts SentimentGuard services locally (no Docker).
  Requires: .NET 8, Python 3.11+, Node 18+, MongoDB on localhost:27017
#>
$root = Split-Path $PSScriptRoot -Parent

Write-Host "Starting MongoDB check..." -ForegroundColor Cyan
try {
  $result = Invoke-Expression "mongosh --eval 'db.runCommand({ping:1})' --quiet" 2>$null
} catch {
  Write-Warning "MongoDB may not be running. Start it before proceeding."
}

# Start Backend
Write-Host "Starting Backend API on :5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$root\backend'; dotnet run --project SentimentGuard.Api --launch-profile http`""

Start-Sleep 2

# Start Worker
Write-Host "Starting Python Worker on :8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$root\worker'; py -m app.main`""

Start-Sleep 2

# Start Frontend
Write-Host "Starting Frontend on :5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$root\web'; npm run dev`""

Write-Host ""
Write-Host "All services starting:" -ForegroundColor Green
Write-Host "  Web UI  -> http://localhost:5173"
Write-Host "  API     -> http://localhost:5000/swagger"
