#!/usr/bin/env bash
# ==========================================
# Gamezygo Idempotent VPS Deployment Script
# Usage: ./docker/scripts/deploy.sh [staging|production]
# ==========================================

set -e

ENV_TARGET="${1:-staging}"
echo "=========================================="
echo "🚀 Deploying Gamezygo [$ENV_TARGET]..."
echo "=========================================="

# Ensure environment files exist
if [ ! -f backend/.env ]; then
  if [ -f backend/.env.example ]; then
    echo "⚠️ backend/.env missing. Creating from .env.example..."
    cp backend/.env.example backend/.env
  else
    echo "❌ backend/.env is required before deploying!"
    exit 1
  fi
fi

# Build and start all production containers
echo "📦 Building and starting production Docker containers..."
docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

# Wait for database container to be healthy
echo "⏳ Waiting for PostgreSQL container to become ready..."
docker compose -f docker-compose.prod.yml exec -T postgres sh -c 'until pg_isready; do sleep 1; done'

# Run Laravel database migrations
echo "🗄️ Running database migrations..."
docker compose -f docker-compose.prod.yml exec -T backend php artisan migrate --force

# Optimize Laravel route, config, and event caches
echo "⚡ Optimizing Laravel production caches..."
docker compose -f docker-compose.prod.yml exec -T backend php artisan config:cache
docker compose -f docker-compose.prod.yml exec -T backend php artisan route:cache
docker compose -f docker-compose.prod.yml exec -T backend php artisan view:cache

# Restart queue worker to pick up latest code changes
echo "🔄 Restarting queue workers..."
docker compose -f docker-compose.prod.yml exec -T backend php artisan queue:restart || true

# Prune old dangling images to keep VPS disk space clean
echo "🧹 Pruning unused Docker images..."
docker image prune -f

echo "=========================================="
echo "✅ Gamezygo [$ENV_TARGET] deployed successfully!"
echo "=========================================="
