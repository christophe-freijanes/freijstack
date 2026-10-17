#!/bin/bash
set -euo pipefail

# Registry Cleanup Script - Delete images older than 3 months
# Usage: ./cleanup-old-images.sh <registry-url> <username> <password> <days>

REGISTRY_URL="${1:-registry.freijstack.com}"
REGISTRY_USER="${2:-admin}"
REGISTRY_PASS="${3}"
MAX_AGE_DAYS="${4:-90}"  # 3 months = 90 days

if [ -z "${REGISTRY_PASS}" ]; then
  echo "❌ Usage: $0 <registry-url> <username> <password> [days]"
  exit 1
fi

echo "🧹 Registry Cleanup Tool"
echo "======================="
echo "Registry: ${REGISTRY_URL}"
echo "Max age: ${MAX_AGE_DAYS} days"
echo ""

# Calculate cutoff date (Unix timestamp)
CUTOFF_DATE=$(date -d "${MAX_AGE_DAYS} days ago" +%s 2>/dev/null || date -v-${MAX_AGE_DAYS}d +%s)
echo "🗓️  Cutoff date: $(date -d @${CUTOFF_DATE} 2>/dev/null || date -r ${CUTOFF_DATE})"
echo ""

DELETED_COUNT=0
KEPT_COUNT=0

# List all repositories
echo "📦 Fetching repositories..."
REPOS=$(curl -sS -u "${REGISTRY_USER}:${REGISTRY_PASS}" \
  "https://${REGISTRY_URL}/v2/_catalog" | jq -r '.repositories[]')

if [ -z "${REPOS}" ]; then
  echo "ℹ️  No repositories found"
  exit 0
fi

echo "Found repositories:"
echo "${REPOS}"
echo ""

# Process each repository
for REPO in ${REPOS}; do
  echo "🔍 Processing repository: ${REPO}"
  
  # List tags
  TAGS=$(curl -sS -u "${REGISTRY_USER}:${REGISTRY_PASS}" \
    "https://${REGISTRY_URL}/v2/${REPO}/tags/list" | jq -r '.tags[]?' 2>/dev/null || echo "")
  
  if [ -z "${TAGS}" ]; then
    echo "  ℹ️  No tags found"
    continue
  fi
  
  for TAG in ${TAGS}; do
    echo "  🏷️  Checking tag: ${TAG}"
    
    # Get manifest to extract creation date
    MANIFEST=$(curl -sS -u "${REGISTRY_USER}:${REGISTRY_PASS}" \
      -H "Accept: application/vnd.docker.distribution.manifest.v2+json" \
      "https://${REGISTRY_URL}/v2/${REPO}/manifests/${TAG}")
    
    DIGEST=$(echo "${MANIFEST}" | jq -r '.config.digest' 2>/dev/null || echo "")
    
    if [ -z "${DIGEST}" ] || [ "${DIGEST}" = "null" ]; then
      echo "    ⚠️  Could not extract digest, skipping"
      KEPT_COUNT=$((KEPT_COUNT + 1))
      continue
    fi
    
    # Get blob (image config) to extract creation date
    BLOB=$(curl -sS -u "${REGISTRY_USER}:${REGISTRY_PASS}" \
      "https://${REGISTRY_URL}/v2/${REPO}/blobs/${DIGEST}")
    
    CREATED=$(echo "${BLOB}" | jq -r '.created' 2>/dev/null || echo "")
    
    if [ -z "${CREATED}" ] || [ "${CREATED}" = "null" ]; then
      echo "    ⚠️  Could not extract creation date, skipping"
      KEPT_COUNT=$((KEPT_COUNT + 1))
      continue
    fi
    
    # Convert creation date to Unix timestamp
    IMAGE_DATE=$(date -d "${CREATED}" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S" "${CREATED}" +%s 2>/dev/null || echo "0")
    
    if [ "${IMAGE_DATE}" = "0" ]; then
      echo "    ⚠️  Invalid date format: ${CREATED}"
      KEPT_COUNT=$((KEPT_COUNT + 1))
      continue
    fi
    
    AGE_DAYS=$(( ($(date +%s) - IMAGE_DATE) / 86400 ))
    
    if [ "${IMAGE_DATE}" -lt "${CUTOFF_DATE}" ]; then
      echo "    ❌ Deleting (age: ${AGE_DAYS} days, created: ${CREATED})"
      
      # Get manifest digest for deletion
      MANIFEST_DIGEST=$(curl -sS -I -u "${REGISTRY_USER}:${REGISTRY_PASS}" \
        -H "Accept: application/vnd.docker.distribution.manifest.v2+json" \
        "https://${REGISTRY_URL}/v2/${REPO}/manifests/${TAG}" \
        | grep -i "Docker-Content-Digest:" | awk '{print $2}' | tr -d '\r')
      
      if [ -n "${MANIFEST_DIGEST}" ]; then
        curl -sS -X DELETE -u "${REGISTRY_USER}:${REGISTRY_PASS}" \
          "https://${REGISTRY_URL}/v2/${REPO}/manifests/${MANIFEST_DIGEST}" \
          && echo "    ✅ Deleted manifest ${MANIFEST_DIGEST}" \
          || echo "    ⚠️  Failed to delete"
        DELETED_COUNT=$((DELETED_COUNT + 1))
      else
        echo "    ⚠️  Could not get manifest digest for deletion"
      fi
    else
      echo "    ✅ Keeping (age: ${AGE_DAYS} days, created: ${CREATED})"
      KEPT_COUNT=$((KEPT_COUNT + 1))
    fi
  done
  
  echo ""
done

echo "📊 Summary"
echo "=========="
echo "Deleted: ${DELETED_COUNT} images"
echo "Kept: ${KEPT_COUNT} images"
echo ""
echo "⚠️  Note: Run garbage collection on the registry server to reclaim disk space:"
echo "   docker exec registry bin/registry garbage-collect /etc/docker/registry/config.yml"
