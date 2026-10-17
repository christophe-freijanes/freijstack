#!/bin/bash
# ============================================
# Portfolio Complete Redeploy Script
# Destroys and rebuilds portfolio from scratch
# ============================================

set -e

echo "🔄 Starting complete portfolio redeployment..."

VPS_IP="${1:-31.97.10.57}"
SSH_KEY="${2:-$HOME/.ssh/freijstack_deploy}"
REGISTRY="registry.freijstack.com"
IMAGE="portfolio"

echo "📡 Connecting to VPS: $VPS_IP"

# Function to run commands on VPS
vps_cmd() {
    ssh -i "$SSH_KEY" root@"$VPS_IP" "$@"
}

echo "🗑️  Destroying current portfolio deployment..."
vps_cmd "cd /srv/www/portfolio && docker compose down -v || true" 2>/dev/null || echo "No staging to remove"
vps_cmd "cd /srv/www/portfolio && docker compose -f docker-compose.prod.yml down -v || true" 2>/dev/null || echo "No production to remove"

echo "🗑️  Removing old images..."
vps_cmd "docker rmi $REGISTRY/$IMAGE:latest -f || true" 2>/dev/null || echo "No latest image"
vps_cmd "docker rmi $REGISTRY/$IMAGE:latest-beta -f || true" 2>/dev/null || echo "No beta image"

echo "📥 Pulling fresh images from registry..."
vps_cmd "docker pull $REGISTRY/$IMAGE:latest-beta 2>&1 | tail -3"
vps_cmd "docker pull $REGISTRY/$IMAGE:latest 2>&1 | tail -3"

echo "🚀 Starting staging container..."
vps_cmd "cd /srv/www/portfolio && docker compose -p staging up -d && sleep 5"

echo "🚀 Starting production container..."
vps_cmd "cd /srv/www/portfolio && docker compose -p production -f docker-compose.prod.yml up -d && sleep 5"

echo "✅ Checking container health..."
vps_cmd "docker ps | grep portfolio | awk '{print \$NF}'"

echo "📊 Verifying responses..."
echo "Staging (port 3000):"
vps_cmd "curl -s http://127.0.0.1:3000/ | head -1"

echo ""
echo "Production (port 3001):"
vps_cmd "curl -s http://127.0.0.1:3001/ | head -1"

echo ""
echo "✅ Portfolio redeployment complete!"
echo ""
echo "📍 Access your portfolio:"
echo "   Staging:     https://portfolio-staging.freijstack.com"
echo "   Production:  https://portfolio.freijstack.com"
