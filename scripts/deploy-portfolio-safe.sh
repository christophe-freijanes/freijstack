#!/usr/bin/env bash
set -euo pipefail

IMAGE="${1:?Image SHA obligatoire}"
MODE="${2:---check}"

[[ "$IMAGE" =~ ^registry\.freijstack\.com/portfolio@sha256:[a-f0-9]{64}$ ]] ||
  { echo "ERREUR: digest Docker SHA-256 obligatoire"; exit 1; }

[[ "$MODE" == "--check" || "$MODE" == "--apply" ]] ||
  { echo "ERREUR: mode invalide"; exit 1; }

[[ $EUID -eq 0 ]] ||
  { echo "ERREUR: exécuter avec sudo"; exit 1; }

BASE="/srv/www/portfolio/saas/portfolio/docker-compose.prod.yml"
DIR="/etc/freijstack/portfolio"
UMAMI="$DIR/umami.compose.yml"
DIGEST="${IMAGE##*:}"
NEW_OVERLAY="$DIR/deploy-sha256-$DIGEST.compose.yml"

exec 9>/run/lock/freijstack-portfolio-deploy.lock
flock -n 9 ||
  { echo "ERREUR: déploiement déjà en cours"; exit 1; }

CURRENT="$(docker inspect portfolio --format '{{.Config.Image}}')"
FILES="$(docker inspect portfolio \
  --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}')"
PROJECT="$(docker inspect portfolio \
  --format '{{index .Config.Labels "com.docker.compose.project"}}')"

IFS=',' read -r OLD_BASE OLD_OVERLAY OLD_UMAMI <<< "$FILES"

[[ "$PROJECT" == "portfolio" &&
   "$OLD_BASE" == "$BASE" &&
   "$OLD_UMAMI" == "$UMAMI" &&
   -n "$OLD_OVERLAY" ]] ||
  { echo "ERREUR: configuration active inattendue"; exit 1; }

for file in "$BASE" "$OLD_OVERLAY" "$UMAMI"; do
  [[ -r "$file" ]] ||
    { echo "ERREUR: fichier absent ou illisible: $file"; exit 1; }
done

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

compose_old() {
  docker compose -p portfolio \
    -f "$BASE" -f "$OLD_OVERLAY" -f "$UMAMI" "$@"
}

compose_new() {
  docker compose -p portfolio \
    -f "$BASE" -f "$NEW_OVERLAY" -f "$UMAMI" "$@"
}

check_health() {
  local status running_image

  for attempt in {1..18}; do
    status="$(docker inspect portfolio \
      --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' \
      2>/dev/null || true)"

    running_image="$(docker inspect portfolio \
      --format '{{.Config.Image}}' 2>/dev/null || true)"

    if [[ "$status" == "healthy" &&
          "$running_image" == "$PORTFOLIO_IMAGE" ]] &&
       curl -fsS --max-time 10 \
         https://portfolio.freijstack.com/ >/dev/null; then
      return 0
    fi

    sleep 5
  done

  return 1
}

export PORTFOLIO_IMAGE="$CURRENT"
compose_old config --format json > "$WORK/old.json"

export PORTFOLIO_IMAGE="$IMAGE"
docker compose -p portfolio \
  -f "$BASE" -f "$UMAMI" \
  config --format json > "$WORK/new.json"

python3 - "$WORK/old.json" "$WORK/new.json" "$IMAGE" <<'PY'
import json
import sys

with open(sys.argv[1]) as f:
    old = json.load(f)

with open(sys.argv[2]) as f:
    new = json.load(f)

if set(old["services"]) != {"portfolio"}:
    sys.exit("ERREUR: services inattendus")

if new["services"]["portfolio"]["image"] != sys.argv[3]:
    sys.exit("ERREUR: image cible incorrecte")

old["services"]["portfolio"].pop("image", None)
new["services"]["portfolio"].pop("image", None)

if old != new:
    sys.exit("ERREUR: différence de configuration hors image")

volumes = new["services"]["portfolio"].get("volumes", [])

if not any(
    v.get("target") == "/usr/share/nginx/html/index.html"
    and v.get("read_only") is True
    for v in volumes
):
    sys.exit("ERREUR: montage Umami absent")

print("OK: configuration et montage Umami validés")
PY

echo "Image actuelle : $CURRENT"
echo "Image cible    : $IMAGE"

if [[ "$MODE" == "--check" ]]; then
  echo "Prévalidation réussie. Aucun déploiement."
  exit 0
fi

if [[ "$CURRENT" == "$IMAGE" ]]; then
  echo "Image déjà déployée. Aucune modification."
  exit 0
fi

echo "Vérification de l'image de rollback..."
docker image inspect "$CURRENT" >/dev/null || {
  echo "ERREUR: image de rollback absente"
  exit 1
}

echo "Téléchargement de l'image..."
docker pull "$IMAGE"

# Conserver la configuration de chaque version.
if [[ -e "$NEW_OVERLAY" ]]; then
  echo "ERREUR: surcharge de version déjà présente"
  exit 1
fi

TEMP="$(mktemp "$DIR/.deploy.XXXXXX")"
printf 'services:\n  portfolio:\n    image: "%s"\n' "$IMAGE" > "$TEMP"
chmod 600 "$TEMP"
mv "$TEMP" "$NEW_OVERLAY"

export PORTFOLIO_IMAGE="$IMAGE"

if ! compose_new config --quiet; then
  echo "ERREUR: configuration finale invalide"
  exit 1
fi

rollback() {
  echo "ROLLBACK: restauration de $CURRENT"

  export PORTFOLIO_IMAGE="$CURRENT"

  if ! compose_old up -d --no-deps --no-build --pull never portfolio; then
    echo "CRITIQUE: restauration Docker échouée"
    return 1
  fi

  if ! check_health; then
    echo "CRITIQUE: Portfolio non healthy après rollback"
    return 1
  fi

  echo "OK: rollback validé"
}

echo "Déploiement de $IMAGE"

if ! compose_new up -d --no-deps --no-build --pull never portfolio; then
  if ! rollback; then
    echo "CRITIQUE: rollback échoué, intervention nécessaire" >&2
    exit 2
  fi
  echo "Surcharge conservée pour traçabilité : $NEW_OVERLAY"
  exit 1
fi

if ! check_health; then
  echo "ERREUR: healthcheck du nouveau conteneur"
  if ! rollback; then
    echo "CRITIQUE: rollback échoué, intervention nécessaire" >&2
    exit 2
  fi
  echo "Surcharge conservée pour traçabilité : $NEW_OVERLAY"
  exit 1
fi

echo "SUCCÈS: Portfolio healthy, HTTP OK"
echo "Configuration active : $NEW_OVERLAY"
echo "Image : $IMAGE"
