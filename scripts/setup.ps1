#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Installs dependencies for all SentimentGuard components.
#>
$root = Split-Path $PSScriptRoot -Parent

Write-Host "Installing backend NuGet packages..." -ForegroundColor Cyan
Push-Location "$root\backend"
dotnet restore
Pop-Location

Write-Host "Installing Python worker packages..." -ForegroundColor Cyan
Push-Location "$root\worker"
py -m pip install -r requirements.txt
py -m textblob.download_corpora
Pop-Location

Write-Host "Installing frontend npm packages..." -ForegroundColor Cyan
Push-Location "$root\web"
npm install
Pop-Location

Write-Host ""
Write-Host "Setup complete." -ForegroundColor Green
