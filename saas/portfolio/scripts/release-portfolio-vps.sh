#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Exécuter avec sudo."
  exit 1
fi

REVISION="${1:-}"
if [[ ! "$REVISION" =~ ^[a-f0-9]{40}$ ]]; then
  echo "Fournir le SHA du commit GitHub de la PR."
  exit 1
fi

cd "$(dirname "$0")/.."
COMPOSE="/srv/www/portfolio/saas/portfolio/docker-compose.prod.yml"
RELEASE_DIR="/etc/freijstack/portfolio"
IMAGE="registry.freijstack.com/portfolio:pr286-${REVISION:0:12}"
PREVIEW="portfolio-release-check-${REVISION:0:8}"

test -f "$COMPOSE" || { echo "Compose Portfolio introuvable"; exit 1; }
command -v docker >/dev/null
command -v curl >/dev/null

echo "=== Contrôle des PDF ==="
printf '%s  %s\n' \
  '21e588931f2b4bbfff2ef15955c283ba12e4bfe38deae0b1d6b05309c73cab8b' 'public/cv/CV-Christophe-FREIJANES.pdf' \
  'dcaaffe3745088ecc13c9176a675288a6650ed5af11d487686a3a99a9aa5b62c' 'public/cv/CV-Christophe-FREIJANES-ATS.pdf' \
  | sha256sum --check

echo "=== Contrôle du recrutement ==="
python3 scripts/check-recruitment-index.py
test "$(docker inspect portfolio --format '{{index .Config.Labels "com.docker.compose.project"}}')" = "portfolio"
test "$(docker inspect portfolio --format '{{index .Config.Labels "com.docker.compose.service"}}')" = "portfolio"
docker network inspect freijstack >/dev/null

echo "=== Récupération de l'image validée en CI ==="
docker pull "$IMAGE"
test "$(docker image inspect "$IMAGE" --format '{{index .Config.Labels "org.opencontainers.image.revision"}}')" = "$REVISION" || {
  echo "REFUS : image différente du commit GitHub approuvé."
  exit 1
}

echo "=== Vérification des fichiers dans l'image ==="
docker run --rm --entrypoint sh "$IMAGE" -c '
  set -e
  grep -q "id=\"assistantOpen\"" /usr/share/nginx/html/index.html
  grep -q "id=\"backToTop\"" /usr/share/nginx/html/index.html
  grep -q "data-assistant-topic=\"teamwork\"" /usr/share/nginx/html/index.html
  test -s /usr/share/nginx/html/data/recruitment-knowledge.json
  test -s /usr/share/nginx/html/cv/CV-Christophe-FREIJANES.pdf
  test -s /usr/share/nginx/html/cv/CV-Christophe-FREIJANES-ATS.pdf
'

echo "=== Vérification HTTP isolée ==="
if docker container inspect "$PREVIEW" >/dev/null 2>&1; then
  echo "Conteneur de test déjà existant : $PREVIEW"
  exit 1
fi
cleanup() { docker rm -f "$PREVIEW" >/dev/null 2>&1 || true; }
trap cleanup EXIT
docker run -d --rm --name "$PREVIEW" -p 127.0.0.1::80 "$IMAGE" >/dev/null
PORT="$(docker port "$PREVIEW" 80/tcp | sed -n 's/.*://p' | head -n 1)"
test -n "$PORT"

READY=0
for i in $(seq 1 12); do
  if curl --fail --silent "http://127.0.0.1:${PORT}/" >/dev/null; then
    READY=1
    break
  fi
  sleep 1
done
test "$READY" = "1" || { echo "Erreur démarrage HTTP"; exit 1; }

for url in / /data/recruitment-knowledge.json /js/script.js \
  /pages/resume.html /cv/CV-Christophe-FREIJANES.pdf \
  /cv/CV-Christophe-FREIJANES-ATS.pdf; do
  curl --fail --silent --show-error --output /dev/null \
    "http://127.0.0.1:${PORT}${url}"
  echo "OK ${url}"
done
cleanup
trap - EXIT

echo "=== Sauvegarde de la version actuelle ==="
OLD_ID="$(docker inspect portfolio --format '{{.Image}}')"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="portfolio:rollback-${STAMP}"
docker image tag "$OLD_ID" "$BACKUP"
install -d -m 700 -o root -g root "$RELEASE_DIR"
RELEASE_OVERRIDE="${RELEASE_DIR}/pr286-${REVISION:0:12}.compose.yml"
ROLLBACK_OVERRIDE="${RELEASE_DIR}/rollback-${STAMP}.compose.yml"

cat > "$RELEASE_OVERRIDE" <<EOF
services:
  portfolio:
    image: ${IMAGE}
    healthcheck:
      test: ["CMD-SHELL", "wget -q -O /dev/null http://127.0.0.1/ || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
EOF
cat > "$ROLLBACK_OVERRIDE" <<EOF
services:
  portfolio:
    image: ${BACKUP}
    healthcheck:
      test: ["CMD-SHELL", "wget -q -O /dev/null http://127.0.0.1/ || exit 1"]
EOF
chmod 600 "$RELEASE_OVERRIDE" "$ROLLBACK_OVERRIDE"
docker compose -p portfolio -f "$COMPOSE" -f "$RELEASE_OVERRIDE" config --quiet

rollback() {
  echo "Échec ; restauration de la version précédente."
  docker compose -p portfolio -f "$COMPOSE" -f "$ROLLBACK_OVERRIDE" up -d --no-deps portfolio || true
}
echo "=== Remplacement de Portfolio uniquement ==="
if ! docker compose -p portfolio -f "$COMPOSE" -f "$RELEASE_OVERRIDE" up -d --no-deps portfolio; then
  rollback
  exit 1
fi

echo "=== Validation du site en production ==="
if ! docker exec portfolio sh -c '
  wget -q -O /dev/null http://127.0.0.1/ &&
  grep -q "id=\"assistantOpen\"" /usr/share/nginx/html/index.html &&
  grep -q "data-assistant-topic=\"teamwork\"" /usr/share/nginx/html/index.html &&
  test -s /usr/share/nginx/html/cv/CV-Christophe-FREIJANES-ATS.pdf
'; then
  rollback
  exit 1
fi

echo "SUCCÈS : Portfolio publié depuis ${REVISION}"
echo "Image : ${IMAGE}"
echo "Sauvegarde locale : ${BACKUP}"
echo "Pour revenir en arrière :"
echo "sudo docker compose -p portfolio -f ${COMPOSE} -f ${ROLLBACK_OVERRIDE} up -d --no-deps portfolio"
echo "URL : https://portfolio.freijstack.com"
