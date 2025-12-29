# 🐳 Harbor Container Registry

[![Docker](https://img.shields.io/badge/docker-Harbor%20v2.10-2496ED?style=flat-square&logo=docker)](./docker-compose.yml)
[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL%2016-336791?style=flat-square&logo=postgresql)](./docker-compose.yml)
[![Redis](https://img.shields.io/badge/cache-Redis-DC382D?style=flat-square&logo=redis)](./docker-compose.yml)
[![Trivy](https://img.shields.io/badge/scanner-Trivy-1904DA?style=flat-square&logo=security)](./docker-compose.yml)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](../../LICENSE)

**Container Registry privé** avec scan de vulnérabilités Trivy, RBAC, interface web, et intégration CI/CD.

Solution production-grade pour stocker, sécuriser et distribuer vos images Docker.

---

## 🎯 Fonctionnalités

### Sécurité
- ✅ **Scan Trivy intégré** - Détection automatique des vulnérabilités
- ✅ **RBAC granulaire** - Permissions par projet/utilisateur
- ✅ **Signature d'images** - Notary pour garantir l'intégrité
- ✅ **Audit complet** - Logs de toutes les actions
- ✅ **HTTPS/TLS** - Certificats Let's Encrypt via Traefik
- ✅ **Webhooks** - Notifications push/pull/scan

### Gestion d'Images
- 🐳 **Multi-projets** - Organisation par équipes
- 🏷️ **Tag retention** - Politiques de nettoyage automatique
- 📊 **Quotas** - Limites de stockage par projet
- 🔄 **Réplication** - Multi-registry synchronisation
- 📈 **Garbage collection** - Nettoyage des blobs orphelins

### Interface & API
- 🌐 **Web UI moderne** - Dashboard complet
- 🔌 **API REST** - Automatisation complète
- 📊 **Métriques** - Prometheus intégré
- 🔍 **Recherche avancée** - Images, tags, vulnérabilités

---

## 🏗️ Architecture

```
registry.freijstack.com
│
├── Harbor Core (API + Web UI)
├── Harbor Portal (Frontend)
├── Docker Registry (Stockage images)
├── Trivy Adapter (Scanner CVE)
├── Job Service (Tâches async)
├── PostgreSQL (Métadonnées)
├── Redis (Cache + Queue)
└── Nginx (Reverse proxy)
```

### Flux de Push d'Image

```
1. Developer: docker push registry.freijstack.com/projet/app:v1.0
   ↓
2. Traefik → Harbor Nginx
   ↓
3. Harbor Core (Auth RBAC)
   ↓
4. Harbor Registry (Stockage)
   ↓
5. Job Service → Trivy Scan
   ↓
6. Notification Webhook (si vulnérabilités)
```

---

## 🚀 Installation & Déploiement

### Prérequis

- Docker 20.10+
- Docker Compose v2+
- Traefik configuré (voir `/base-infra`)
- DNS: `registry.freijstack.com` → VPS IP
- 4GB RAM minimum (8GB recommandé)
- 20GB disque minimum

### 1. Configuration DNS

```bash
# Ajouter chez votre registrar
registry.freijstack.com        A    <VPS_IP>
registry-staging.freijstack.com A   <VPS_IP>
```

Vérifier propagation:
```bash
dig registry.freijstack.com +short
```

### 2. Générer les Secrets

```bash
cd saas/harbor

# Générer tous les secrets
echo "DB_PASSWORD=$(openssl rand -hex 32)"
echo "HARBOR_ADMIN_PASSWORD=$(openssl rand -base64 16)"
echo "CORE_SECRET=$(openssl rand -hex 32)"
echo "JOBSERVICE_SECRET=$(openssl rand -hex 32)"
echo "REGISTRY_HTTP_SECRET=$(openssl rand -hex 32)"
```

### 3. Créer .env

**Pour production:**
```bash
cp .env.production .env
nano .env  # Remplir les secrets générés ci-dessus
```

**Pour staging:**
```bash
cp .env.staging .env
nano .env
```

**Variables critiques à remplir:**
- `DB_PASSWORD` - Mot de passe PostgreSQL
- `HARBOR_ADMIN_PASSWORD` - Password admin web UI
- `CORE_SECRET` - Secret API Harbor Core
- `JOBSERVICE_SECRET` - Secret Job Service
- `REGISTRY_HTTP_SECRET` - Secret Docker Registry

### 4. Initialiser Harbor

```bash
# Créer les volumes
docker volume create harbor_db_data
docker volume create harbor_registry_data
docker volume create harbor_trivy_cache

# Démarrer Harbor
docker compose up -d

# Vérifier les logs
docker compose logs -f
```

### 5. Accéder à l'Interface

```
URL: https://registry.freijstack.com
Username: admin
Password: <HARBOR_ADMIN_PASSWORD from .env>
```

---

## 🔧 Configuration Post-Installation

### Créer un Projet

1. Login à https://registry.freijstack.com
2. **Projects** → **New Project**
3. Configurer:
   - **Name**: `securevault`
   - **Access Level**: Private
   - **Quota**: 10GB
   - **Vulnerability scanning**: Enable auto-scan on push

### Activer Trivy Scanner

1. **Administration** → **Interrogation Services**
2. **New Scanner** → Trivy (déjà configuré)
3. **Set as Default**
4. Activer **Scan on Push** par projet

### Configurer Retention Policy

1. **Project** → **Policy**
2. **Tag Retention**:
   - Keep last 10 tags
   - Keep tags matching `v*` (versions)
   - Delete untagged artifacts after 7 days

### Créer un Robot Account

Pour CI/CD, créer un compte robot:

1. **Project** → **Robot Accounts**
2. **New Robot Account**:
   - Name: `securevault-cicd`
   - Expiration: 365 days
   - Permissions: Push + Pull
3. **Copier le token** (affiché une seule fois!)

---

## 📦 Utilisation

### Docker Login

```bash
# Login manuel
docker login registry.freijstack.com
Username: admin
Password: <HARBOR_ADMIN_PASSWORD>

# Login avec robot token (CI/CD)
docker login registry.freijstack.com -u robot\$securevault-cicd -p <ROBOT_TOKEN>
```

### Push d'une Image

```bash
# Tag l'image
docker tag securevault-backend:latest registry.freijstack.com/securevault/backend:latest
docker tag securevault-backend:latest registry.freijstack.com/securevault/backend:v1.0.0

# Push
docker push registry.freijstack.com/securevault/backend:latest
docker push registry.freijstack.com/securevault/backend:v1.0.0

# Le scan Trivy démarre automatiquement
```

### Pull d'une Image

```bash
docker pull registry.freijstack.com/securevault/backend:latest
```

### Lister les Images

```bash
# Via CLI
curl -u admin:<PASSWORD> https://registry.freijstack.com/api/v2.0/projects/securevault/repositories

# Via Web UI
https://registry.freijstack.com → Projects → securevault → Repositories
```

---

## 🔗 Intégration GitHub Actions

### Ajouter Secrets GitHub

```
HARBOR_USERNAME=robot$securevault-cicd
HARBOR_PASSWORD=<ROBOT_TOKEN>
HARBOR_REGISTRY=registry.freijstack.com
```

### Workflow Example

```yaml
name: Build & Push to Harbor

on:
  push:
    branches: [master, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Login to Harbor
        uses: docker/login-action@v3
        with:
          registry: ${{ secrets.HARBOR_REGISTRY }}
          username: ${{ secrets.HARBOR_USERNAME }}
          password: ${{ secrets.HARBOR_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            ${{ secrets.HARBOR_REGISTRY }}/securevault/backend:latest
            ${{ secrets.HARBOR_REGISTRY }}/securevault/backend:${{ github.sha }}
      
      - name: Scan image (Trivy auto-scan)
        run: echo "Image will be scanned automatically by Harbor"
```

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Vérifier tous les containers
docker compose ps

# Logs spécifiques
docker compose logs harbor-core
docker compose logs harbor-trivy
docker compose logs harbor-jobservice

# Health check API
curl https://registry.freijstack.com/api/v2.0/health
```

### Métriques Prometheus

```bash
# Harbor expose des métriques Prometheus
curl https://registry.freijstack.com/metrics
```

### Garbage Collection

Nettoyer les blobs orphelins:

1. **Administration** → **Garbage Collection**
2. **Run Now** ou configurer un cron
3. Recommandé: **Nuit, 1x/semaine**

### Backup

```bash
# Backup PostgreSQL (métadonnées)
docker compose exec harbor-db pg_dump -U postgres registry > harbor-backup-$(date +%Y%m%d).sql

# Backup Registry (images)
docker run --rm \
  -v harbor_registry_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/harbor-registry-$(date +%Y%m%d).tar.gz -C /data .

# Backup Trivy cache
docker run --rm \
  -v harbor_trivy_cache:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/harbor-trivy-$(date +%Y%m%d).tar.gz -C /data .
```

### Restore

```bash
# Restore database
cat harbor-backup-20251229.sql | docker compose exec -T harbor-db psql -U postgres registry

# Restore registry
docker run --rm \
  -v harbor_registry_data:/data \
  -v $(pwd):/backup \
  alpine sh -c "cd /data && tar xzf /backup/harbor-registry-20251229.tar.gz"
```

---

## 🔒 Sécurité

### Scan de Vulnérabilités

- **Trivy** intégré scanne automatiquement chaque push
- Détecte les CVE dans: OS packages, librairies, dépendances
- Niveaux: UNKNOWN, LOW, MEDIUM, HIGH, CRITICAL
- Politique: Bloquer les images avec vulnérabilités CRITICAL

### Best Practices

1. **Images de base** - Utiliser alpine/distroless
2. **Multi-stage builds** - Réduire la surface d'attaque
3. **Robot accounts** - 1 token par CI/CD pipeline
4. **Rotation tokens** - Renouveler tous les 90 jours
5. **Scan régulier** - Re-scanner les images existantes (nouveaux CVE)
6. **Quotas** - Limiter l'usage par projet
7. **Audit logs** - Monitorer les accès suspects

---

## 🐛 Troubleshooting

### Harbor Core ne démarre pas

```bash
# Vérifier logs
docker compose logs harbor-core

# Problème commun: secrets non définis
grep -E "SECRET|PASSWORD" .env

# Recréer les containers
docker compose down
docker compose up -d
```

### Scan Trivy échoue

```bash
# Mettre à jour la base CVE
docker compose exec harbor-trivy trivy image --download-db-only

# Vérifier les logs
docker compose logs harbor-trivy
```

### Push échoue "unauthorized"

```bash
# Vérifier le login
docker login registry.freijstack.com

# Pour robot account, format exact:
docker login registry.freijstack.com -u 'robot$nom-du-robot' -p 'token'
```

### Certificat SSL invalide

```bash
# Vérifier Traefik
docker logs traefik | grep registry.freijstack.com

# Forcer renouvellement
docker restart traefik
sleep 60
docker compose restart harbor-nginx
```

### Espace disque plein

```bash
# Garbage collection immédiat
docker compose exec harbor-core harbor-gc

# Nettoyer images Docker locales
docker system prune -a --volumes
```

---

## 📚 Resources

- **Harbor Documentation**: https://goharbor.io/docs/
- **API Reference**: https://goharbor.io/docs/latest/build-customize-contribute/configure-swagger/
- **Trivy**: https://aquasecurity.github.io/trivy/
- **Architecture FreijStack**: [/docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)

---

## 📞 Contact

- **Auteur**: Christophe FREIJANES
- **Portfolio**: https://portfolio.freijstack.com
- **GitHub**: https://github.com/christophe-freijanes/freijstack

---

**Version**: 1.0.0  
**Harbor Version**: v2.10.0  
**Dernière mise à jour**: Décembre 2025  
**Status**: ✅ Production Ready
