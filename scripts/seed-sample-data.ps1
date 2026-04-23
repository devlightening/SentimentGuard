#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Seeds MongoDB with a sample analysis job using the small dataset.
  The API must be running on localhost:5000.
#>
$file = "C:\Users\hy971\source\repos\SentimentGuard\sample-data\product_reviews_small.csv"
$apiUrl = "http://localhost:5000/api/uploads"

Write-Host "Uploading $file to $apiUrl..." -ForegroundColor Cyan

$form = @{ file = Get-Item $file }
try {
  $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Form $form
  Write-Host "Job created: $($response.id)" -ForegroundColor Green
  Write-Host "Open http://localhost:3000/jobs/$($response.id) to view results."
} catch {
  Write-Error "Upload failed: $_"
}
