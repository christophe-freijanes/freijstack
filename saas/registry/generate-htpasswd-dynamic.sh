#!/bin/bash
# Generate htpasswd file from environment variables
# Usage: REGISTRY_USERNAME="user" REGISTRY_PASSWORD="pass" ./generate-htpasswd.sh

set -e

if [ -z "$REGISTRY_USERNAME" ] || [ -z "$REGISTRY_PASSWORD" ]; then
  echo "❌ Error: REGISTRY_USERNAME and REGISTRY_PASSWORD environment variables are required"
  exit 1
fi

# Ensure data directory exists
mkdir -p data

# Generate htpasswd file (will overwrite existing file)
echo "🔐 Generating .htpasswd for user: $REGISTRY_USERNAME..."
docker run --rm \
  --entrypoint htpasswd \
  httpd:2 \
  -Bbn "$REGISTRY_USERNAME" "$REGISTRY_PASSWORD" > data/.htpasswd

echo "✅ .htpasswd generated successfully"
echo "📁 Location: data/.htpasswd"
ls -lh data/.htpasswd
