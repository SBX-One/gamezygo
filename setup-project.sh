#!/bin/bash

# Setup Script for Gamezygo E-Commerce Project
# This script initializes the Next.js (Pages Router) and Laravel projects using Docker.

echo -e "\e[36m=== Gamezygo Docker Setup & Project Initialization ===\e[0m"

# 1. Ensure directories exist
mkdir -p backend frontend

# 2. Initialize Laravel Backend
if [ ! -f "backend/artisan" ]; then
    echo -e "\e[33mInitializing Laravel 13 backend in ./backend...\e[0m"
    
    # Run composer create-project in a temporary directory inside container, then copy files to /app
    docker run --rm -v "$(pwd)/backend:/app" -w /app composer sh -c "composer create-project --prefer-dist laravel/laravel /tmp/laravel '13.*' && cp -rn /tmp/laravel/. /app/"
    
    # Copy env configuration
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "\e[90mCreated backend/.env from example template.\e[0m"
    fi
    echo -e "\e[32mLaravel backend files copy complete.\e[0m"
else
    echo -e "\e[32mLaravel backend already initialized.\e[0m"
fi

# 3. Initialize Next.js Frontend
if [ ! -f "frontend/package.json" ]; then
    echo -e "\e[33mInitializing Next.js 16 (Pages Router) frontend in ./frontend...\e[0m"
    
    # Run create-next-app in a temporary directory inside Node container, then copy files to /app
    docker run --rm -v "$(pwd)/frontend:/app" -w /app node:22-alpine sh -c "npx --yes create-next-app@16 /tmp/nextjs --typescript --tailwind --no-app --src-dir --import-alias '@/*' --use-npm --eslint && cp -rn /tmp/nextjs/. /app/"
    
    # Copy env configuration
    if [ -f "frontend/.env.local.example" ]; then
        cp frontend/.env.local.example frontend/.env.local
        echo -e "\e[90mCreated frontend/.env.local from example template.\e[0m"
    fi
    echo -e "\e[32mNext.js frontend files copy complete.\e[0m"
else
    echo -e "\e[32mNext.js frontend already initialized.\e[0m"
fi

# 4. Instructions
echo -e "\n\e[36m=== Setup Complete! ===\e[0m"
echo -e "To start the Docker services, run:"
echo -e "  \e[37mdocker-compose up -d --build\e[0m"
echo -e "\nNext.js will be running at: \e[37mhttp://localhost:3000\e[0m"
echo -e "Laravel API will be running at: \e[37mhttp://localhost:8000\e[0m"
