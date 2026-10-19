#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

BASE=/var/backups/freijstack
mkdir -p "$BASE"

exec 9>/run/lock/freijstack-backup.lock
flock -n 9 || {
  echo "Une sauvegarde est déjà en cours."
  exit 1
}

WORK=$(mktemp -d "$BASE/.pending-XXXXXXXX")
trap 'rm -rf -- "$WORK"' EXIT

mkdir -p "$WORK/data/home/hermes/.hermes"

echo "=== Export PostgreSQL ==="
docker exec freijstack-analytics-db-1 \
  pg_dump -U umami -d umami -Fc > "$WORK/umami.dump"

docker exec -i freijstack-analytics-db-1 \
  pg_restore -l < "$WORK/umami.dump" >/dev/null

echo "=== Copie des données Hermes ==="
for dir in state profiles skills cron backups; do
  if [[ -d "/home/hermes/.hermes/$dir" ]]; then
    rsync -a \
      --exclude='*.sock' \
      --exclude='*.db' \
      --exclude='*.db-wal' \
      --exclude='*.db-shm' \
      "/home/hermes/.hermes/$dir" \
      "$WORK/data/home/hermes/.hermes/"
  fi
done

echo "=== Sauvegarde SQLite Hermes ==="
python3 - "$WORK/data/home/hermes/.hermes" <<'PYSQL'
import sqlite3
import sys
from pathlib import Path

source = Path("/home/hermes/.hermes")
target = Path(sys.argv[1])

for directory in ("state", "profiles", "skills", "cron", "backups"):
    root = source / directory
    if not root.exists():
        continue

    for db in root.rglob("*.db"):
        destination = target / db.relative_to(source)
        destination.parent.mkdir(parents=True, exist_ok=True)

        with sqlite3.connect(f"file:{db}?mode=ro", uri=True, timeout=15) as src:
            with sqlite3.connect(destination) as dst:
                src.backup(dst)

        print(f"SQLite : {db.relative_to(source)}")
PYSQL

echo "=== Archivage FreijStack ==="
tar -czf "$WORK/freijstack.tar.gz" \
  -C "$WORK/data" home/hermes/.hermes \
  -C / \
  home/freijac/freijstack-rag-preview \
  opt/freijstack-chat \
  opt/freijstack-analytics \
  opt/freijstack-analytics-proxy \
  opt/freijstack-report \
  opt/freijstack-monitor \
  etc/freijstack \
  etc/systemd/system \
  srv/www/base-infra \
  srv/www/portfolio/saas/portfolio

echo "=== Validation ==="
tar -tzf "$WORK/freijstack.tar.gz" >/dev/null
test -s "$WORK/umami.dump"
test -s "$WORK/freijstack.tar.gz"

DEST="$BASE/$(date +%Y%m%d-%H%M%S)"
mv -- "$WORK" "$DEST"
trap - EXIT

echo "=== Rétention 7 jours ==="
find "$BASE" -mindepth 1 -maxdepth 1 \
  -type d -name '20??????-??????' \
  -mmin +10080 -exec rm -rf -- {} +

echo "Sauvegarde réussie : $DEST"
du -sh "$DEST"
