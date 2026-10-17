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

# Critical networks that Traefik must be connected to
# - web: SecureVault, Registry, n8n
# - freijstack: Portfolio (staging + production)
NETWORKS=("web" "freijstack")
reconnected=false

for network in "${NETWORKS[@]}"; do
    echo ""
    echo "📡 Checking network: $network"
    
    # Check if network exists
    if ! docker network ls | grep -q "$network"; then
        echo "⚠️  Network '$network' not found, creating..."
        docker network create "$network"
    fi
    
    # Check if Traefik is connected to this network
    if ! docker network inspect "$network" | grep -q '"Name": "traefik"'; then
        echo "⚠️  Traefik not connected to $network network"
        echo "🔧 Connecting Traefik to $network network..."
        
        docker network connect "$network" traefik 2>/dev/null || {
            echo "⚠️  Already connected or error occurred"
        }
        reconnected=true
        
        # Verify connection
        if docker network inspect "$network" | grep -q '"Name": "traefik"'; then
            echo "✅ Traefik successfully connected to $network network"
        else
            echo "❌ Failed to connect Traefik to $network network"
            exit 1
        fi
    else
        echo "✅ Traefik already connected to $network network"
    fi
done

# Restart Traefik if any reconnection was made
if [ "$reconnected" = true ]; then
    echo ""
    echo "🔄 Restarting Traefik to activate all connections..."
    docker restart traefik
    sleep 5
    echo "✅ Traefik restarted successfully"
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
