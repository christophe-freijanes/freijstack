#!/usr/bin/env python3
"""Passerelle Freijstack : validation stricte, aucune exécution Docker."""
import argparse
import os
import subprocess
from pathlib import Path

ROOT = Path("/srv/www")
ALLOWED = {
    ("portfolio", "production"): ("portfolio", "saas/portfolio/docker-compose.prod.yml", "master"),
    ("securevault", "production"): ("securevault", "saas/securevault/docker-compose.prod.yml", "master"),
    ("registry", "production"): ("registry", "saas/registry/docker-compose.prod.yml", "master"),
}

def git(root: Path, *args: str) -> str:
    proc = subprocess.run(
        ["git", "-C", str(root), *args], capture_output=True, text=True,
        check=False, timeout=15,
    )
    if proc.returncode:
        raise ValueError(f"Git a refusé l'opération {args[0]}")
    return proc.stdout.strip()

def main() -> None:
    parser = argparse.ArgumentParser(description="Contrôle lecture seule, sans Docker")
    parser.add_argument("app", choices=("portfolio", "securevault", "registry"))
    parser.add_argument("environment", choices=("production",))
    parser.add_argument("--branch", required=True)
    args = parser.parse_args()
    key = (args.app, args.environment)
    directory, compose_rel, expected_branch = ALLOWED[key]
    if args.branch != expected_branch:
        parser.error("Branche de production non autorisée")
    root = ROOT / directory
    if root.is_symlink() or not root.is_dir():
        parser.error("Répertoire absent ou lien symbolique")
    if not (root / ".git").is_dir():
        parser.error("Dépôt Git absent")
    try:
        origin = git(root, "remote", "get-url", "origin")
        if origin not in (
            "https://github.com/christophe-freijanes/freijstack.git",
            "git@github.com:christophe-freijanes/freijstack.git",
        ):
            parser.error("Origine Git non autorisée")
        actual_branch = git(root, "branch", "--show-current")
        changes = git(root, "status", "--porcelain", "--untracked-files=normal")
    except ValueError as exc:
        parser.error(str(exc))
    if actual_branch != expected_branch:
        parser.error(f"Branche locale non conforme : {actual_branch}")
    if changes:
        parser.error("Arbre de travail modifié ; aucune réinitialisation autorisée")
    compose = root / compose_rel
    if not compose.is_file() or compose.is_symlink():
        parser.error("Fichier Compose absent ou lien symbolique")
    if args.app == "securevault":
        secret = compose.parent / ".env"
        if not secret.is_file() or secret.is_symlink():
            parser.error("Fichier .env SecureVault absent")
        st = secret.stat()
        if st.st_uid != 0 or st.st_mode & 0o077:
            parser.error("Permissions .env SecureVault non conformes")
    if args.app == "registry":
        parser.error("Registry suspendu : configuration locale et volume à externaliser")
    print(f"VALIDATION OK : {args.app} {args.environment}")
    print("MODE AUDIT UNIQUEMENT : aucun git fetch, reset, Docker ou sudo exécuté.")

if __name__ == "__main__":
    main()
