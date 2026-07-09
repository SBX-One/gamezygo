# Setup Script for Gamezygo E-Commerce Project
# This script initializes the Next.js (Pages Router) and Laravel projects using Docker.

Write-Host "=== Gamezygo Docker Setup & Project Initialization ===" -ForegroundColor Cyan

# 1. Ensure directories exist
if (-not (Test-Path -Path "backend")) {
    New-Item -ItemType Directory -Path "backend" | Out-Null
}
if (-not (Test-Path -Path "frontend")) {
    New-Item -ItemType Directory -Path "frontend" | Out-Null
}

# Get absolute path of current folder
$currentDir = (Get-Location).Path

# 2. Initialize Laravel Backend
if (-not (Test-Path -Path "backend\artisan")) {
    Write-Host "Initializing Laravel 13 backend in ./backend..." -ForegroundColor Yellow
    
    # Run composer create-project in a temporary directory inside the container, then copy files to /app
    docker run --rm -v "${currentDir}\backend:/app" -w /app composer sh -c "composer create-project --prefer-dist laravel/laravel /tmp/laravel '13.*' && cp -rn /tmp/laravel/. /app/"
    
    # Copy env configuration
    if (Test-Path -Path "backend\.env.example") {
        Copy-Item -Path "backend\.env.example" -Destination "backend\.env" -Force
        Write-Host "Created backend/.env from example template." -ForegroundColor Gray
    }
    
    Write-Host "Laravel backend files copy complete." -ForegroundColor Green
} else {
    Write-Host "Laravel backend already initialized." -ForegroundColor Green
}

# 3. Initialize Next.js Frontend
if (-not (Test-Path -Path "frontend\package.json")) {
    Write-Host "Initializing Next.js 16 (Pages Router) frontend in ./frontend..." -ForegroundColor Yellow
    
    # Run create-next-app in a temporary directory inside Node container, then copy files to /app
    docker run --rm -v "${currentDir}\frontend:/app" -w /app node:22-alpine sh -c "npx --yes create-next-app@16 /tmp/nextjs --typescript --tailwind --no-app --src-dir --import-alias '@/*' --use-npm --eslint && cp -rn /tmp/nextjs/. /app/"
    
    # Copy env configuration
    if (Test-Path -Path "frontend\.env.local.example") {
        Copy-Item -Path "frontend\.env.local.example" -Destination "frontend\.env.local" -Force
        Write-Host "Created frontend/.env.local from example template." -ForegroundColor Gray
    }
    
    Write-Host "Next.js frontend files copy complete." -ForegroundColor Green
} else {
    Write-Host "Next.js frontend already initialized." -ForegroundColor Green
}

# 4. Instructions
Write-Host "`n=== Setup Complete! ===" -ForegroundColor Cyan
Write-Host "To start the Docker services, run:" -ForegroundColor Yellow
Write-Host "  docker-compose up -d --build" -ForegroundColor White
Write-Host "`nNext.js will be running at: http://localhost:3000" -ForegroundColor White
Write-Host "Laravel API will be running at: http://localhost:8000" -ForegroundColor White
