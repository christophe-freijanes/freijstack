#!/usr/bin/env bash
set -euo pipefail

# Exécuter depuis saas/portfolio dans une copie de la branche à tester.
cd "$(dirname "$0")/.."

IMAGE="portfolio:pr286-review"
CONTAINER="portfolio-preview-pr286"
PORT="18086"

# S'interrompre si les nouveaux CV ne sont pas ceux validés.
echo "=== Contrôle des CV ==="
printf '%s  %s\n' \
  '21e588931f2b4bbfff2ef15955c283ba12e4bfe38deae0b1d6b05309c73cab8b' 'public/cv/CV-Christophe-FREIJANES.pdf' \
  'dcaaffe3745088ecc13c9176a675288a6650ed5af11d487686a3a99a9aa5b62c' 'public/cv/CV-Christophe-FREIJANES-ATS.pdf' \
  | sha256sum --check

echo "=== Vérification des données de recrutement ==="
python3 scripts/check-recruitment-index.py

echo "=== Construction de l'image isolée ==="
docker build -t "$IMAGE" .

echo "=== Vérification de l'image ==="
docker run --rm --entrypoint sh "$IMAGE" -c '
  set -e
  grep -q "id=\"assistantOpen\"" /usr/share/nginx/html/index.html
  grep -q "id=\"backToTop\"" /usr/share/nginx/html/index.html
  grep -q "data-assistant-topic=\"teamwork\"" /usr/share/nginx/html/index.html
  test -s /usr/share/nginx/html/data/recruitment-knowledge.json
  test -s /usr/share/nginx/html/cv/CV-Christophe-FREIJANES.pdf
  test -s /usr/share/nginx/html/cv/CV-Christophe-FREIJANES-ATS.pdf
'

if docker container inspect "$CONTAINER" >/dev/null 2>&1; then
  echo "Un ancien aperçu existe. Arrête-le uniquement si tu veux le remplacer :"
  echo "  sudo docker rm -f $CONTAINER"
  exit 1
fi

echo "=== Lancement sur localhost uniquement ==="
docker run -d --rm --name "$CONTAINER" \
  -p "127.0.0.1:${PORT}:80" "$IMAGE"

for attempt in 1 2 3 4 5; do
  if curl --silent --fail "http://127.0.0.1:${PORT}/" >/dev/null; then
    break
  fi
  sleep 1
done

for path in / /js/script.js /data/recruitment-knowledge.json \
  /cv/CV-Christophe-FREIJANES.pdf \
  /cv/CV-Christophe-FREIJANES-ATS.pdf \
  /pages/resume.html; do
  curl --fail --silent --show-error --output /dev/null \
    "http://127.0.0.1:${PORT}${path}"
  printf 'OK  %s\n' "$path"
done

echo "Aperçu OK : http://127.0.0.1:${PORT} (accessible sur le VPS uniquement)"
echo "Portfolio, SecureVault et Registry de production restent inchangés."
