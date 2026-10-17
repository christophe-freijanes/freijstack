# 🏗️ Infrastructure de Base - Guide d'Intégration

Ce document explique comment l'infrastructure de base (Traefik) s'intègre avec les différentes applications du projet.

---

## 📋 Architecture Globale

```
┌─────────────────────────────────────────────────┐
│              Internet / DNS                     │
│  *.freijstack.com                               │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         Traefik (Reverse Proxy + TLS)           │
│         base-infra/docker-compose.yml           │
│  - Port 80 (HTTP → HTTPS redirect)              │
│  - Port 443 (HTTPS)                             │
│  - Let's Encrypt ACME (TLS certificates)        │
│  - Portfolio (nginx volumes /srv/www)           │
│  - n8n (automation platform)                    │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
           ┌────────────────┐
           │ SecureVault    │
           │ (backend+front)│
           │                │
           │ saas/          │
           │ securevault/   │
           │ docker-        │
           │ compose.yml    │
           │ (.env.prod/    │
           │  .env.staging) │
           └────────────────┘
```

---

## 🔌 Network Docker Partagé

Tous les services utilisent le **network Docker `web`** pour communiquer avec Traefik :

### Créer le Network

```bash
docker network create web
```

### Vérifier

```bash
docker network ls | grep web
docker network inspect web
```

### Services Connectés

| Service | Compose File | Network | Traefik Labels |
|---------|-------------|---------|----------------|
| **Traefik** | base-infra/docker-compose.yml | web (interne) | ✅ Dashboard |
| **Portfolio** | base-infra/docker-compose.yml | web (interne) | ✅ |
| **n8n** | base-infra/docker-compose.yml | web (interne) | ✅ |
| **SecureVault** | saas/securevault/docker-compose.yml | web (external) | ✅ |

---

## 🚀 Ordre de Déploiement

### 1️⃣ Base Infrastructure (Traefik)

**Toujours démarrer en premier** car c'est le reverse proxy :

```bash
cd base-infra
docker volume create traefik_data
docker-compose up -d

# Vérifier
docker-compose ps
curl http://localhost:8080/ping
```

### 2️⃣ Applications SaaS

Le portfolio et n8n sont déjà inclus dans base-infra. Il ne reste qu'à déployer SecureVault :

#### SecureVault

```bash
cd saas/securevault

# Pour production
cp .env.production .env
nano .env  # Ajouter les secrets (JWT_SECRET, ENCRYPTION_KEY, etc.)
docker compose up -d
./init-db.sh

# Pour staging
cp .env.staging .env
nano .env  # Ajouter les secrets staging
docker compose up -d
./init-db.sh
```

**Note**: Un seul `docker-compose.yml` pour les deux environnements. La différence est dans le fichier `.env` utilisé.

---

## 🔐 Configuration Traefik

### Labels Traefik

Chaque application définit ses **labels Traefik** dans son propre `docker-compose.yml` :

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.myapp.rule=Host(`myapp.freijstack.com`)
  - traefik.http.routers.myapp.entrypoints=websecure
  - traefik.http.routers.myapp.tls.certresolver=mytlschallenge
  - traefik.http.services.myapp.loadbalancer.server.port=8080
```

### TLS/SSL Automatique

Traefik gère automatiquement les certificats Let's Encrypt :

- Challenge: **TLS-ALPN-01** (port 443)
- Stockage: Volume `traefik_data` → `/letsencrypt/acme.json`
- Renouvellement: Automatique (90 jours)

---

## 📡 Routage & Domaines

### Configuration DNS

Tous les sous-domaines pointent vers **la même IP VPS** :

```
portfolio.freijstack.com        → VPS_IP (A record)
portfolio-staging.freijstack.com → VPS_IP (A record)
automation.freijstack.com       → VPS_IP (A record)
vault.freijstack.com            → VPS_IP (A record)
vault-api.freijstack.com        → VPS_IP (A record)
vault-staging.freijstack.com    → VPS_IP (A record)
vault-api-staging.freijstack.com → VPS_IP (A record)
```

### Routage Traefik

Traefik route basé sur le **hostname** :

| URL | Application | Port Interne | Compose File |
|-----|-------------|--------------|--------------|
| `portfolio.freijstack.com` | Portfolio (prod) | 80 | base-infra/ |
| `portfolio-staging.freijstack.com` | Portfolio (staging) | 80 | base-infra/ |
| `automation.freijstack.com` | n8n | 5678 | base-infra/ |
| `vault.freijstack.com` | SecureVault Frontend | 80 | saas/securevault/ |
| `vault-api.freijstack.com` | SecureVault Backend | 3001 | saas/securevault/ |
| `vault-staging.freijstack.com` | SecureVault Frontend (staging) | 80 | saas/securevault/ |
| `vault-api-staging.freijstack.com` | SecureVault Backend (staging) | 3001 | saas/securevault/ |

---

## 🗂️ Volumes Docker

### Volumes par Service

```bash
# Traefik (certificats SSL)
docker volume create traefik_data

