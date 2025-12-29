#!/bin/bash

# Script pour exécuter les migrations de base de données SecureVault
# Usage: ./run-migrations.sh [production|staging]

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Déterminer l'environnement
ENV="${1:-staging}"

if [ "$ENV" = "production" ]; then
    DEPLOY_DIR="/srv/www/securevault"
    PROJECT_PATH="saas/securevault"
else
    DEPLOY_DIR="/srv/www/securevault-staging"
    PROJECT_PATH="saas/securevault"
    ENV="staging"
fi

echo -e "${BLUE}🗄️  SecureVault Database Migrations${NC}"
echo -e "${BLUE}Environment: ${ENV}${NC}"
echo -e "${BLUE}Deploy directory: ${DEPLOY_DIR}${NC}"
echo ""

# Vérifier que le répertoire existe
if [ ! -d "$DEPLOY_DIR/$PROJECT_PATH" ]; then
    echo -e "${RED}❌ Directory not found: $DEPLOY_DIR/$PROJECT_PATH${NC}"
    exit 1
fi

cd "$DEPLOY_DIR/$PROJECT_PATH"

# Vérifier que PostgreSQL est en cours d'exécution
echo -e "${YELLOW}⏳ Checking PostgreSQL status...${NC}"
if ! docker compose exec -T postgres pg_isready -U postgres &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not ready${NC}"
    echo -e "${YELLOW}Starting PostgreSQL...${NC}"
    docker compose up -d postgres
    
    # Attendre que PostgreSQL soit prêt
    for i in {1..30}; do
        if docker compose exec -T postgres pg_isready -U postgres &> /dev/null; then
            echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"
            break
        fi
        echo -e "${YELLOW}  ⏳ Waiting... ($i/30)${NC}"
        sleep 2
    done
fi

# Lister les fichiers de migration disponibles
echo ""
echo -e "${BLUE}📋 Available migration files:${NC}"
if [ -d "backend/migrations" ]; then
    ls -lh backend/migrations/*.sql 2>/dev/null || echo -e "${YELLOW}  No SQL migration files found${NC}"
else
    echo -e "${RED}❌ Migrations directory not found: backend/migrations${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Starting migrations...${NC}"
echo -e "${BLUE}========================================${NC}"

# Fonction pour exécuter une migration
run_migration() {
    local MIGRATION_FILE=$1
    local MIGRATION_NAME=$(basename "$MIGRATION_FILE")
    local CHECK_TABLE=$2
    
    echo ""
    echo -e "${BLUE}🔍 Checking migration: ${MIGRATION_NAME}${NC}"
    
    if [ ! -f "$MIGRATION_FILE" ]; then
        echo -e "${YELLOW}  ⚠️  File not found, skipping${NC}"
        return 0
    fi
    
    # Vérifier si la migration a déjà été appliquée
    if [ -n "$CHECK_TABLE" ]; then
        if docker compose exec -T postgres psql -U postgres -d securevault -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$CHECK_TABLE');" | grep -q "t"; then
            echo -e "${GREEN}  ℹ️  Already applied (table '$CHECK_TABLE' exists)${NC}"
            return 0
        fi
    fi
    
    echo -e "${YELLOW}  ▶️  Applying migration...${NC}"
    
    # Exécuter la migration
    if docker compose exec -T postgres psql -U postgres -d securevault < "$MIGRATION_FILE"; then
        echo -e "${GREEN}  ✅ Successfully applied!${NC}"
    else
        echo -e "${RED}  ❌ Failed to apply migration${NC}"
        return 1
    fi
}

# Migration 001: Features de base (MFA, RBAC, etc.)
run_migration "backend/migrations/001_add_features.sql" "roles"

# Migration 002: Features professionnelles (dossiers, types de secrets, etc.)
run_migration "backend/migrations/002_pro_features.sql" "folders"

# Afficher le résumé des tables
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📊 Database Schema Summary${NC}"
echo -e "${BLUE}========================================${NC}"
docker compose exec -T postgres psql -U postgres -d securevault -c "\dt"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📊 Views${NC}"
echo -e "${BLUE}========================================${NC}"
docker compose exec -T postgres psql -U postgres -d securevault -c "\dv"

# Vérifier le nombre de lignes dans les tables clés
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📊 Data Summary${NC}"
echo -e "${BLUE}========================================${NC}"

docker compose exec -T postgres psql -U postgres -d securevault -tAc "
SELECT 
    'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Secrets', COUNT(*) FROM secrets
UNION ALL
SELECT 'Folders', COUNT(*) FROM folders
UNION ALL
SELECT 'Secret Types', COUNT(*) FROM secret_types
UNION ALL
SELECT 'Roles', COUNT(*) FROM roles
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM audit_logs;
" | column -t

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Migrations completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"

# Redémarrer le backend pour charger les nouveaux schémas
echo ""
echo -e "${YELLOW}🔄 Restarting backend to apply changes...${NC}"
docker compose restart backend

echo ""
echo -e "${GREEN}✅ Backend restarted${NC}"
echo -e "${BLUE}SecureVault is ready with all professional features!${NC}"
