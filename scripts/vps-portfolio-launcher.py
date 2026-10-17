#!/usr/bin/env python3
"""Déploiement Portfolio uniquement, désactivé par défaut."""
import argparse
import fcntl
import hashlib
import os
import subprocess
from pathlib import Path

COMPOSE = Path("/etc/freijstack/portfolio/docker-compose.prod.yml")
EXPECTED_SHA256 = "12bbcf20be21948374ec4cc1d372ab1ef198c44be681d7524037250c9e954ab1"
PROJECT = "portfolio"
SERVICE = "portfolio"
IMAGE = "registry.freijstack.com/portfolio:latest"
LOCK = Path("/run/lock/freijstack-portfolio.lock")
APPROVED_DIGEST = "sha256:f2fd2b89c37f859dd3e04c6acb74c61df74029988e6e9142a03ab1a6152f954e"
APPROVED_IMAGE_ID = "sha256:6d288764c70eb5856938ed772c8f54b36690be5814f5fb0c2230bd9f3a606319"


def check():
    if os.geteuid() != 0:
        raise SystemExit("REFUS : exécuter sous root uniquement")
    if COMPOSE.is_symlink() or not COMPOSE.is_file():
        raise SystemExit("REFUS : Compose root-owned absent ou lien symbolique")
    st = COMPOSE.stat()
    if st.st_uid != 0 or st.st_gid != 0 or st.st_mode & 0o022:
        raise SystemExit("REFUS : permissions Compose non conformes")
    digest = hashlib.sha256(COMPOSE.read_bytes()).hexdigest()
    if digest != EXPECTED_SHA256:
        raise SystemExit("REFUS : Compose différent du fichier approuvé")
    digest_image = f"registry.freijstack.com/portfolio@{APPROVED_DIGEST}"
    image_info = subprocess.run(
        ["docker", "image", "inspect", "--format", "{{.Id}}", digest_image],
        capture_output=True, text=True, check=True, timeout=15,
    )
    if image_info.stdout.strip() != APPROVED_IMAGE_ID:
        raise SystemExit("REFUS : image locale différente du digest approuvé")
    result = subprocess.run(
        ["docker", "inspect", "--format",
         '{{index .Config.Labels "com.docker.compose.project"}}|'
         '{{index .Config.Labels "com.docker.compose.service"}}|'
         '{{.Config.Image}}', SERVICE],
        capture_output=True, text=True, check=True, timeout=15,
    )
    fields = result.stdout.strip().split("|")
    if fields != [PROJECT, SERVICE, IMAGE]:
        raise SystemExit("REFUS : identité du conteneur inattendue")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Activation réelle (root)")
    args = parser.parse_args()
    with LOCK.open("w") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        check()
        if not args.apply:
            print("AUDIT OK : Portfolio, Compose approuvé et conteneur existant")
            print("Aucune commande pull/up exécutée.")
            return
        raise SystemExit("REFUS : mode --apply suspendu ; Compose latest non verrouillé sur digest")
        command = ["docker", "compose", "--project-name", PROJECT, "-f", str(COMPOSE)]
        subprocess.run(command + ["pull", SERVICE], check=True, timeout=300)
        subprocess.run(
            command + ["up", "-d", "--no-deps", SERVICE],
            check=True, timeout=300,
        )
        print("Portfolio : commande de déploiement terminée")


if __name__ == "__main__":
    main()
