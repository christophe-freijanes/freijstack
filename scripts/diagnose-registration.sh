#!/bin/bash
#
# 🔍 SecureVault Registration Diagnostic Tool
#
# Tests all components needed for user registration
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log() { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; }
info() { echo -e "${BLUE}ℹ${NC} $1"; }
section() { echo -e "${PURPLE}▶${NC} $1"; }

ENV="${1:-staging}"

if [ "$ENV" = "production" ]; then
    API_URL="https://vault-api.freijstack.com"
    FRONTEND_URL="https://vault.freijstack.com"
    DEPLOY_DIR="/srv/www/securevault"
else
    API_URL="https://vault-api-staging.freijstack.com"
    FRONTEND_URL="https://vault-staging.freijstack.com"
    DEPLOY_DIR="/srv/www/securevault-staging"
fi

echo ""
echo "=========================================="
echo "🔍 SecureVault Registration Diagnostic"
echo "Environment: $ENV"
echo "=========================================="
echo ""

# 1. Backend Health Check
section "1. Backend Health Check"
HEALTH=$(curl -s "$API_URL/health" --max-time 10 || echo "ERROR")

if echo "$HEALTH" | grep -q "healthy"; then
    log "Backend is healthy"
    echo "   Response: $HEALTH"
else
    error "Backend is not responding"
    echo "   Expected: {\"status\":\"healthy\",...}"
    echo "   Got: $HEALTH"
fi
echo ""

# 2. CORS Preflight Test
section "2. CORS Preflight (OPTIONS) Test"
echo "Testing OPTIONS request to /api/auth/register..."

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X OPTIONS "$API_URL/api/auth/register" \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type" \
    --max-time 10 || echo "000")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "204" ]; then
    log "CORS preflight successful (HTTP $HTTP_CODE)"
else
    error "CORS preflight failed (HTTP $HTTP_CODE)"
    warn "This will block registration from the browser!"
fi

# Check CORS headers
CORS_HEADERS=$(curl -s -I -X OPTIONS "$API_URL/api/auth/register" \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: POST" \
    --max-time 10 2>&1 || echo "ERROR")

if echo "$CORS_HEADERS" | grep -qi "Access-Control-Allow-Origin"; then
    ORIGIN=$(echo "$CORS_HEADERS" | grep -i "Access-Control-Allow-Origin" | cut -d':' -f2- | tr -d '\r\n ')
    log "Access-Control-Allow-Origin: $ORIGIN"
else
    error "Missing Access-Control-Allow-Origin header"
fi
echo ""

# 3. Test Registration Endpoint
section "3. Registration Endpoint Test"
echo "Testing POST to /api/auth/register..."

TEST_EMAIL="test-$(date +%s)@example.com"
TEST_USERNAME="testuser$(date +%s)"

REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST "$API_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -H "Origin: $FRONTEND_URL" \
    -d "{\"username\":\"$TEST_USERNAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"TestPass123!\"}" \
    --max-time 10 2>&1 || echo "ERROR\n000")

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1)
BODY=$(echo "$REGISTER_RESPONSE" | head -n-1)

echo "   HTTP Status: $HTTP_CODE"
echo "   Response: $BODY"

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    log "Registration endpoint working (HTTP $HTTP_CODE)"
    if echo "$BODY" | grep -q "token\|user\|id"; then
        log "Response contains user data/token"
    fi
elif [ "$HTTP_CODE" = "400" ]; then
    warn "Validation error (HTTP 400) - check password requirements"
    echo "   Password must have: uppercase, lowercase, number, special char, min 8 chars"
elif [ "$HTTP_CODE" = "409" ]; then
    warn "User already exists (HTTP 409)"
elif [ "$HTTP_CODE" = "500" ]; then
    error "Server error (HTTP 500) - check database connection"
else
    error "Registration failed (HTTP $HTTP_CODE)"
fi
echo ""

# 4. Database Connection (if on VPS)
section "4. Database Connection Check"

