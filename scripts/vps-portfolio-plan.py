#!/usr/bin/env python3
"""Plan pilote Portfolio, lecture seule ; aucune commande Docker."""
import argparse
import hashlib
import subprocess
from pathlib import Path

REPO = Path("/srv/www/portfolio")
COMPOSE = "saas/portfolio/docker-compose.prod.yml"
ORIGINS = {
    "https://github.com/christophe-freijanes/freijstack.git",
    "git@github.com:christophe-freijanes/freijstack.git",
}

def git(*args):
    return subprocess.run(
        ["git", "-C", str(REPO), *args],
        check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        timeout=20,
    ).stdout

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--sha", required=True, help="SHA complet du commit master approuvé")
    args = parser.parse_args()
    if len(args.sha) != 40 or any(c not in "0123456789abcdef" for c in args.sha):
        parser.error("SHA Git complet (40 caractères hexadécimaux) requis")
    if REPO.is_symlink() or not (REPO / ".git").is_dir():
        parser.error("Dépôt absent ou lien symbolique")
    try:
        origin = git("remote", "get-url", "origin").decode().strip()
        if origin not in ORIGINS:
            parser.error("Origine non approuvée")
        if git("status", "--porcelain").strip():
            parser.error("Arbre de travail local modifié")
        master = git("rev-parse", "refs/remotes/origin/master").decode().strip()
        if args.sha != master:
            parser.error("SHA demandé différent de origin/master local : aucun fetch automatique")
        candidate = git("show", f"{args.sha}:{COMPOSE}")
    except subprocess.CalledProcessError:
        parser.error("Référence Git inaccessible ; synchroniser manuellement les refs avant ce contrôle")
    current_path = REPO / COMPOSE
    if current_path.is_symlink() or not current_path.is_file():
        parser.error("Compose local absent ou lien symbolique")
    current = current_path.read_bytes()
    print("PLAN PORTFOLIO PRODUCTION — LECTURE SEULE")
    print("Commit approuvé :", args.sha)
    print("Compose en place :", hashlib.sha256(current).hexdigest())
    print("Compose candidat :", hashlib.sha256(candidate).hexdigest())
    print("Différence Compose :", "OUI" if current != candidate else "NON")
    print("AUCUN git checkout/reset/clean, aucun docker, aucune écriture.")

if __name__ == "__main__":
    main()
