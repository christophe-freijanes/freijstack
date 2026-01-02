#!/bin/bash
#
# 🗄️ SecureVault - Database Migration Runner
# 
# Automatically detects PostgreSQL credentials and applies migrations
#
# Usage: ./run-migrations.sh [staging|production]
#

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment
ENV="${1:-staging}"

# Directories
if [ "$ENV" = "production" ]; then
    DEPLOY_DIR="/srv/www/securevault"
else
    DEPLOY_DIR="/srv/www/securevault-staging"
fi

PROJECT_PATH="saas/securevault"

echo ""
echo "======================================"
echo "🗄️  SecureVault Database Migrations"
echo "======================================"
echo ""
echo "Environment: $ENV"
echo "Directory: $DEPLOY_DIR/$PROJECT_PATH"
echo ""

# Navigate to project directory
cd "$DEPLOY_DIR/$PROJECT_PATH" || exit 1

# Auto-detect PostgreSQL credentials from .env
echo "🔍 Detecting PostgreSQL credentials from .env..."
if [ -f ".env" ]; then
    PGUSER=$(grep "^POSTGRES_USER=" .env | cut -d'=' -f2 | tr -d '\r' || echo "postgres")
    PGDATABASE=$(grep "^POSTGRES_DB=" .env | cut -d'=' -f2 | tr -d '\r' || echo "securevault")
    
    echo -e "${GREEN}✓${NC} PostgreSQL User: ${BLUE}$PGUSER${NC}"
    echo -e "${GREEN}✓${NC} Database: ${BLUE}$PGDATABASE${NC}"
else
    echo -e "${YELLOW}⚠${NC} .env file not found, using defaults"
    PGUSER="postgres"
    PGDATABASE="securevault"
fi
echo ""

# Check if PostgreSQL container is running
echo "🐳 Checking PostgreSQL container..."
if ! docker compose ps postgres | grep -q "Up"; then
    echo -e "${RED}✗${NC} PostgreSQL container is not running"
    echo "   Start it with: docker compose up -d postgres"
    exit 1
fi
echo -e "${GREEN}✓${NC} PostgreSQL container is running"
echo ""

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if docker compose exec -T postgres pg_isready -U "$PGUSER" &> /dev/null; then
        echo -e "${GREEN}✓${NC} PostgreSQL is ready!"
        break
    fi
    if [ "$i" -eq 30 ]; then
        echo -e "${RED}✗${NC} PostgreSQL did not become ready in time"
        exit 1
    fi
    sleep 1
done
echo ""

# Test database connection
echo "🔌 Testing database connection..."
if docker compose exec -T postgres psql -U "$PGUSER" -d "$PGDATABASE" -c "SELECT version();" &> /dev/null; then
    echo -e "${GREEN}✓${NC} Database connection successful"
else
    echo -e "${RED}✗${NC} Cannot connect to database $PGDATABASE"
    echo ""
    echo "Available databases:"
    docker compose exec -T postgres psql -U "$PGUSER" -l 2>&1 | grep -E "^ " | head -10
    exit 1
fi
echo ""

# Function to run a migration
run_migration() {
    local migration_file=$1
    local check_table=$2
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Migration: ${BLUE}$migration_file${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ ! -f "backend/migrations/$migration_file" ]; then
        echo -e "${YELLOW}⚠${NC} File not found, skipping"
        return
    fi
    
    # Check if already applied
    TABLE_EXISTS=$(docker compose exec -T postgres psql -U "$PGUSER" -d "$PGDATABASE" -tAc \
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$check_table');" 2>/dev/null | tr -d ' \r\n')
    
    if [ "$TABLE_EXISTS" = "t" ]; then
        echo -e "${BLUE}ℹ${NC}  Already applied (${check_table} table exists)"
        return
    fi
    
    echo -e "${YELLOW}▶${NC}  Applying migration..."
    
    # Apply migration
    if docker compose exec -T postgres psql -U "$PGUSER" -d "$PGDATABASE" < "backend/migrations/$migration_file" 2>&1 | tee /tmp/migration.log; then
        echo -e "${GREEN}✓${NC} Migration applied successfully"
    else
        echo -e "${RED}✗${NC} Migration failed!"
        echo ""
        echo "Error details:"
        cat /tmp/migration.log
        return 1
    fi
}

# Run migrations
echo "📋 Applying migrations..."
echo ""

run_migration "001_add_features.sql" "roles"
echo ""

run_migration "002_pro_features.sql" "folders"
echo ""

# Show database summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Database Schema Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Tables:"
docker compose exec -T postgres psql -U "$PGUSER" -d "$PGDATABASE" -c "\dt" 2>&1 | grep -E "^ " | head -20 || echo "Could not list tables"

echo ""
echo "Views:"
docker compose exec -T postgres psql -U "$PGUSER" -d "$PGDATABASE" -c "\dv" 2>&1 | grep -E "^ " | head -10 || echo "No views found"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 Data Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Count rows in important tables
for table in users secrets roles folders secret_types secret_history; do
    COUNT=$(docker compose exec -T postgres psql -U "$PGUSER" -d "$PGDATABASE" -tAc \
        "SELECT COUNT(*) FROM $table;" 2>/dev/null | tr -d ' \r\n' || echo "N/A")
    
    if [ "$COUNT" != "N/A" ]; then
        printf "%-20s %s rows\n" "$table:" "$COUNT"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓${NC} Migrations completed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Restart backend to apply changes
echo "🔄 Restarting backend to apply changes..."
docker compose restart backend
echo -e "${GREEN}✓${NC} Backend restarted"
echo ""

echo "✅ All done! Your database is up to date."
echo ""
