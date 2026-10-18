#!/usr/bin/env python3
"""Vérifie la présentation minimale des README FreijStack."""

import re
import sys
from pathlib import Path

# 1. Variables
ROOT = Path(__file__).resolve().parents[1]
MAX_LINES = 200
IMAGE = re.compile(r"!\\[[^\\]]*\\]\\([^)]+\\)|<img\\b", re.IGNORECASE)


# 2. Fonctions
def check_readme(path):
    """Contrôle la longueur et l'absence d'illustrations."""
    content = path.read_text(encoding="utf-8")
    problems = []
    if len(content.splitlines()) > MAX_LINES:
        problems.append(f"{path}: dépasse {MAX_LINES} lignes")
    if IMAGE.search(content):
        problems.append(f"{path}: illustration non autorisée")
    return problems


def main():
    """Contrôle les README puis affiche un résultat exploitable."""
    root = Path(sys.argv[1]).resolve() if len(sys.argv) == 2 else ROOT
    if len(sys.argv) > 2 or not root.is_dir():
        raise SystemExit("Usage : check-code-standards.py [racine-du-depot]")
    readmes = sorted(root.rglob("README.md"))
    issues = [issue for path in readmes for issue in check_readme(path)]
    for issue in issues:
        print(issue)
    print(f"README : {len(readmes)} contrôlés, {len(issues)} écart(s)")
    return 1 if issues else 0


# 3. Point d'entrée
if __name__ == "__main__":
    sys.exit(main())
