#!/bin/bash
# Script pour ajouter la clé SSH au VPS
# Usage: Exécuter ce script sur le VPS après s'être connecté

echo "🔑 Configuration de la clé SSH..."

# Créer le dossier .ssh s'il n'existe pas
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Ajouter la clé publique
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEmb9AQYfy9u6Wn5KvOEeaSR5wpVpIOPI2eOb46aWDOB freijstack-deploy-31.97.10.57' >> ~/.ssh/authorized_keys

# Supprimer les doublons potentiels
sort -u ~/.ssh/authorized_keys -o ~/.ssh/authorized_keys

# Permissions correctes
chmod 600 ~/.ssh/authorized_keys

echo "✅ Clé SSH ajoutée avec succès!"
echo "Déconnecte-toi et reconnecte-toi pour tester:"
echo "  exit"
echo "  ssh freijstack@31.97.10.57"
