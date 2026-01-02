#!/bin/bash
set -e

# 🐳 Docker Registry Deployment Script
# Déploie un registre Docker privé avec UI

echo "🚀 Starting Docker Registry deployment..."

# Configuration
ENV_FILE="${1:-.env}"
DEPLOY_DIR="${DEPLOY_DIR:-/srv/www/registry-staging}"
REGISTRY_DOM="${REGISTRY_DOM:-registry-staging.freijstack.com}"
REGISTRY_UI_DOM="${REGISTRY_UI_DOM:-registry-ui-staging.freijstack.com}"

echo "📂 Deploy directory: $DEPLOY_DIR"
echo "🌐 Registry domain: $REGISTRY_DOM"
echo "🌐 Registry UI domain: $REGISTRY_UI_DOM"

# Créer le répertoire de déploiement
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Copier les fichiers de configuration
if [ ! -f "docker-compose.yml" ]; then
  echo "📝 Creating docker-compose.yml..."
  cat > docker-compose.yml <<'COMPOSE'
version: '3.8'

services:
  registry:
    image: registry:2
    container_name: registry-staging
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
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.registry.rule=Host(`registry-staging.freijstack.com`)"
      - "traefik.http.routers.registry.entrypoints=websecure"
      - "traefik.http.routers.registry.tls.certresolver=mytlschallenge"
      - "traefik.http.services.registry.loadbalancer.server.port=5000"

  registry-ui:
    image: joxit/docker-registry-ui:latest
    container_name: registry-ui-staging
    restart: unless-stopped
    environment:
      SINGLE_REGISTRY: "true"
      REGISTRY_TITLE: "Freijstack Private Registry"
      REGISTRY_URL: "https://registry-staging.freijstack.com"
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
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.registry-ui.rule=Host(`registry-ui-staging.freijstack.com`)"
      - "traefik.http.routers.registry-ui.entrypoints=websecure"
      - "traefik.http.routers.registry-ui.tls.certresolver=mytlschallenge"
      - "traefik.http.services.registry-ui.loadbalancer.server.port=80"

volumes:
  registry-data:
    driver: local

networks:
  web:
    external: true
COMPOSE
fi

if [ ! -f "config.yml" ]; then
  echo "⚙️ Creating registry config..."
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
mkdir -p data/auth

# Démarrer les services
echo "🐳 Starting Docker Registry and UI..."
docker compose up -d

echo "⏳ Waiting for services to be healthy..."
sleep 10

# Vérifier la santé
echo ""
echo "📊 Service status:"
docker compose ps

echo ""
echo "🏥 Health check:"
echo "- Registry API:"
docker compose exec -T registry curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5000/v2/ || echo "❌ Registry not responding"

echo "- Registry UI:"
docker compose exec -T registry-ui curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:80/ || echo "❌ Registry UI not responding"

echo ""
echo "✅ Docker Registry deployment complete!"
echo ""
echo "🌐 Access points:"
echo "   Registry API: https://$REGISTRY_DOM"
echo "   Registry UI: https://$REGISTRY_UI_DOM"
echo ""
echo "🔧 Usage:"
echo "   docker build -t $REGISTRY_DOM/myimage:latest ."
echo "   docker push $REGISTRY_DOM/myimage:latest"
echo ""
echo "📂 Configuration files in: $DEPLOY_DIR"
echo "   - docker-compose.yml"
echo "   - config.yml"
echo "   - data/ (storage)"
