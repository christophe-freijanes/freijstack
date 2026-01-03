# 🐳 Docker Registry Privé - FreijStack

[![Docker Registry](https://img.shields.io/badge/registry-Docker%20Registry%20v2-2496ED?style=flat-square&logo=docker)](./docker-compose.yml)
[![Registry UI](https://img.shields.io/badge/UI-Joxit-blue?style=flat-square&logo=docker)](./docker-compose.yml)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](../../LICENSE)

Registre Docker **privé, simple et léger** pour stocker vos images conteneur.

**Dernière mise à jour**: Janvier 2026

## 🎯 Fonctionnalités

- ✅ **Docker Registry v2** - Registre officiel Docker
- ✅ **Joxit UI** - Interface web de gestion
- ✅ **Authentication** - htpasswd basic auth
- ✅ **Multi-environnement** - Production + Staging
- ✅ **HTTPS/TLS** - Certificats Let's Encrypt via Traefik
- ✅ **Cleanup automatisé** - CI/CD pour nettoyer anciennes images
- ✅ **Storage** - Local ou cloud (AWS S3, Azure Blob)

---

## 🏗️ Architecture

```
Registry (Docker Registry v2) ← Stockage d'images
    ↓
Registry-UI (Joxit) ← Interface web pour gérer les images
    ↓
Traefik ← Reverse proxy avec HTTPS/TLS Let's Encrypt
```

---

## 🚀 Installation

### 1️⃣ Prérequis

- Docker 20.10+
- Docker Compose v2+
- Traefik configuré (voir [base-infra](../../base-infra/README.md))
- DNS configuré:
  - `registry.freijstack.com` (Production)
  - `registry-ui.freijstack.com` (Production UI)
  - `registry-staging.freijstack.com` (Staging)
  - `registry-ui-staging.freijstack.com` (Staging UI)

### 2️⃣ Sur votre VPS (Production)

```bash
cd /srv/www/registry
docker compose up -d

# Vérifier status
docker compose ps
docker compose logs -f
```
cd /srv/www/registry-staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

---

## 🔐 Créer un utilisateur d'authentificrer le registre
docker compose restart registry
```

## Utilisation

### 🔨 Builder une image
**Option 1: Utiliser le script fourni**
```bash
./generate-htpasswd.sh admin yourpassword
# Crée data/auth/htpasswd automatiquement
```

**Option 2: Commande manuelle**
```bash
# Générer un hash htpasswd pour l'authentification
docker run --entrypoint htpasswd httpd:2 -Bbn admin yourpassword > data/auth/htpasswd

# Redémarrer le registre
docker compose restart registry
```

**Option 3: Python script**
```bash
# Utiliser le générateur Python
python3 generate-password.py
# Suivre les instructions
```

---

## 📦 Utilisation
### 🔨 Builder une image

```bash
# Depuis votre portfolio
docker build -t registry.freijstack.com/portfolio:latest ./saas/portfolio

# Depuis SecureVault
docker build -t registry.freijstack.com/securevault-backend:1.0 ./saas/securevault/backend
```

### 📤 Pusher vers le registre

```bash
docker push registry.freijstack.com/portfolio:latest
```

### 🔓 Se connecter (si authentification activée)

```bash
docker login registry.freijstack.com
# Username: admin
# Password: yourpassword
```

### 🌐 Interface Web

- **Production**:
  - Registry API: https://registry.freijstack.com
  - Registry UI: https://registry-ui.freijstack.com
- **Staging**:
  - Registry API: https://registry-staging.freijstack.com
  - Registry UI: https://registry-ui-staging.freijstack.com

**Fonctionnalités UI**:
- Voir toutes les images en un coup d'œil
- Supprimer des images
- Voir les détails de chaque image (tags, layers, taille)
- Navigation simple et intuitive

---

## ⚙️ Configuration

### Environnements

Le registry supporte plusieurs configurations via docker-compose:

**Fichiers disponibles**:
- `docker-compose.yml` - Configuration de base (production)
- `docker-compose.staging.yml` - Overrides pour staging
- `docker-compose.prod.yml` - Overrides additionnels production

### Variables dans .env

```env
# Production
REGISTRY_DOMAIN=registry.freijstack.com
REGISTRY_UI_DOMAIN=registry-ui.freijstack.com

# Staging (dans docker-compose.staging.yml)
REGISTRY_DOMAIN=registry-staging.freijstack.com
REGISTRY_UI_DOMAIN=registry-ui-staging.freijstack.com
```

### Storage Backend

Par défaut: **Filesystem local** (`./data/registry`)

**Cloud Storage (optionnel)**:

```yaml
# docker-compose.yml
environment:
  REGISTRY_STORAGE: s3
  REGISTRY_STORAGE_S3_BUCKET: my-registry-bucket
  REGISTRY_STORAGE_S3_REGION: us-east-1
  REGISTRY_STORAGE_S3_ACCESSKEY: ${AWS_ACCESS_KEY}
  REGISTRY_STORAGE_S3_SECRETKEY: ${AWS_SECRET_KEY}
```

---

## 🧹 Maintenance & Cleanup

### Cleanup automatisé via CI/CD

Le workflow `registry-cleanup.yml` nettoie automatiquement les anciennes images:

```yaml
# .github/workflows/registry-cleanup.yml
- Supprime images non-taguées
- Supprime images > 30 jours
- S'exécute toutes les semaines (cron)
```

**Script manuel**:
```bash
# Utiliser le script fourni
cd /srv/www/registry
../../scripts/cleanup-registry-images.sh

# Ou manuellement
docker exec registry bin/registry garbage-collect /etc/docker/registry/config.yml
```

### Backup Registry

```bash
# Backup data directory
tar -czf registry-backup-$(date +%Y%m%d).tar.gz ./data/registry/

# Copier vers backup location
cp registry-backup-*.tar.gz /srv/backups/
```

---

## 📊 Endpoints

| Service | URL | Port | Description |
|---------|-----|------|-------------|
| Registry API (Prod) | https://registry.freijstack.com | 5000 (interne) | API Docker Registry |
| Registry UI (Prod) | https://registry-ui.freijstack.com | 80 (interne) | Interface web Joxit |
| Registry API (Staging) | https://registry-staging.freijstack.com | 5000 | API Staging |
| Registry UI (Staging) | https://registry-ui-staging.freijstack.com | 80 | UI Staging |

---

## 🔍 Troubleshooting

### Erreur "unauthorized: authentication required"

```bash
# Se connecter au registry
docker login registry.freijstack.com

# Vérifier credentials
cat ~/.docker/config.json
```

### Voir les images dans le registry

```bash
# Via API
curl https://registry.freijstack.com/v2/_catalog

# Via UI
# Ouvrir https://registry-ui.freijstack.com
```

### Vérifier les logs

```bash
# Registry
docker compose logs -f registry

# Registry UI
docker compose logs -f registry-ui
```

---

## 📚 Documentation

- **Architecture**: [../../docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
- **CI/CD**: [../../docs/CI_CD_ARCHITECTURE.md](../../docs/CI_CD_ARCHITECTURE.md)
- **Déploiement**: [../../docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md)
- **Scripts**: [../../scripts/README.md](../../scripts/README.md)

---

## 📬 Support

Pour les questions ou issues :
- 💼 [LinkedIn](https://www.linkedin.com/in/christophe-freijanes)
- 🌐 [Portfolio](https://portfolio.freijstack.com)

---

© 2026 Christophe FREIJANES. Tous droits réservés.

**Version**: 1.0.0  
**Dernière mise à jour**: Janvier 2026  
**Status**: ✅ Production Ready
| Registry UI | https://registry-ui-staging.freijstack.com | 80 (interne) |

## Dépannage

### Vérifier la santé

```bash
curl -k https://registry-staging.freijstack.com/v2/
# Doit retourner 200 OK
```

### Voir les logs

```bash
docker compose logs -f registry registry-ui
```

### Lister les images stockées

```bash
# Via API
curl -k https://registry-staging.freijstack.com/v2/_catalog
```

## Limitations

- Pas de gestion d'utilisateurs avancée (htpasswd basique)
- Pas de replication/clustering
- Pas de scanning de vulnérabilités

Pour plus de features, voir [Harbor](https://goharbor.io/) ou [Nexus](https://www.sonatype.com/products/nexus-repository).

## Documentation Officielle

- [Docker Registry v2](https://docs.docker.com/registry/)
- [Joxit Registry UI](https://github.com/Joxit/docker-registry-ui)
