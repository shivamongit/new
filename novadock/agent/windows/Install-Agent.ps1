param(
    [string]$AppsRoot = "C:\NovaDock\apps",
    [string]$BinRoot = "C:\NovaDock\bin",
    [string]$LogsRoot = "C:\NovaDock\logs"
)

$ErrorActionPreference = "Stop"

Write-Host "NovaDock Agent — preparing Windows host..." -ForegroundColor Violet

New-Item -ItemType Directory -Force -Path $AppsRoot, $BinRoot, $LogsRoot | Out-Null

Write-Host "Created:" -ForegroundColor Green
Write-Host "  Apps:  $AppsRoot"
Write-Host "  Bin:   $BinRoot"
Write-Host "  Logs:  $LogsRoot"

Write-Host "`nNext: download NSSM to $BinRoot\nssm.exe or set path in NovaDock Settings." -ForegroundColor Cyan
Write-Host "Start NovaDock UI: cd novadock && pnpm dev" -ForegroundColor Cyan
