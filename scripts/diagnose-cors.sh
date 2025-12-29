#!/bin/bash
#
# 🔍 SecureVault CORS Diagnostic Tool
#
# Tests CORS configuration for all environments
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; }
info() { echo -e "${BLUE}ℹ${NC} $1"; }

echo ""
echo "======================================"
echo "🔍 SecureVault CORS Diagnostic"
echo "======================================"
echo ""

# Test function
test_cors() {
    local env=$1
    local api_domain=$2
    local frontend_domain=$3
    local endpoint=$4
    
    info "Testing $env: $api_domain (from $frontend_domain)"
    
    # Test OPTIONS (preflight)
    echo ""
    echo "📋 OPTIONS Request (CORS Preflight):"
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X OPTIONS "https://${api_domain}${endpoint}" \
        -H "Origin: https://${frontend_domain}" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type,Authorization" \
        --max-time 10 2>&1 || echo "000")
    
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "204" ]; then
        log "OPTIONS returned $RESPONSE (OK)"
    else
        error "OPTIONS returned $RESPONSE (EXPECTED 200 or 204)"
    fi
    
    # Check CORS headers
    echo ""
    echo "🔍 CORS Headers:"
    HEADERS=$(curl -s -I -X OPTIONS "https://${api_domain}${endpoint}" \
        -H "Origin: https://${frontend_domain}" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type,Authorization" \
        --max-time 10 2>&1 || echo "ERROR")
    
    if echo "$HEADERS" | grep -qi "Access-Control-Allow-Origin"; then
        ALLOWED_ORIGIN=$(echo "$HEADERS" | grep -i "Access-Control-Allow-Origin" | cut -d':' -f2- | tr -d '\r\n ')
        log "Access-Control-Allow-Origin: $ALLOWED_ORIGIN"
    else
        error "Missing Access-Control-Allow-Origin header"
    fi
    
    if echo "$HEADERS" | grep -qi "Access-Control-Allow-Methods"; then
        ALLOWED_METHODS=$(echo "$HEADERS" | grep -i "Access-Control-Allow-Methods" | cut -d':' -f2- | tr -d '\r\n ')
        log "Access-Control-Allow-Methods: $ALLOWED_METHODS"
    else
        warn "Missing Access-Control-Allow-Methods header"
    fi
    
    if echo "$HEADERS" | grep -qi "Access-Control-Allow-Headers"; then
        ALLOWED_HEADERS=$(echo "$HEADERS" | grep -i "Access-Control-Allow-Headers" | cut -d':' -f2- | tr -d '\r\n ')
        log "Access-Control-Allow-Headers: $ALLOWED_HEADERS"
    else
        warn "Missing Access-Control-Allow-Headers header"
    fi
    
    # Test actual POST request
    echo ""
    echo "📋 Actual POST Request:"
    POST_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST "https://${api_domain}${endpoint}" \
        -H "Origin: https://${frontend_domain}" \
        -H "Content-Type: application/json" \
        -d '{"test":"data"}' \
        --max-time 10 2>&1 || echo "000")
    
    if [ "$POST_RESPONSE" = "200" ] || [ "$POST_RESPONSE" = "400" ] || [ "$POST_RESPONSE" = "401" ]; then
        log "POST returned $POST_RESPONSE (endpoint responding)"
    else
        warn "POST returned $POST_RESPONSE"
    fi
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Test health endpoint first
info "Testing health endpoints..."
echo ""

for env in "production" "staging"; do
    if [ "$env" = "production" ]; then
        API_DOMAIN="vault-api.freijstack.com"
        FRONTEND_DOMAIN="vault.freijstack.com"
    else
        API_DOMAIN="vault-api-staging.freijstack.com"
        FRONTEND_DOMAIN="vault-staging.freijstack.com"
    fi
    
    echo "🏥 Health Check ($env):"
    HEALTH=$(curl -s "https://${API_DOMAIN}/health" --max-time 10 || echo "ERROR")
    
    if echo "$HEALTH" | grep -q "healthy"; then
        log "$API_DOMAIN is healthy"
    else
        error "$API_DOMAIN is not responding correctly"
    fi
    echo ""
done

# Test CORS for staging
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 STAGING Environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_cors "staging" "vault-api-staging.freijstack.com" "vault-staging.freijstack.com" "/api/auth/register"

# Test CORS for production
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 PRODUCTION Environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_cors "production" "vault-api.freijstack.com" "vault.freijstack.com" "/api/auth/register"

# Test from localhost (should be blocked or allowed without credentials)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏠 Localhost Origin Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
info "Testing from localhost origin (should be allowed)"
test_cors "localhost" "vault-api-staging.freijstack.com" "localhost:3000" "/api/auth/register"

# Summary
echo ""
echo "======================================"
echo "📊 Diagnostic Complete"
echo "======================================"
echo ""
info "If you see errors above:"
echo "  1. Check that backend is running: docker compose ps"
echo "  2. Check backend logs: docker compose logs backend"
echo "  3. Verify FRONTEND_URL in .env matches your domain"
echo "  4. Restart backend: docker compose restart backend"
echo ""
info "Common fixes:"
echo "  • 404 on OPTIONS → Missing cors() middleware or routes not registered"
echo "  • Missing CORS headers → CORS not configured correctly"
echo "  • Blocked origin → Add origin to allowedOrigins in server.js"
echo ""
