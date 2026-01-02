#!/bin/bash
set -e

# 🧪 Docker Registry Test Script
# Teste le déploiement depuis release-test branch

BRANCH="${1:-release-test}"
ENVIRONMENT="${2:-staging}"

echo "🧪 Testing Docker Registry from branch: $BRANCH"
echo "🎯 Environment: $ENVIRONMENT"

if [ "$ENVIRONMENT" = "staging" ]; then
  DEPLOY_DIR="/srv/www/registry-staging"
  REGISTRY_DOM="registry-staging.freijstack.com"
else
  DEPLOY_DIR="/srv/www/registry"
  REGISTRY_DOM="registry.freijstack.com"
fi

echo "📂 Deploy directory: $DEPLOY_DIR"
echo ""

# Créer le répertoire s'il n'existe pas
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

echo "📝 Downloading configuration from GitHub ($BRANCH)..."

# Déterminer le fichier compose approprié
if [ "$ENVIRONMENT" = "staging" ]; then
  COMPOSE_FILE="docker-compose.staging.yml"
else
  COMPOSE_FILE="docker-compose.prod.yml"
fi

# Télécharger les fichiers
echo "   Downloading $COMPOSE_FILE..."
curl -s "https://raw.githubusercontent.com/christophe-freijanes/freijstack/$BRANCH/saas/registry/$COMPOSE_FILE" -o docker-compose.yml

echo "   Downloading config.yml..."
curl -s "https://raw.githubusercontent.com/christophe-freijanes/freijstack/$BRANCH/saas/registry/config.yml" -o config.yml

# Vérifier les téléchargements
if [ ! -f "docker-compose.yml" ]; then
  echo "❌ Failed to download docker-compose.yml"
  exit 1
fi

if [ ! -f "config.yml" ]; then
  echo "❌ Failed to download config.yml"
  exit 1
fi

echo "✅ Files downloaded successfully"
echo ""

# Préparer les répertoires
mkdir -p data/auth logs

echo "🛑 Stopping existing services..."
docker compose down || echo "   No services running"

echo "🆙 Starting services from branch: $BRANCH..."
docker compose up -d

echo "⏳ Waiting for services to be healthy..."
sleep 20

# Vérifier le statut
echo ""
echo "📊 Service status:"
docker compose ps

echo ""
echo "🏥 Health checks:"

# Vérifier registry
REGISTRY_HEALTH=$(docker compose exec -T registry wget --quiet --tries=1 --spider http://localhost:5000/v2/ 2>&1 && echo "✅" || echo "❌")
echo "   Registry API: $REGISTRY_HEALTH"

# Vérifier registry-ui
UI_HEALTH=$(docker compose exec -T registry-ui wget --quiet --tries=1 --spider http://localhost:80/ 2>&1 && echo "✅" || echo "❌")
echo "   Registry UI: $UI_HEALTH"

echo ""
echo "📊 Test Summary:"
echo "   Branch: $BRANCH"
echo "   Environment: $ENVIRONMENT"
echo "   Directory: $DEPLOY_DIR"
echo ""
echo "🌐 Access points:"
echo "   Registry: https://$REGISTRY_DOM"
if [ "$ENVIRONMENT" = "staging" ]; then
  echo "   UI: https://registry-ui-staging.freijstack.com"
else
  echo "   UI: https://registry-ui.freijstack.com"
fi

echo ""
echo "📋 View logs:"
echo "   docker compose -f $DEPLOY_DIR/docker-compose.yml logs -f"

echo ""
echo "✅ Test completed from $BRANCH branch!"
