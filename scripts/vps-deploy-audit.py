#!/usr/bin/env python3
"""Audit local VPS avant activation du déploiement (lecture seule)."""
from pathlib import Path
import subprocess

TARGETS = {
    "portfolio": "/srv/www/portfolio",
    "securevault": "/srv/www/securevault",
    "registry": "/srv/www/registry",
}
COMPOSE = {
    "portfolio": "saas/portfolio/docker-compose.prod.yml",
    "securevault": "saas/securevault/docker-compose.prod.yml",
    "registry": "saas/registry/docker-compose.prod.yml",
}


def git_info(root):
    try:
        branch = subprocess.run(
            ["git", "-C", root, "branch", "--show-current"],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        dirty = subprocess.run(
            ["git", "-C", root, "status", "--porcelain", "--untracked-files=normal"],
            capture_output=True, text=True, check=True,
        ).stdout.splitlines()
        return branch, len(dirty)
    except subprocess.CalledProcessError:
        return "INCONNU", -1


def main():
    print("AUDIT LECTURE SEULE — aucune commande Docker exécutée")
    for app, root in TARGETS.items():
        path = Path(root)
        if not path.is_dir():
            print(f"{app}: ABSENT ({root})")
            continue
        branch, modifications = git_info(root)
        compose = path / COMPOSE[app]
        exists = compose.is_file()
        print(f"{app}: branche={branch} modifications={modifications} compose={'OK' if exists else 'ABSENT'}")
        if app == "registry" and exists:
            body = compose.read_text()
            if '127.0.0.1:5000:5000' not in body:
                print("  BLOQUANT: port 5000 non limité à 127.0.0.1 dans le Compose local")
            if "/srv/www/registry/saas/registry/data" not in body:
                print("  BLOQUANT: chemin persistant de données Registry non confirmé")
            auth = compose.parent / ".htpasswd"
            print(f"  auth={('PRÉSENT' if auth.is_file() else 'ABSENT')} (contenu non lu)")
            print("  Registry production: déploiement SUSPENDU")


if __name__ == "__main__":
    main()
