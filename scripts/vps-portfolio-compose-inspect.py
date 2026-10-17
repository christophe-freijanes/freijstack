#!/usr/bin/env python3
"""Inspection non destructive de l'identité Docker Compose de Portfolio."""
import subprocess

def query(*args):
    p = subprocess.run(args, text=True, capture_output=True, check=False, timeout=15)
    if p.returncode:
        raise SystemExit(f"ERREUR : {' '.join(args[:2])} (code {p.returncode})")
    return p.stdout.strip()

name = "portfolio"
print("CONTRÔLE PORTFOLIO — aucun déploiement")
print("conteneur :", name)
for field, template in (
    ("projet Compose", '{{index .Config.Labels "com.docker.compose.project"}}'),
    ("service Compose", '{{index .Config.Labels "com.docker.compose.service"}}'),
    ("répertoire Compose", '{{index .Config.Labels "com.docker.compose.project.working_dir"}}'),
    ("fichiers Compose", '{{index .Config.Labels "com.docker.compose.project.config_files"}}'),
    ("image", '{{.Config.Image}}'),
    ("état", "{{.State.Status}}"),
):
    value = query("docker", "inspect", "--format", template, name)
    print(f"{field} : {value}")
print("Audit terminé : aucun changement Docker.")
