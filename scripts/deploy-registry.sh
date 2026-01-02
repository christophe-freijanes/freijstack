#!/bin/bash
set -e

# 🐳 Docker Registry Deployment Script
# Déploie un registre Docker privé avec UI

# Usage:
#   ./deploy-registry.sh staging
#   ./deploy-registry.sh production
#   Or set environment variables:
#   TARGET_ENV=staging REGISTRY_DOM=... ./deploy-registry.sh

ENVIRONMENT="${1:-staging}"

if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
  echo "❌ Invalid environment. Use 'staging' or 'production'"
  exit 1
fi

# Configuration par environnement
if [ "$ENVIRONMENT" = "staging" ]; then
  DEPLOY_DIR="${DEPLOY_DIR:-/srv/www/registry-staging}"
  REGISTRY_DOM="${REGISTRY_DOM:-registry-staging.freijstack.com}"
  REGISTRY_UI_DOM="${REGISTRY_UI_DOM:-registry-ui-staging.freijstack.com}"
  CONTAINER_PREFIX="registry-staging"
  REGISTRY_TITLE="Freijstack Private Registry (Staging)"
else
  DEPLOY_DIR="${DEPLOY_DIR:-/srv/www/registry}"
  REGISTRY_DOM="${REGISTRY_DOM:-registry.freijstack.com}"
  REGISTRY_UI_DOM="${REGISTRY_UI_DOM:-registry-ui.freijstack.com}"
  CONTAINER_PREFIX="registry"
  REGISTRY_TITLE="Freijstack Private Registry (Production)"
fi

echo "🚀 Starting Docker Registry deployment..."
echo "🎯 Environment: $ENVIRONMENT"
echo "📂 Deploy directory: $DEPLOY_DIR"
echo "🌐 Registry domain: $REGISTRY_DOM"
echo "🌐 Registry UI domain: $REGISTRY_UI_DOM"

# Créer le répertoire de déploiement
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Copier les fichiers de configuration depuis GitHub ou créer localement
REPO_URL="https://raw.githubusercontent.com/christophe-freijanes/freijstack"
BRANCH=$([ "$ENVIRONMENT" = "staging" ] && echo "develop" || echo "main")
COMPOSE_FILE=$([ "$ENVIRONMENT" = "staging" ] && echo "docker-compose.staging.yml" || echo "docker-compose.prod.yml")

echo ""
echo "📝 Setting up configuration files..."

# Télécharger ou créer docker-compose.yml
if command -v curl &> /dev/null; then
  echo "   Downloading $COMPOSE_FILE from GitHub..."
  curl -s "$REPO_URL/$BRANCH/saas/registry/$COMPOSE_FILE" -o docker-compose.yml
  curl -s "$REPO_URL/$BRANCH/saas/registry/config.yml" -o config.yml
else
  echo "   Creating docker-compose.yml locally..."
  # Créer localement si pas de curl
  cat > docker-compose.yml <<'COMPOSE'
version: '3.8'

services:
  registry:
    image: registry:2
    restart: unless-stopped
    environment:
      REGISTRY_HTTP_RELATIVEURLS: "true"
      REGISTRY_STORAGE_DELETE_ENABLED: "true"
    volumes:
      - registry-data:/var/lib/registry
      - ./config.yml:/etc/docker/registry/config.yml:ro
    networks:
      - web
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/v2/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

  registry-ui:
    image: joxit/docker-registry-ui:latest
    restart: unless-stopped
    environment:
      SINGLE_REGISTRY: "true"
      DELETE_IMAGES: "true"
      SHOW_CONTENT_DIGEST: "true"
    depends_on:
      registry:
        condition: service_healthy
    networks:
      - web
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/"]
      interval: 30s
      timeout: 5s
      retries: 3

volumes:
  registry-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ./data

networks:
  web:
    external: true
COMPOSE

  cat > config.yml <<'CONFIG'
version: 0.1
log:
  level: info
storage:
  filesystem:
    rootdirectory: /var/lib/registry
http:
  addr: :5000
  headers:
    X-Content-Type-Options:
      - nosniff
    Access-Control-Allow-Origin:
      - '*'
    Access-Control-Allow-Methods:
      - HEAD
      - GET
      - OPTIONS
      - DELETE
    Access-Control-Allow-Headers:
      - Authorization
      - Accept
      - Cache-Control
CONFIG
fi

# Créer le répertoire de données
mkdir -p data/auth logs

echo "🛑 Stopping existing services (if any)..."
docker compose down || true

echo "🆙 Starting Docker Registry and UI..."
docker compose up -d

echo "⏳ Waiting for services to be healthy..."
sleep 15

# Vérifier la santé
echo ""
echo "📊 Service status:"
docker compose ps

echo ""
echo "🏥 Health check:"

# Attendre que registry soit healthy
MAX_ATTEMPTS=30
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  if docker compose exec -T registry curl -s -f http://localhost:5000/v2/ > /dev/null 2>&1; then
    echo "✅ Registry API is healthy"
    break
  fi
  ATTEMPT=$((ATTEMPT + 1))
  echo "   Attempt $ATTEMPT/$MAX_ATTEMPTS - waiting for registry..."
  sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
  echo "⚠️  Registry API not responding after $MAX_ATTEMPTS attempts"
fi

# Vérifier registry-ui
if docker compose exec -T registry-ui curl -s -f http://localhost:80/ > /dev/null 2>&1; then
  echo "✅ Registry UI is healthy"
else
  echo "⚠️  Registry UI not responding (may still be starting)"
fi

echo ""
echo "✅ Docker Registry deployment complete for $ENVIRONMENT!"
echo ""
echo "🌐 Access points:"
echo "   Registry API: https://$REGISTRY_DOM"
echo "   Registry UI: https://$REGISTRY_UI_DOM"
echo ""
echo "🔧 Usage:"
echo "   docker build -t $REGISTRY_DOM/portfolio:latest ./saas/portfolio"
echo "   docker push $REGISTRY_DOM/portfolio:latest"
echo "   docker login $REGISTRY_DOM"
echo ""
echo "📂 Configuration files in: $DEPLOY_DIR"
echo "   - docker-compose.yml"
echo "   - config.yml"
echo "   - data/ (persistent storage)"
echo "   - logs/ (optional)"
