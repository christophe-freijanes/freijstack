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
    echo "Créer $CREDENTIALS avec une clé NVIDIA renouvelée, mode 600."
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
    echo "portfolio-chat existe déjà : refus d'écraser l'instance courante."
    exit 1
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
  docker compose -p portfolio -f "$COMPOSE" -f "$AI_COMPOSE" up -d --no-deps portfolio-chat
  if ! smoke; then
    docker compose -p portfolio -f "$COMPOSE" -f "$AI_COMPOSE" stop portfolio-chat || true
    echo "Échec de validation : API arrêtée ; Portfolio et autres services intacts."
    exit 1
  fi
  echo "API du Portfolio activée : Gemini, puis NVIDIA si configuré."
}

# 3. Point d'entrée
main "$@"
