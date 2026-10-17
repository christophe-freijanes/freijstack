
# 🚀 Guide de Déploiement - FreijStack

---

## 📝 Résumé

Ce guide détaille toutes les étapes pour déployer les applications SaaS FreijStack (Portfolio, SecureVault, n8n) sur un VPS sécurisé et performant.

- **Public visé** : DevOps, administrateurs, contributeurs
- **Objectif** : Déployer rapidement et en toute sécurité l’infrastructure FreijStack
- **Points clés** : Prérequis, installation, configuration, rollback, troubleshooting

---

**Dernière mise à jour**: Décembre 2025

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Setup VPS Initial](#setup-vps-initial)
3. [Installation Docker & Compose](#installation-docker--compose)
4. [Configuration Traefik](#configuration-traefik)
5. [Configuration DNS](#configuration-dns)
6. [Déploiement Portfolio](#déploiement-portfolio)
7. [Configuration GitHub Actions](#configuration-github-actions)
8. [Vérification & Tests](#vérification--tests)
9. [Rollback Procédures](#rollback-procédures)
10. [Troubleshooting](#troubleshooting)

---

## Prérequis


### Matériel requis
- VPS Ubuntu 22.04 LTS (min. 2 vCPU, 2 GB RAM, 20 GB SSD, 1 TB/mois)

### Logiciels
- SSH client (OpenSSH, PuTTY)
- Git client
- Accès root ou sudo

### Accès
- Nom de domaine configuré (freijstack.com)
- Accès DNS pour sous-domaines
- Clé SSH

---

## Setup VPS Initial

### 1. Connexion SSH

```bash
# Connexion initiale (remplacer IP_VPS)
ssh root@IP_VPS

# Ou avec clé SSH
ssh -i ~/.ssh/id_rsa root@IP_VPS
```

### 2. Mise à Jour Système

```bash
# Update packages
apt update && apt upgrade -y

# Install essentials
apt install -y \
  curl \
  wget \
  git \
  vim \
  htop \
  ufw \
  fail2ban \
  ca-certificates \
  gnupg \
  lsb-release
```

### 3. Créer Utilisateur Non-Root

```bash
# Créer utilisateur deploy
adduser deploy
usermod -aG sudo deploy

# Copier SSH keys
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Tester connexion
# (depuis votre machine locale)
ssh deploy@IP_VPS
```

### 4. Configuration Firewall

```bash
# Activer UFW
ufw default deny incoming
ufw default allow outgoing

# Autoriser SSH, HTTP, HTTPS
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# Activer firewall
ufw enable

# Vérifier status
ufw status verbose
```

### 5. Hardening SSH

```bash
# Éditer config SSH
sudo vim /etc/ssh/sshd_config

# Modifications recommandées:
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
# Port 22 (ou custom si souhaité)

# Redémarrer SSH
sudo systemctl restart sshd
```

---

## Installation Docker & Compose

### 1. Installer Docker

```bash
# Ajouter Docker repository
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Ajouter user au groupe docker
sudo usermod -aG docker deploy

# Vérifier installation
docker --version
```

### 2. Installer Docker Compose

```bash
# Télécharger Docker Compose v2
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Permissions exécution
sudo chmod +x /usr/local/bin/docker-compose

# Vérifier installation
docker-compose --version
```

### 3. Tester Docker

```bash
# Test hello-world
docker run hello-world

# Si succès, nettoyer
docker rm $(docker ps -aq)
docker rmi hello-world
```

---

## Configuration Traefik

### 1. Créer Structure Dossiers

```bash
# Créer dossiers
sudo mkdir -p /srv/docker/traefik
sudo mkdir -p /srv/www/portfolio
sudo mkdir -p /srv/www/portfolio-staging
sudo mkdir -p /home/deploy/backups

# Permissions
sudo chown -R deploy:deploy /srv/docker
sudo chown -R deploy:deploy /srv/www
sudo chown -R deploy:deploy /home/deploy/backups
```

### 2. Créer docker-compose.yml

```bash
cd /srv/docker/traefik
vim docker-compose.yml
```

**Contenu** (`docker-compose.yml`):

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./acme.json:/acme.json
    command:
      - "--api.dashboard=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=contact@freijstack.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/acme.json"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
    networks:
      - web

  portfolio-prod:
    image: nginx:alpine
    container_name: portfolio-prod
    restart: unless-stopped
    volumes:
      - /srv/www/portfolio:/usr/share/nginx/html:ro
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portfolio.rule=Host(`portfolio.freijstack.com`)"
      - "traefik.http.routers.portfolio.entrypoints=websecure"
      - "traefik.http.routers.portfolio.tls.certresolver=letsencrypt"
      - "traefik.http.services.portfolio.loadbalancer.server.port=80"
    networks:
      - web

  portfolio-staging:
    image: nginx:alpine
    container_name: portfolio-staging
    restart: unless-stopped
    volumes:
      - /srv/www/portfolio-staging:/usr/share/nginx/html:ro
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portfolio-staging.rule=Host(`portfolio-staging.freijstack.com`)"
      - "traefik.http.routers.portfolio-staging.entrypoints=websecure"
      - "traefik.http.routers.portfolio-staging.tls.certresolver=letsencrypt"
      - "traefik.http.services.portfolio-staging.loadbalancer.server.port=80"
    networks:
      - web

networks:
  web:
    external: true
```

### 3. Préparer Certificats SSL

```bash
# Créer fichier acme.json
touch acme.json
chmod 600 acme.json
```

### 4. Créer Network Docker

```bash
docker network create web
```

### 5. Lancer Traefik

```bash
cd /srv/docker/traefik
docker-compose up -d

# Vérifier logs
docker-compose logs -f traefik
```

---

## Configuration DNS

### Configuration chez votre Provider DNS

**Enregistrements A à créer** :

| Nom | Type | Valeur | TTL |
|-----|------|--------|-----|
| portfolio | A | `IP_VPS` | 3600 |
| portfolio-staging | A | `IP_VPS` | 3600 |

**OU avec CNAME** (si sous-domaines) :

| Nom | Type | Valeur | TTL |
|-----|------|--------|-----|
| portfolio | CNAME | `freijstack.com` | 3600 |
| portfolio-staging | CNAME | `freijstack.com` | 3600 |

### Vérification DNS

```bash
# Vérifier propagation DNS
dig portfolio.freijstack.com +short
dig portfolio-staging.freijstack.com +short

# Ou avec nslookup
nslookup portfolio.freijstack.com
```

⏰ **Attendre 5-30min** pour propagation DNS complète.

---

## Déploiement Portfolio

### 1. Déploiement Manuel Initial

```bash
# Cloner le repo (sur VPS)
cd /tmp
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack

# Copier vers production
sudo cp -r saas/portfolio/* /srv/www/portfolio/

# Copier vers staging
sudo cp -r saas/portfolio/* /srv/www/portfolio-staging/

# Permissions
sudo chown -R deploy:deploy /srv/www/portfolio
sudo chown -R deploy:deploy /srv/www/portfolio-staging
chmod 644 /srv/www/portfolio/*.{html,css,js,json}
chmod 644 /srv/www/portfolio-staging/*.{html,css,js,json}
```

### 2. Tester Accès

```bash
# Vérifier HTTP (doit rediriger vers HTTPS)
curl -I http://portfolio.freijstack.com

# Vérifier HTTPS
curl -I https://portfolio.freijstack.com

# Vérifier staging
curl -I https://portfolio-staging.freijstack.com
```

✅ Vous devriez voir un **HTTP 200 OK** ou **301/302** (redirection).

---

## Configuration GitHub Actions

### 1. Générer Clé SSH pour CI/CD

```bash
# Sur votre machine locale
ssh-keygen -t ed25519 -C "github-actions@freijstack.com" -f ~/.ssh/freijstack_deploy

# Copier clé publique sur VPS
ssh-copy-id -i ~/.ssh/freijstack_deploy.pub deploy@IP_VPS

# Tester connexion
ssh -i ~/.ssh/freijstack_deploy deploy@IP_VPS
```

### 2. Ajouter Secrets GitHub

Dans GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Nom | Valeur |
|-----|--------|
| `SSH_PRIVATE_KEY` | Contenu de `~/.ssh/freijstack_deploy` (clé privée complète) |
| `SSH_HOST` | `IP_VPS` ou `vps.freijstack.com` |
| `SSH_USERNAME` | `deploy` |

### 3. Workflow Already Configured ✅

Le fichier `.github/workflows/main.yml` est déjà configuré et déploiera automatiquement :
- **develop** → `portfolio-staging.freijstack.com`
- **master** → `portfolio.freijstack.com`

---

## Vérification & Tests

### 1. Health Checks

```bash
# Vérifier containers actifs
docker ps

# Vérifier logs Traefik
docker logs traefik

# Vérifier logs nginx
docker logs portfolio-prod
docker logs portfolio-staging
```

### 2. Tests SSL

```bash
# Test SSL Labs (dans navigateur)
https://www.ssllabs.com/ssltest/analyze.html?d=portfolio.freijstack.com

# Test avec curl
curl -vI https://portfolio.freijstack.com
```

### 3. Tests Performance

```bash
# Test temps réponse
time curl -so /dev/null https://portfolio.freijstack.com

# Test avec ab (Apache Bench)
ab -n 100 -c 10 https://portfolio.freijstack.com/
```

---

## Rollback Procédures

### 1. Rollback Automatique (via Backups)

```bash
# Lister backups disponibles
ls -lh /home/deploy/backups/

# Restaurer backup spécifique
cd /home/deploy/backups
tar -xzf portfolio-2025-12-27-120000.tar.gz -C /srv/www/

# Restart nginx containers
docker-compose -f /srv/docker/traefik/docker-compose.yml restart portfolio-prod
```

### 2. Rollback Git (Remote)

```bash
# Sur votre machine locale
git log --oneline -10

# Reset vers commit stable
git reset --hard <commit-hash>
git push --force origin master

# Le CI/CD déploiera automatiquement
```

### 3. Rollback Manual

```bash
# Copier version précédente depuis staging
sudo rsync -av /srv/www/portfolio-staging/ /srv/www/portfolio/

# Ou depuis backup local
sudo cp -r /path/to/backup/portfolio/ /srv/www/portfolio/
```

---

## Troubleshooting

### Problème: "502 Bad Gateway"

**Cause**: nginx container pas démarré ou path vide

```bash
# Vérifier containers
docker ps -a

# Restart si stopped
docker-compose -f /srv/docker/traefik/docker-compose.yml restart portfolio-prod

# Vérifier contenu /srv/www/portfolio
ls -lah /srv/www/portfolio/
```

### Problème: Certificat SSL invalide

**Cause**: Let's Encrypt rate limit ou DNS mal configuré

```bash
# Vérifier logs ACME
docker logs traefik | grep acme

# Supprimer acme.json et relancer
rm /srv/docker/traefik/acme.json
touch /srv/docker/traefik/acme.json
chmod 600 /srv/docker/traefik/acme.json
docker-compose -f /srv/docker/traefik/docker-compose.yml restart traefik
```

### Problème: "Connection refused"

**Cause**: Firewall bloque ports ou Traefik down

```bash
# Vérifier firewall
sudo ufw status

# Vérifier Traefik
docker ps | grep traefik

# Vérifier ports listening
sudo netstat -tlnp | grep -E ':(80|443)'
```

---

## 📞 Support

**Logs utiles** :

```bash
# Logs système
sudo journalctl -xe

# Logs Docker
docker logs traefik
docker logs portfolio-prod

# Logs nginx access
docker exec portfolio-prod cat /var/log/nginx/access.log
```

**Monitoring** :

```bash
# Ressources système
htop
df -h
free -h

# Docker stats
docker stats
```

---

**Voir aussi** :
- [Architecture Technique](architecture.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [Monitoring Guide](MONITORING.md)

---

**Version**: 1.0  
**Auteur**: Christophe FREIJANES  
**Date**: Décembre 2025
 
---

## 🔧 Prochaines Étapes - Déploiement VPS (SecureVault)

Procédure pas-à-pas pour déployer l'application SaaS de démo SecureVault sur le VPS hébergeant déjà le portfolio.

### 1. Préparer DNS et Traefik

- Ajouter ces enregistrements DNS vers l'IP du VPS:

```
Type    Nom                   Valeur
A       vault                 IP_VPS
A       vault-api             IP_VPS
```

- Vérifier que le réseau Docker Traefik existe (créé plus haut):

```bash
docker network ls | grep web || docker network create web
```

### 2. Récupérer le code sur le VPS

```bash
ssh deploy@IP_VPS
cd /srv/docker
git clone https://github.com/christophe-freijanes/freijstack.git || true
cd freijstack
git pull origin develop
cd saas/securevault
```

### 3. Générer les secrets nécessaires

```bash
# JWT Secret (32 bytes = 64 hex chars)
openssl rand -hex 32

# Encryption Key (32 bytes = 64 hex chars)
openssl rand -hex 32

# Database Password
openssl rand -base64 24
```

### 4. Configurer l'environnement

```bash
cp .env.example .env
nano .env

# Renseigner:
# DB_PASSWORD=...
# JWT_SECRET=...
# ENCRYPTION_KEY=...
```

### 5. Builder et démarrer les services

```bash
docker-compose up -d --build

# Vérifier conteneurs
docker-compose ps

# Suivre les logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 6. Initialiser la base de données

```bash
chmod +x init-db.sh
./init-db.sh
```

### 7. Vérifications post-déploiement

```bash
# Backend API (Doit renvoyer status healthy)
curl https://vault-api.freijstack.com/health

# Frontend (Réponse 200)
curl -I https://vault.freijstack.com

# Certificats TLS actifs via Traefik
docker logs traefik | grep -i acme
```

### 8. Premier utilisateur et premier secret

1. Ouvrir https://vault.freijstack.com
2. Créer un compte (page Register)
3. Se connecter (Login)
4. Créer un secret (ex: `aws-api-key`) via le Dashboard

### 9. Notes importantes de sécurité

- Ne pas changer `ENCRYPTION_KEY` en production sans rotation planifiée (perte d'accès aux secrets existants)
- Sauvegarder `ENCRYPTION_KEY` et `JWT_SECRET` dans un coffre (Vault/1Password)
- Sauvegarder la base PostgreSQL régulièrement:

```bash
docker-compose exec postgres pg_dump -U securevault securevault | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### 10. Rollback rapide (SecureVault)

```bash
# Arrêter services
docker-compose down

# Restaurer DB depuis backup
gunzip -c backup_YYYYMMDD_HHMMSS.sql.gz | docker-compose exec -T postgres psql -U securevault securevault

# Relancer
docker-compose up -d
```

Pour plus de détails, voir la documentation dédiée: saas/securevault/README.md.