# n8n (workflows et configuration)
docker volume create n8n_data

# Portfolio (pas de volume Docker)
# Fichiers statiques dans /srv/www/portfolio et /srv/www/portfolio-staging

# SecureVault (base de données PostgreSQL)
docker volume create securevault_postgres_data
docker volume create securevault_staging_postgres_data  # Pour staging
```

### Backup des Volumes

```bash
# Backup traefik_data (certificats SSL)
docker run --rm \
  -v traefik_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/traefik-backup.tar.gz -C /data .

# Backup n8n_data (workflows)
docker run --rm \
  -v n8n_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/n8n-backup.tar.gz -C /data .

# Backup SecureVault PostgreSQL (production)
docker run --rm \
  -v securevault_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/securevault-prod-db.tar.gz -C /data .

# Backup SecureVault PostgreSQL (staging)
docker run --rm \
  -v securevault_staging_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/securevault-staging-db.tar.gz -C /data .

# Backup Portfolio (fichiers statiques)
tar czf portfolio-backup.tar.gz -C /srv/www/portfolio .
tar czf portfolio-staging-backup.tar.gz -C /srv/www/portfolio-staging .
```

---

## 🔒 Sécurité

### Isolation

Chaque application a :
- ✅ Son propre docker-compose.yml
- ✅ Ses propres variables d'environnement (.env)
- ✅ Ses propres volumes
- ✅ Communication uniquement via network `web` avec Traefik

### Best Practices

1. **Secrets** : Toujours dans `.env`, jamais en dur
2. **Ports** : Exposer uniquement en local (127.0.0.1:port)
3. **HTTPS** : Obligatoire, géré par Traefik
4. **Headers** : Security headers configurés via Traefik labels
5. **Firewall** : Seulement ports 80, 443, 22 (SSH) ouverts sur VPS

---

## 🛠️ Maintenance

### Logs Centralisés

```bash
# Tous les containers actifs
docker ps --format "table {{.Names}}\t{{.Status}}"

# Logs infrastructure de base (Traefik, portfolio, n8n)
cd base-infra && docker compose logs -f

# Logs Traefik uniquement
docker logs -f traefik

# Logs n8n
docker logs -f n8n

# Logs Portfolio (nginx)
docker logs -f portfolio
docker logs -f portfolio-staging

# Logs SecureVault
cd saas/securevault && docker compose logs -f
```

### Health Checks

```bash
# Traefik actif?
curl http://localhost:8080/ping

# Applications (via Traefik)
curl -I https://portfolio.freijstack.com
curl -I https://automation.freijstack.com
curl https://vault-api.freijstack.com/health

# Certificats SSL
echo | openssl s_client -servername portfolio.freijstack.com \
  -connect portfolio.freijstack.com:443 2>/dev/null | \
  openssl x509 -noout -dates
```

### Mise à Jour

```bash
# Mettre à jour Traefik
cd base-infra
docker-compose pull
docker-compose up -d

# Mettre à jour une application
cd saas/portfolio
docker-compose pull
docker-compose up -d
```

---

## 🚀 Déploiement Production

### Checklist Complète

#### Prérequis
- [ ] VPS accessible via SSH
- [ ] Docker & Docker Compose installés
- [ ] DNS configurés (A records)
- [ ] Firewall configuré (ports 80, 443, 22)

#### Déploiement

```bash
# 1. Cloner le repo
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack

