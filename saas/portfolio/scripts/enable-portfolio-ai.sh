#!/usr/bin/env bash
# Activation isolée du bot LLM du Portfolio.
# Vérifie l'image, la clé et l'API sans modifier les autres services.
set -euo pipefail

# 1. Variables
REVISION="${1:-}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE="/srv/www/portfolio/saas/portfolio/docker-compose.prod.yml"
AI_COMPOSE="$ROOT/docker-compose.ai.yml"
CREDENTIALS="/etc/freijstack/portfolio/llm.env"
IMAGE="registry.freijstack.com/portfolio-chat:pr286-${REVISION:0:12}"

# 2. Fonctions
# Interrompre la publication si un prérequis manque.
preflight() {
  [[ "$EUID" -eq 0 ]] || { echo "Exécuter avec sudo."; exit 1; }
  [[ "$REVISION" =~ ^[a-f0-9]{40}$ ]] || { echo "SHA Git complet requis."; exit 1; }
  test -f "$COMPOSE"
  test -f "$AI_COMPOSE"
  test -f "$CREDENTIALS" || {
    echo "Créer $CREDENTIALS avec une clé Google ou NVIDIA renouvelée, mode 600."
    exit 1
  }
  test "$(stat -c '%a' "$CREDENTIALS")" = 600 || {
    echo "Permissions requises : chmod 600 $CREDENTIALS"
    exit 1
  }
  if ! grep -Eq '^(GEMINI_API_KEY=.+|NVIDIA_API_KEY=nvapi-.+)' "$CREDENTIALS"; then
    echo "Ajouter GEMINI_API_KEY ou NVIDIA_API_KEY dans le fichier privé."
    exit 1
  fi
  if docker container inspect portfolio-chat >/dev/null 2>&1; then
    test "$(docker inspect portfolio-chat --format '{{index .Config.Labels "com.docker.compose.project"}}')" = portfolio
    test "$(docker inspect portfolio-chat --format '{{index .Config.Labels "com.docker.compose.service"}}')" = portfolio-chat
  fi
  docker network inspect freijstack >/dev/null
  test -n "$(docker inspect portfolio --format '{{.Id}}')"
}

# Récupérer uniquement l'image validée par GitHub Actions.
pull_image() {
  docker pull "$IMAGE"
  test "$(docker image inspect "$IMAGE" --format '{{index .Config.Labels "org.opencontainers.image.revision"}}')" = "$REVISION"
}

# Vérifier l'API publique sans afficher ni journaliser la clé.
smoke() {
  for attempt in $(seq 1 12); do
    if docker exec portfolio-chat python -c \
      'import json,urllib.request; d=json.load(urllib.request.urlopen("http://127.0.0.1:8080/health",timeout=2)); assert d["configured"]' >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
  docker exec portfolio-chat python -c \
    'import json,urllib.request; d=json.load(urllib.request.urlopen("http://127.0.0.1:8080/health",timeout=2)); assert d["configured"]'
  curl --fail --silent --show-error --max-time 20 \
    -H 'Origin: https://portfolio.freijstack.com' \
    -H 'Content-Type: application/json' \
    --data '{"question":"Parle-moi de Terraform et Ansible","language":"fr"}' \
    https://portfolio.freijstack.com/api/chat \
    | python3 -c 'import json,sys; value=json.load(sys.stdin); assert value.get("mode")=="llm" and value.get("answer")'
}

# Publier uniquement l'API, avec arrêt sur échec des tests.
main() {
  preflight
  pull_image
  export PORTFOLIO_CHAT_IMAGE="$IMAGE"
  docker compose -p portfolio -f "$COMPOSE" -f "$AI_COMPOSE" config --quiet
  BACKUP=""
  ROLLBACK=""
  if docker container inspect portfolio-chat >/dev/null 2>&1; then
    BACKUP="portfolio-chat:rollback-$(date +%Y%m%d-%H%M%S)"
    docker image tag "$(docker inspect portfolio-chat --format '{{.Image}}')" "$BACKUP"
    ROLLBACK="/etc/freijstack/portfolio/chat-rollback-$(date +%Y%m%d-%H%M%S).yml"
    printf 'services:\n  portfolio-chat:\n    image: %s\n' "$BACKUP" > "$ROLLBACK"
    chmod 600 "$ROLLBACK"
  fi
  if ! docker compose -p portfolio -f "$COMPOSE" -f "$AI_COMPOSE" up -d --no-deps portfolio-chat || ! smoke; then
    if [[ -n "$BACKUP" ]]; then
      docker compose -p portfolio -f "$COMPOSE" -f "$AI_COMPOSE" -f "$ROLLBACK" up -d --no-deps portfolio-chat
    else
      docker compose -p portfolio -f "$COMPOSE" -f "$AI_COMPOSE" stop portfolio-chat || true
    fi
    echo "Échec de validation : version précédente restaurée si présente."
    exit 1
  fi
  echo "API du Portfolio activée : Gemini, puis NVIDIA si configuré."
}

# 3. Point d'entrée
main "$@"
