#!/usr/bin/env bash
set -euo pipefail

IMAGE="${1:?Usage: $0 registry.freijstack.com/portfolio:<SHA>}"

if [[ ! "$IMAGE" =~ ^registry\.freijstack\.com/portfolio:[a-f0-9]{40}$ ]]; then
  echo "ERREUR: image Portfolio avec SHA Git complet obligatoire"
  exit 1
fi

BASE="/srv/www/portfolio/saas/portfolio/docker-compose.prod.yml"
UMAMI="/etc/freijstack/portfolio/umami.compose.yml"

for file in "$BASE" "$UMAMI"; do
  if [[ ! -r "$file" ]]; then
    echo "ERREUR: fichier absent ou illisible : $file"
    exit 1
  fi
done

export PORTFOLIO_IMAGE="$IMAGE"

docker compose -p portfolio \
  -f "$BASE" \
  -f "$UMAMI" \
  config --format json |
python3 -c '
import json
import os
import sys

service = json.load(sys.stdin)["services"]["portfolio"]

if service["image"] != os.environ["PORTFOLIO_IMAGE"]:
    sys.exit("ERREUR: image incorrecte")

volumes = service.get("volumes", [])
if not any(
    v.get("target") == "/usr/share/nginx/html/index.html"
    and v.get("read_only") is True
    for v in volumes
):
    sys.exit("ERREUR: montage Umami non protégé")

print("OK: image SHA et montage Umami validés")
'