# 2. Créer le network Docker
docker network create web

# 3. Créer les volumes
docker volume create traefik_data
docker volume create n8n_data
docker volume create securevault_postgres_data

# 4. Préparer les répertoires Portfolio
sudo mkdir -p /srv/www/portfolio
sudo mkdir -p /srv/www/portfolio-staging
# Copier les fichiers HTML/CSS/JS du portfolio dans /srv/www/portfolio

# 5. Démarrer l'infrastructure de base (Traefik + Portfolio + n8n)
cd base-infra
docker compose up -d
docker compose logs -f

# Attendre que Traefik soit prêt (15-30 secondes)
# Vérifier: curl http://localhost:8080/ping

# 6. Démarrer SecureVault (production)
cd ../saas/securevault
cp .env.production .env
nano .env  # Ajouter JWT_SECRET, ENCRYPTION_KEY, POSTGRES_PASSWORD
docker compose up -d
./init-db.sh

# 7. Vérifier tous les containers
docker ps
docker network inspect web

# 8. Tester les URLs
curl -I https://portfolio.freijstack.com
curl -I https://automation.freijstack.com
curl https://vault-api.freijstack.com/health
```

---

## 📊 Monitoring

### Dashboard Traefik

Accessible en local uniquement (mode insecure) :

```
http://localhost:8080/dashboard/
```

Affiche :
- Services détectés
- Routeurs configurés
- Middlewares actifs
- Certificats TLS

### Prometheus & Grafana (Optionnel)

Traefik peut exposer des métriques :

```yaml
# base-infra/docker-compose.yml
command:
  - --metrics.prometheus=true
  - --metrics.prometheus.addEntryPointsLabels=true
```

---

## 🔄 CI/CD Integration

### GitHub Actions

Workflows disponibles :

- `infrastructure-deploy.yml` → Déploie base-infra (Traefik + Portfolio + n8n)
- `securevault-deploy.yml` → Déploie SecureVault (production/staging)
- `rotate-secrets.yml` → Rotation automatique des secrets SecureVault

**Architecture variabilisée** :
- Variables centralisées au niveau workflow (chemins, domaines, branches)
- Un seul docker-compose.yml par service avec templates .env
- Environnements gérés via fichiers .env.production et .env.staging

### Déploiement Automatique

Push sur `master` ou `develop` déclenche :
1. Validation & tests
2. Security scans (Gitleaks)
3. Deploy to VPS via SSH
4. Health checks avec délai de 15s
5. Verification Traefik routers

---

## 📚 Documentation par Service

| Service | Documentation |
|---------|---------------|
| **base-infra** | [README.md](README.md) |
| **Portfolio** | [../portfolio/README.md](../portfolio/README.md) |
| **SecureVault** | [../saas/securevault/README.md](../saas/securevault/README.md) |
| **Architecture** | [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) |
| **Déploiement** | [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) |
| **Troubleshooting** | [../docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) |

---

## ❓ Troubleshooting

### Traefik ne démarre pas

```bash
# Vérifier les logs
docker logs traefik

# Problèmes courants:
# - Port 80/443 déjà utilisés
# - acme.json permissions incorrectes
# - Variables d'environnement manquantes
```

### Application non accessible

```bash
# 1. Vérifier que Traefik est actif
docker ps | grep traefik

# 2. Vérifier les labels de l'application
docker inspect <container> | grep -A 10 Labels

# 3. Vérifier le network
docker network inspect web

# 4. Vérifier DNS
nslookup portfolio.freijstack.com

# 5. Vérifier certificat SSL
curl -I https://portfolio.freijstack.com
```

### Certificats SSL non générés

```bash
# Vérifier acme.json
docker exec traefik cat /letsencrypt/acme.json

# Forcer renouvellement
docker-compose restart traefik

# Vérifier les logs
docker logs traefik | grep acme
```

---

## 🔗 Ressources

- [Traefik Documentation](https://doc.traefik.io/)
- [Docker Networks](https://docs.docker.com/network/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Architecture Globale](../docs/architecture.md)

---

**Dernière mise à jour**: Décembre 2025
