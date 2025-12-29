#!/bin/bash

# n8n Initialization Script
# Initializes n8n with proper configuration and database setup

set -e

echo "🤖 n8n Initialization Script"
echo "=============================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ ERROR: .env file not found!"
    echo "📝 Please create .env from .env.example:"
    echo "   cp .env.example .env"
    echo "   nano .env"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo "📂 Checking Docker volumes..."

# Create external web network if it doesn't exist
if ! docker network ls | grep -q "web"; then
    echo "🌐 Creating Docker network: web"
    docker network create web
else
    echo "✅ Docker network 'web' already exists"
fi

# Create n8n_data volume if it doesn't exist
if ! docker volume ls | grep -q "n8n_n8n_data"; then
    echo "💾 Creating Docker volume: n8n_data"
    docker volume create n8n_data
else
    echo "✅ Docker volume 'n8n_data' already exists"
fi

echo ""
echo "🐳 Starting n8n containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for n8n to be ready..."
sleep 10

echo ""
echo "🏥 Health check..."
if docker-compose ps | grep -q "n8n.*Up"; then
    echo "✅ n8n is running"
else
    echo "❌ n8n failed to start"
    docker-compose logs n8n
    exit 1
fi

echo ""
echo "📊 n8n Status:"
docker-compose ps

echo ""
echo "✅ n8n initialization complete!"
echo ""
echo "🌐 Access points:"
echo "   - Web UI: https://${SUBDOMAIN_N8N}.${DOMAIN_NAME} (via Traefik)"
echo "   - Local:  http://localhost:5678"
echo ""
echo "📖 Next steps:"
echo "   1. Open the web UI in your browser"
echo "   2. Create your first user account"
echo "   3. Start building workflows!"
echo ""
echo "📚 Documentation:"
echo "   - n8n Docs: https://docs.n8n.io/"
echo "   - README: ./README.md"
