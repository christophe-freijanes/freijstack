#!/bin/bash

# Usage: ./init-db.sh [staging|production]
ENVIRONMENT=${1:-staging}
if [ "$ENVIRONMENT" = "production" ]; then
  DB_USER="securevault"
  DB_NAME="securevault"
  CONTAINER_PREFIX="securevault"
else
  DB_USER="securevault_staging"
  DB_NAME="securevault_staging"
  CONTAINER_PREFIX="securevault-staging"
fi

# Allow override from environment (for CI or custom runs)
if [ -n "$CONTAINER_PREFIX_OVERRIDE" ]; then
  CONTAINER_PREFIX="$CONTAINER_PREFIX_OVERRIDE"
fi


# Always use the service name for docker compose exec
POSTGRES_SERVICE="postgres"

echo "🔐 SecureVault - Database Initialization ($ENVIRONMENT)"
echo "========================================"

echo "⏳ Waiting for PostgreSQL service: $POSTGRES_SERVICE ..."
WAIT_LIMIT=60
WAIT_COUNT=0
until docker compose exec -T "$POSTGRES_SERVICE" pg_isready -U $DB_USER > /dev/null 2>&1; do
  WAIT_COUNT=$((WAIT_COUNT+1))
  echo "  Still waiting... ($WAIT_COUNT s)"
  if [ $WAIT_COUNT -ge $WAIT_LIMIT ]; then
    echo "❌ Timeout: PostgreSQL service did not become ready after $WAIT_LIMIT seconds."
    docker compose logs "$POSTGRES_SERVICE" --tail=40
    exit 1
  fi
  sleep 1
done

docker compose exec -T postgres psql -U $DB_USER -d $DB_NAME << 'EOF'
echo "✅ PostgreSQL is ready"

echo "📊 Creating database tables..."
docker compose exec -T "$POSTGRES_SERVICE" psql -U $DB_USER -d $DB_NAME << 'EOF'
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Secrets table
CREATE TABLE IF NOT EXISTS secrets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  encrypted_value TEXT NOT NULL,
  iv VARCHAR(32) NOT NULL,
  auth_tag VARCHAR(32) NOT NULL,
  description TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INTEGER,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_secrets_user_id ON secrets(user_id);
CREATE INDEX IF NOT EXISTS idx_secrets_expires_at ON secrets(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Display table info
\dt

EOF

echo "✅ Database initialized successfully"
echo ""
echo "📋 Next steps:"
if [ "$ENVIRONMENT" = "production" ]; then
  echo "  1. Access frontend: https://vault.freijstack.com"
  echo "  2. Access backend API: https://vault-api.freijstack.com/health"
else
  echo "  1. Access frontend: https://vault-staging.freijstack.com"
  echo "  2. Access backend API: https://vault-api-staging.freijstack.com/health"
fi
echo "  3. Create your first user account"
