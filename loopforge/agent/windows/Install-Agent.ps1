param(
    [string]$AppsRoot = "C:\LoopForge\apps",
    [string]$BinRoot = "C:\LoopForge\bin",
    [string]$LogsRoot = "C:\LoopForge\logs"
)

$ErrorActionPreference = "Stop"

Write-Host "LoopForge Agent — preparing Windows host..." -ForegroundColor Violet

New-Item -ItemType Directory -Force -Path $AppsRoot, $BinRoot, $LogsRoot | Out-Null

Write-Host "Created:" -ForegroundColor Green
Write-Host "  Apps:  $AppsRoot"
Write-Host "  Bin:   $BinRoot"
Write-Host "  Logs:  $LogsRoot"

Write-Host "`nNext: download NSSM to $BinRoot\nssm.exe or set path in LoopForge Settings." -ForegroundColor Cyan
Write-Host "Start LoopForge UI: cd loopforge && pnpm dev" -ForegroundColor Cyan
