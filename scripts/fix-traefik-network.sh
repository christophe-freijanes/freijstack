#!/bin/bash
# ============================================
# Fix Traefik Network Connection
# Ensures Traefik is connected to freijstack network
# ============================================

set -e

echo "🔍 Checking Traefik network connectivity..."

# Check if Traefik container exists and is running
if ! docker ps --format '{{.Names}}' | grep -q "^traefik$"; then
    echo "❌ Traefik container not found or not running"
    exit 1
fi

# Check if freijstack network exists
if ! docker network ls --format '{{.Name}}' | grep -q "^freijstack$"; then
    echo "📦 Creating freijstack network..."
    docker network create freijstack
fi

# Check if Traefik is connected to freijstack network
if docker inspect traefik -f '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{"\n"}}{{end}}' | grep -q "freijstack"; then
    # Check if it has an IP (really connected)
    IP=$(docker inspect traefik -f '{{.NetworkSettings.Networks.freijstack.IPAddress}}')
    if [ -z "$IP" ]; then
        echo "⚠️  Traefik configured but not connected to freijstack. Restarting..."
        docker restart traefik
        sleep 5
        IP=$(docker inspect traefik -f '{{.NetworkSettings.Networks.freijstack.IPAddress}}')
    fi
    echo "✅ Traefik connected to freijstack (IP: $IP)"
else
    echo "🔧 Connecting Traefik to freijstack network..."
    docker network connect freijstack traefik
    echo "✅ Traefik successfully connected to freijstack"
fi

# Verify portfolio containers can be reached
echo ""
echo "🔍 Verifying portfolio containers..."
for container in portfolio-staging portfolio-prod; do
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        IP=$(docker inspect $container -f '{{.NetworkSettings.Networks.freijstack.IPAddress}}' 2>/dev/null || echo "")
        if [ -n "$IP" ]; then
            echo "✅ $container (IP: $IP)"
        else
            echo "⚠️  $container not on freijstack network"
        fi
    else
        echo "ℹ️  $container not running"
    fi
done

echo ""
echo "✅ Network check complete!"
