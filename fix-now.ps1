# Quick Fix Script for Import Error
# This fixes the "ERR_PACKAGE_PATH_NOT_EXPORTED" error

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "  Fixing Import Error - Quick Reinstall" -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Removing old packages..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✅ Removed node_modules" -ForegroundColor Green
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✅ Removed package-lock.json" -ForegroundColor Green
}
Write-Host ""

Write-Host "Step 2: Installing correct packages..." -ForegroundColor Yellow
npm install
Write-Host ""

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Installation successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Step 3: Verifying setup..." -ForegroundColor Yellow
    node setup-check.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==============================================================" -ForegroundColor Green
        Write-Host "  ✅ All fixed! Ready to start the bot" -ForegroundColor Green
        Write-Host "==============================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Run: npm start" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ Installation failed. Check error messages above." -ForegroundColor Red
}
