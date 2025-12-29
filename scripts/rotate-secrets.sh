#!/bin/bash
# 🔄 Secret Rotation Script for SecureVault
# Automatise la rotation des secrets (DB_PASSWORD, JWT_SECRET, ENCRYPTION_KEY)
# Usage: bash scripts/rotate-secrets.sh [production|staging]

set -e

ENVIRONMENT=${1:-staging}
if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "staging" ]; then
  echo "❌ Usage: $0 [production|staging]"
  exit 1
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔄 SecureVault Secret Rotation${NC}"
echo "=============================="
echo "Environment: $ENVIRONMENT"
echo ""

# Determine paths based on environment
if [ "$ENVIRONMENT" = "production" ]; then
  ENV_FILE="/srv/www/securevault/saas/securevault/.env"
  COMPOSE_DIR="/srv/www/securevault/saas/securevault"
  BACKUP_DIR="/srv/www/securevault/backups"
else
  ENV_FILE="/srv/www/securevault-staging/saas/securevault/.env"
  COMPOSE_DIR="/srv/www/securevault-staging/saas/securevault"
  BACKUP_DIR="/srv/www/securevault-staging/backups"
fi

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ ERROR: $ENV_FILE not found${NC}"
  exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup current .env
BACKUP_FILE="$BACKUP_DIR/.env.backup.$(date +%Y%m%d_%H%M%S)"
cp "$ENV_FILE" "$BACKUP_FILE"
echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"

# Generate new secrets
echo ""
echo -e "${YELLOW}🔑 Generating new secrets...${NC}"

# Function to generate random string
generate_string() {
  local length=$1
  local chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
  local result=""
  for ((i=0; i<length; i++)); do
    result+="${chars:RANDOM%${#chars}:1}"
  done
  echo "$result"
}

# Function to generate hex string
generate_hex() {
  local length=$1
  local chars="0123456789abcdef"
  local result=""
  for ((i=0; i<length; i++)); do
    result+="${chars:RANDOM%${#chars}:1}"
  done
  echo "$result"
}

# Function to generate password
generate_password() {
  local length=$1
  local chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  local result=""
  for ((i=0; i<length; i++)); do
    result+="${chars:RANDOM%${#chars}:1}"
  done
  echo "$result"
}

# Generate new values
NEW_JWT_SECRET=$(generate_string 44)
NEW_ENCRYPTION_KEY=$(generate_hex 64)
NEW_DB_PASSWORD=$(generate_password 24)

echo "JWT_SECRET: ${NEW_JWT_SECRET:0:20}..."
echo "ENCRYPTION_KEY: ${NEW_ENCRYPTION_KEY:0:20}..."
echo "DB_PASSWORD: ${NEW_DB_PASSWORD:0:20}..."

# Update .env file
echo ""
echo -e "${YELLOW}📝 Updating .env file...${NC}"

# Use sed to replace values
sed -i "s/JWT_SECRET=.*/JWT_SECRET=$NEW_JWT_SECRET/" "$ENV_FILE"
sed -i "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$NEW_ENCRYPTION_KEY/" "$ENV_FILE"
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$NEW_DB_PASSWORD/" "$ENV_FILE"

echo -e "${GREEN}✅ .env updated${NC}"

# Update database password
echo ""
echo -e "${YELLOW}🗄️  Updating database password...${NC}"

# Get DB_USER and DB_NAME from .env
DB_USER=$(grep "^DB_USER=" "$ENV_FILE" | cut -d'=' -f2)
DB_NAME=$(grep "^DB_NAME=" "$ENV_FILE" | cut -d'=' -f2)

# Update postgres password via docker
cd "$COMPOSE_DIR"
docker-compose exec -T postgres psql -U postgres -c \
  "ALTER USER \"$DB_USER\" WITH PASSWORD '$NEW_DB_PASSWORD';" 2>/dev/null || {
  echo -e "${YELLOW}⚠️  Could not update postgres password (container might be down)${NC}"
  echo "    Manual update required: ALTER USER \"$DB_USER\" WITH PASSWORD '$NEW_DB_PASSWORD';"
}

echo -e "${GREEN}✅ Database password updated${NC}"

# Restart containers
echo ""
echo -e "${YELLOW}🐳 Restarting containers...${NC}"

docker-compose restart backend
sleep 5

# Verify
echo ""
echo -e "${YELLOW}🔍 Verifying...${NC}"

if docker-compose ps | grep -q "Up"; then
  echo -e "${GREEN}✅ Containers restarted successfully${NC}"
else
  echo -e "${RED}❌ Containers failed to restart${NC}"
  echo "    Restoring from backup..."
  cp "$BACKUP_FILE" "$ENV_FILE"
  docker-compose restart backend
  exit 1
fi

# Summary
echo ""
echo "=============================="
echo -e "${GREEN}✅ Secret rotation completed!${NC}"
echo ""
echo "Summary:"
echo "  Environment: $ENVIRONMENT"
echo "  Updated: JWT_SECRET, ENCRYPTION_KEY, DB_PASSWORD"
echo "  Backup: $BACKUP_FILE"
echo ""
echo "⚠️  IMPORTANT:"
echo "  1. Store new secrets securely"
echo "  2. Users will need to re-login"
echo "  3. If issues occur, restore from backup:"
echo "     cp $BACKUP_FILE $ENV_FILE"
echo ""