if [ -d "$DEPLOY_DIR" ]; then
    info "Running database checks on VPS..."
    cd "$DEPLOY_DIR/saas/securevault"
    
    # Check if postgres container is running
    if docker compose ps postgres | grep -q "Up"; then
        log "PostgreSQL container is running"
        
        # Test connection
        if docker compose exec -T postgres psql -U postgres -c "\l" > /dev/null 2>&1; then
            log "Database connection successful"
            
            # Check if securevault database exists
            if docker compose exec -T postgres psql -U postgres -lqt | grep -q "securevault"; then
                log "securevault database exists"
                
                # Check if users table exists
                USERS_TABLE=$(docker compose exec -T postgres psql -U postgres -d securevault -tAc \
                    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users');" 2>&1)
                
                if echo "$USERS_TABLE" | grep -q "t"; then
                    log "users table exists"
                    
                    # Count users
                    USER_COUNT=$(docker compose exec -T postgres psql -U postgres -d securevault -tAc \
                        "SELECT COUNT(*) FROM users;" 2>&1 || echo "ERROR")
                    
                    if [ "$USER_COUNT" != "ERROR" ]; then
                        log "Current user count: $USER_COUNT"
                    fi
                else
                    error "users table does NOT exist!"
                    warn "Run migrations: docker compose exec -T postgres psql -U postgres -d securevault < backend/migrations/001_add_features.sql"
                fi
                
                # Check database schema
                echo ""
                info "Database tables:"
                docker compose exec -T postgres psql -U postgres -d securevault -c "\dt" 2>&1 | head -20
                
            else
                error "securevault database does NOT exist!"
                warn "Create database: docker compose exec postgres psql -U postgres -c 'CREATE DATABASE securevault;'"
            fi
        else
            error "Cannot connect to PostgreSQL"
        fi
    else
        error "PostgreSQL container is NOT running"
        warn "Start containers: docker compose up -d"
    fi
else
    info "Not running on VPS, skipping database checks"
fi
echo ""

# 5. Backend Logs Check (if on VPS)
section "5. Recent Backend Logs"

if [ -d "$DEPLOY_DIR" ]; then
    cd "$DEPLOY_DIR/saas/securevault"
    
    info "Last 20 lines of backend logs:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    docker compose logs --tail=20 backend
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    info "Checking for errors in logs..."
    ERROR_COUNT=$(docker compose logs backend | grep -i "error" | wc -l)
    if [ "$ERROR_COUNT" -gt 0 ]; then
        warn "Found $ERROR_COUNT error(s) in backend logs"
        echo ""
        echo "Recent errors:"
        docker compose logs backend | grep -i "error" | tail -10
    else
        log "No errors found in backend logs"
    fi
else
    info "Not running on VPS, skipping log checks"
fi
echo ""

# 6. Environment Variables Check (if on VPS)
section "6. Environment Variables Check"

if [ -d "$DEPLOY_DIR" ]; then
    cd "$DEPLOY_DIR/saas/securevault"
    
    if [ -f ".env" ]; then
        log ".env file exists"
        
        # Check critical variables (without showing values)
        for VAR in POSTGRES_PASSWORD JWT_SECRET ENCRYPTION_KEY FRONTEND_URL DB_HOST; do
            if grep -q "^${VAR}=" .env 2>/dev/null; then
                log "$VAR is set"
            else
                error "$VAR is NOT set in .env"
            fi
        done
        
        # Show non-sensitive values
        echo ""
        info "Current configuration:"
        grep -E "^(FRONTEND_URL|NODE_ENV|PORT|DB_HOST)=" .env 2>/dev/null || echo "   (no public vars found)"
    else
        error ".env file does NOT exist"
        warn "Copy from template: cp .env.staging .env"
    fi
else
    info "Not running on VPS, skipping env checks"
fi
echo ""

# 7. Frontend Accessibility
section "7. Frontend Accessibility Test"
echo "Testing if frontend is accessible..."

FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" --max-time 10 || echo "000")

if [ "$FRONTEND_STATUS" = "200" ]; then
    log "Frontend is accessible (HTTP $FRONTEND_STATUS)"
else
    error "Frontend is NOT accessible (HTTP $FRONTEND_STATUS)"
fi
echo ""

# 8. Summary and Recommendations
section "8. Summary & Recommendations"
echo ""

# Determine issues
ISSUES=0

if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "201" ] && [ "$HTTP_CODE" != "400" ] && [ "$HTTP_CODE" != "409" ]; then
    error "❌ Registration endpoint not responding correctly"
    ISSUES=$((ISSUES + 1))
fi

if [ "$HTTP_CODE" = "500" ]; then
    error "❌ Database connection issue detected"
    ISSUES=$((ISSUES + 1))
fi

CORS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$API_URL/api/auth/register" -H "Origin: $FRONTEND_URL" --max-time 10 || echo "000")
if [ "$CORS_CODE" != "200" ] && [ "$CORS_CODE" != "204" ]; then
    error "❌ CORS preflight failing (will block browser requests)"
    ISSUES=$((ISSUES + 1))
fi

if [ $ISSUES -eq 0 ]; then
    echo ""
    log "✅ All checks passed! Registration should work."
    echo ""
    info "If you still can't register from the browser:"
    echo "   1. Open browser DevTools (F12) → Console tab"
    echo "   2. Try to register and check for error messages"
    echo "   3. Go to Network tab → look for failed requests"
    echo "   4. Check if any ad-blocker is interfering"
    echo ""
else
    echo ""
    error "Found $ISSUES issue(s) that may prevent registration"
    echo ""
    info "Quick fixes to try:"
    echo ""
    echo "   1. Restart backend:"
    echo "      cd $DEPLOY_DIR/saas/securevault"
    echo "      docker compose restart backend"
    echo ""
    echo "   2. Check/run migrations:"
    echo "      docker compose exec -T postgres psql -U postgres -d securevault < backend/migrations/001_add_features.sql"
    echo ""
    echo "   3. View detailed logs:"
    echo "      docker compose logs -f backend"
    echo ""
    echo "   4. Re-run this diagnostic:"
    echo "      ./scripts/diagnose-registration.sh $ENV"
    echo ""
fi

echo "=========================================="
echo "🏁 Diagnostic Complete"
echo "=========================================="
echo ""
