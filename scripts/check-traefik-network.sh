#!/bin/bash
# ============================================
# Traefik Network Connectivity Check & Fix
# Ensures Traefik is properly connected to all required networks
# ============================================

set -e

echo "🔍 Checking Traefik network connectivity..."

# Check if Traefik container exists
if ! docker ps -a | grep -q traefik; then
    echo "❌ Traefik container not found"
    exit 1
fi

# Check if Traefik is running
if ! docker ps | grep -q traefik; then
    echo "⚠️  Traefik is not running, starting..."
    docker start traefik
    sleep 5
fi

# Check if freijstack network exists
if ! docker network ls | grep -q freijstack; then
    echo "⚠️  Network 'freijstack' not found, creating..."
    docker network create freijstack
fi

# Check if Traefik is connected to freijstack network
if ! docker network inspect freijstack | grep -q '"Name": "traefik"'; then
    echo "⚠️  Traefik not connected to freijstack network"
    echo "🔧 Connecting Traefik to freijstack network..."
    
    docker network connect freijstack traefik 2>/dev/null || {
        echo "⚠️  Already connected or error, restarting Traefik..."
        docker restart traefik
        sleep 5
    }
    
    # Verify connection
    if docker network inspect freijstack | grep -q '"Name": "traefik"'; then
        echo "✅ Traefik successfully connected to freijstack network"
    else
        echo "❌ Failed to connect Traefik to freijstack network"
        exit 1
    fi
else
    echo "✅ Traefik already connected to freijstack network"
fi

# Check Traefik IP on freijstack network
TRAEFIK_IP=$(docker inspect traefik --format '{{range .NetworkSettings.Networks}}{{if eq .NetworkID (index (index (index . "NetworkSettings") "Networks") "freijstack" "NetworkID")}}{{.IPAddress}}{{end}}{{end}}' 2>/dev/null || echo "")

if [ -z "$TRAEFIK_IP" ]; then
    echo "⚠️  Traefik has no IP on freijstack network, restarting..."
    docker restart traefik
    sleep 5
fi

# Final verification
echo ""
echo "📊 Network Status:"
echo "=================="
docker network inspect freijstack --format '{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{println}}{{end}}' | grep -E "(traefik|portfolio)"

echo ""
echo "✅ Traefik network connectivity check complete!"
