#!/bin/bash

# Script pour corriger le problème de réseau Docker sur le VPS
# Ce script supprime le réseau avec le mauvais label et redémarre les services

set -e

echo "🔧 Fixing Docker network label issue..."

TARGET_ENV="${1:-production}"

if [ "$TARGET_ENV" = "production" ]; then
  DEPLOY_DIR="/srv/www/securevault"
  NETWORK_NAME="securevault_network"
else
  DEPLOY_DIR="/srv/www/securevault-staging"
  NETWORK_NAME="securevault_staging_network"
fi

echo "🎯 Environment: $TARGET_ENV"
echo "📂 Directory: $DEPLOY_DIR"
echo "🌐 Network: $NETWORK_NAME"

ssh -i ~/.ssh/deploy_key -- *** << 'FIXSCRIPT'
  set -e
  
  echo "⏹️  Stopping containers..."
  cd $DEPLOY_DIR/saas/securevault
  docker compose down
  
  echo "🗑️  Removing network with incorrect label..."
  docker network rm $NETWORK_NAME 2>/dev/null || echo "  ℹ️  Network already removed or doesn't exist"
  
  echo "🚀 Starting services with correct configuration..."
  docker compose up -d --build --remove-orphans
  
  echo "⏳ Waiting for services to be healthy..."
  sleep 10
  
  echo "📊 Checking status..."
  docker compose ps
  
  echo "✅ Network issue fixed!"
FIXSCRIPT

echo "✨ Done!"
