#!/usr/bin/env python3
"""Précontrôle de déploiement Freijstack, sans modification de production."""
import argparse
import os
import subprocess
from pathlib import Path

APPS = {
    ("portfolio", "production"): ("/srv/www/portfolio", "saas/portfolio", "docker-compose.prod.yml", "master"),
    ("portfolio", "staging"): ("/srv/www/portfolio-staging", "saas/portfolio", "docker-compose.staging.yml", "develop"),
    ("securevault", "production"): ("/srv/www/securevault", "saas/securevault", "docker-compose.prod.yml", "master"),
    ("securevault", "staging"): ("/srv/www/securevault-staging", "saas/securevault", "docker-compose.staging.yml", "develop"),
    ("registry", "production"): ("/srv/www/registry", "saas/registry", "docker-compose.prod.yml", "master"),
    ("registry", "staging"): ("/srv/www/registry-staging", "saas/registry", "docker-compose.staging.yml", "develop"),
}


def run(*args):
    return subprocess.run(args, text=True, capture_output=True, check=True).stdout.strip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("app", choices=sorted({key[0] for key in APPS}))
    parser.add_argument("environment", choices=("production", "staging"))
    parser.add_argument("--branch", required=True)
    args = parser.parse_args()

    key = (args.app, args.environment)
    if key not in APPS:
        parser.error("Application/environnement non autorisé")

    root, project, compose, branch = APPS[key]
    if args.branch != branch:
        parser.error(f"Branche refusée : {args.branch} (attendu : {branch})")

    root_path = Path(root)
    if not root_path.is_dir() or not (root_path / ".git").is_dir():
        parser.error(f"Dépôt absent : {root}")

    remote = run("git", "-C", root, "remote", "get-url", "origin")
    if remote not in (
        "https://github.com/christophe-freijanes/freijstack.git",
        "git@github.com:christophe-freijanes/freijstack.git",
    ):
        parser.error("Dépôt origin non autorisé")

    current = run("git", "-C", root, "branch", "--show-current")
    if current != branch:
        parser.error(f"Branche locale {current!r} différente de {branch!r}")

    modified = run("git", "-C", root, "status", "--porcelain")
    if modified:
        parser.error(f"Modifications locales présentes dans {root}. Déploiement bloqué.")

    target = root_path / project / compose
    if not target.is_file() or target.is_symlink():
        parser.error(f"Compose absent ou lien symbolique : {target}")

    if args.app == "registry" and args.environment == "production":
        parser.error("Registry production suspendu jusqu'à externalisation du Compose et de .htpasswd")

    print(f"PRECHECK OK: {args.app} {args.environment} branche={branch}")
    print("Aucune modification Git/Docker effectuée.")


if __name__ == "__main__":
    main()
