# 🏗️ Structure Docker Réorganisée

Voici la nouvelle structure claire et gérable pour ton VPS.

## 📋 Architecture

```
freijstack/                              # Racine du projet
├── docker-compose.yml                   # ⭐ ROOT TRAEFIK (Reverse Proxy Central)
│   └── Services: Traefik v2.10
│   └── Volumes: traefik_data
│   └── Networks: web (partagé)
│
├── saas/
│   └── securevault/
│       ├── docker-compose.yml           # 🔐 PRODUCTION SecureVault
│       │   └── Services: postgres, backend, frontend
│       │   └── Names: securevault-*
│       │   └── Domains: vault.freijstack.com, vault-api.freijstack.com
│       │
│       └── docker-compose.staging.yml   # 🔐 STAGING SecureVault
│           └── Services: postgres-staging, backend-staging, frontend-staging
│           └── Names: securevault-staging-*
│           └── Domains: vault-staging.freijstack.com, vault-api-staging.freijstack.com
│
└── (portfolio, n8n, etc. avec leurs propres docker-compose.yml)
```

## 🚀 Utilisation

### 1. Démarrer Traefik (une seule fois)

```bash
cd /root  # ou freijstack/

# Créer le réseau partagé
docker network create web

# Créer les volumes
docker volume create traefik_data

# Démarrer Traefik
docker compose up -d
```

**Résultat:**
- Conteneur: `traefik`
- Port: 80, 443, 8080 (dashboard)
- Réseau: `web` (external)

### 2. Déployer SecureVault PRODUCTION

```bash
cd saas/securevault

# Configuration
cp .env.example .env
# Éditer .env avec: DB_PASSWORD, JWT_SECRET, ENCRYPTION_KEY, etc.

# Démarrer production
docker compose up -d --build

# Vérifier
docker ps
docker network inspect web  # doit montrer securevault-backend, frontend
```

**Conteneurs créés:**
- `securevault-postgres`
- `securevault-backend`
- `securevault-frontend`

**Routes Traefik:**
- Frontend: `vault.freijstack.com`
- API: `vault-api.freijstack.com`

### 3. Déployer SecureVault STAGING (optionnel)

```bash
cd saas/securevault

# Démarrer staging
docker compose -f docker-compose.staging.yml up -d --build

# Vérifier
docker ps | grep staging
docker network inspect web  # doit montrer *-staging-*
```

**Conteneurs créés:**
- `securevault-staging-postgres`
- `securevault-staging-backend`
- `securevault-staging-frontend`

**Routes Traefik:**
- Frontend: `vault-staging.freijstack.com`
- API: `vault-api-staging.freijstack.com`

### 4. Production ET Staging Ensemble

```bash
cd saas/securevault

# Lancer les deux
docker compose up -d --build
docker compose -f docker-compose.staging.yml up -d --build

# Tous les 6 conteneurs fonctionnent
docker ps | grep securevault
```

## 📊 État du Système

### Voir tous les services

```bash
# Tous les conteneurs
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Networks}}"

# Réseau partagé
docker network inspect web

# Logs
docker logs traefik -f
docker logs securevault-backend -f
docker logs securevault-staging-backend -f
```

### Vérifier que Traefik routing correctement

```bash
# Traefik doit voir les services
docker logs traefik 2>&1 | grep -i "vault"

# Output attendu:
# Creating 0 frontend service(s) for a total of 1 service(s)
# Creating 1 router(s) for a total of 1 service(s)
```

### Tester les routes

```bash
# Production
curl -sIk https://vault.freijstack.com/
curl -sIk https://vault-api.freijstack.com/health

# Staging
curl -sIk https://vault-staging.freijstack.com/
curl -sIk https://vault-api-staging.freijstack.com/health
```

## 🔧 Maintenance

### Redémarrer Traefik (tout reste accessible)

```bash
cd /root  # ou freijstack/
docker compose restart traefik
```

Les services restent sur le réseau `web` et continuent de router.

### Redémarrer un service (ex: SecureVault production)

```bash
cd saas/securevault
docker compose restart backend
```

### Supprimer un environnement entier

**Production:**
```bash
cd saas/securevault
docker compose down -v  # -v = supprimer aussi les volumes
```

**Staging:**
```bash
cd saas/securevault
docker compose -f docker-compose.staging.yml down -v
```

### Mises à jour

```bash
# Récupérer les dernières images
docker pull traefik:v2.10
docker pull postgres:15-alpine

# Redéployer
cd /root && docker compose up -d --build
cd saas/securevault && docker compose up -d --build
```

## 🔐 Avantages de cette structure

✅ **Traefik indépendant:**
- Un seul Traefik pour tous les services
- Pas supprimé lors de `docker compose down` dans d'autres dossiers
- Gestion TLS/HTTPS centralisée

✅ **Environnements isolés:**
- Production et Staging coexistent
- Bases de données séparées
- Secrets séparés (JWT_SECRET, ENCRYPTION_KEY, etc.)

✅ **Noms clairs:**
- Aucune variable `COMPOSE_PROJECT_NAME` confuse
- Services nommés explicitement: `securevault-*`, `securevault-staging-*`
- Volumes nommés: `securevault_postgres_data`, `securevault_staging_postgres_data`

✅ **Réseau partagé `web`:**
- Traefik peut accéder à tous les services
- Communication inter-services possible
- Un seul point d'entrée (port 80, 443)

✅ **Facilité de gestion:**
- Savoir exactement où est chaque config
- Déployer/arrêter prod ou staging indépendamment
- Rollback facile

## 📝 Variables d'Environnement

### Pour `/root/docker-compose.yml`

```env
SSL_EMAIL=admin@freijstack.com
DOMAIN_NAME=freijstack.com
```

### Pour `saas/securevault/.env` (production)

```env
DB_PASSWORD=super_secure_password
JWT_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
```

### Pour `saas/securevault/.env.staging` (staging)

```env
DB_PASSWORD_STAGING=staging_password
JWT_SECRET_STAGING=$(openssl rand -hex 32)
ENCRYPTION_KEY_STAGING=$(openssl rand -hex 32)
```

## 🚨 Dépannage

### "404 Not Found" sur vault.freijstack.com

1. Vérifier que Traefik voit les services:
   ```bash
   docker logs traefik 2>&1 | grep "vault"
   ```

2. Vérifier que les conteneurs sont sur le réseau `web`:
   ```bash
   docker network inspect web | grep -A 4 "Containers"
   ```

3. Vérifier les certificats Let's Encrypt:
   ```bash
   docker exec traefik cat /letsencrypt/acme.json | jq .
   ```

### "Connection refused" sur l'API

```bash
# Vérifier que backend tourne
docker ps | grep securevault-backend

# Vérifier les logs
docker logs securevault-backend

# Vérifier CORS
docker inspect securevault-backend | jq '.Config.Labels'
```

### Port 80/443 déjà utilisé

```bash
# Voir qui utilise les ports
netstat -tlnp | grep -E ':80|:443'

# Arrêter le service concurrent
docker ps  # identifier le conteneur
docker stop <container>
```

---

**Résumé:** Structure claire, gestion facile, Traefik centralisé, prod+staging déployables indépendamment! 🎉

