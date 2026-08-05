# WhatsApp Bot - Clean Reset and Start Script
# Run this if you're having issues with "Bad MAC Error" or connection problems

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "  WhatsApp Bot - Clean Reset and Start" -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean WhatsApp session
Write-Host "Step 1: Cleaning WhatsApp session..." -ForegroundColor Yellow
if (Test-Path "auth_info_baileys") {
    Remove-Item -Recurse -Force "auth_info_baileys"
    Write-Host "✅ Deleted auth_info_baileys folder" -ForegroundColor Green
} else {
    Write-Host "✅ No auth session to clean" -ForegroundColor Green
}
Write-Host ""

# Step 2: Check node_modules
Write-Host "Step 2: Checking node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules exists" -ForegroundColor Green
    $reinstall = Read-Host "Do you want to reinstall packages? (y/N)"
    if ($reinstall -eq 'y' -or $reinstall -eq 'Y') {
        Write-Host "Removing old packages..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "node_modules"
        if (Test-Path "package-lock.json") {
            Remove-Item -Force "package-lock.json"
        }
        Write-Host "Installing packages..." -ForegroundColor Yellow
        npm install
    }
} else {
    Write-Host "⚠️  node_modules not found, installing..." -ForegroundColor Yellow
    npm install
}
Write-Host ""

# Step 3: Check .env file
Write-Host "Step 3: Checking configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "GROQ_API_KEY=gsk_") {
        Write-Host "✅ GROQ_API_KEY is set" -ForegroundColor Green
    } elseif ($envContent -match "GROQ_API_KEY=your_groq_api_key_here") {
        Write-Host "❌ GROQ_API_KEY is not configured!" -ForegroundColor Red
        Write-Host "   Please edit .env file and add your Groq API key" -ForegroundColor Red
        Write-Host "   Get it from: https://console.groq.com/keys" -ForegroundColor Yellow
        Write-Host ""
        $continue = Read-Host "Press Enter to open .env file, or Ctrl+C to cancel"
        notepad .env
        exit
    } else {
        Write-Host "⚠️  Warning: GROQ_API_KEY format looks unusual" -ForegroundColor Yellow
        Write-Host "   Make sure it starts with 'gsk_'" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "   Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "   Please edit .env and add your Groq API key" -ForegroundColor Yellow
    notepad .env
    exit
}
Write-Host ""

# Step 4: Run setup check
Write-Host "Step 4: Running setup verification..." -ForegroundColor Yellow
Write-Host ""
node setup-check.js
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Setup check failed. Please fix the issues above." -ForegroundColor Red
    Write-Host ""
    pause
    exit 1
}

# Step 5: Start the bot
Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "  Starting WhatsApp Bot..." -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 You'll need to scan the QR code with your phone" -ForegroundColor Yellow
Write-Host "   WhatsApp → Settings → Linked Devices → Link a Device" -ForegroundColor Yellow
Write-Host ""
Write-Host "🛑 Press Ctrl+C to stop the bot" -ForegroundColor Yellow
Write-Host ""
Start-Sleep -Seconds 2

npm start
