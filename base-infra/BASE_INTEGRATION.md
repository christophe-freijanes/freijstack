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
└─────┬───────────────────┬────────────────┬──────┘
      │                   │                │
      ▼                   ▼                ▼
┌─────────────┐  ┌────────────────┐  ┌─────────────┐
│ Portfolio   │  │ SecureVault    │  │    n8n      │
│ (nginx)     │  │ (backend+front)│  │ (workflows) │
│             │  │                │  │             │
│ saas/       │  │ saas/          │  │ saas/n8n/   │
│ portfolio/  │  │ securevault/   │  │             │
│ docker-     │  │ securevault/   │  │ docker-     │
│ compose.yml │  │ docker-        │  │ compose.yml │
│             │  │ compose.yml    │  │             │
└─────────────┘  └────────────────┘  └─────────────┘
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
| **Traefik** | base-infra/ | web (attaché) | - |
| **Portfolio** | saas/portfolio/ | web (external) | ✅ |
| **SecureVault** | saas/securevault/ | web (external) | ✅ |
| **n8n** | saas/n8n/ | web (external) | ✅ |

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

### 2️⃣ Applications (ordre flexible)

Une fois Traefik actif, démarrer les applications :

#### Portfolio

```bash
cd saas/portfolio
cp .env.example .env
nano .env
docker-compose up -d
```

#### SecureVault

```bash
cd saas/securevault
cp .env.example .env
nano .env
docker-compose up -d
./init-db.sh
```

#### n8n

```bash
cd saas/n8n
cp .env.example .env
nano .env
docker-compose up -d
```

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
vault.freijstack.com            → VPS_IP (A record)
vault-api.freijstack.com        → VPS_IP (A record)
n8n.freijstack.com              → VPS_IP (A record)
```

### Routage Traefik

Traefik route basé sur le **hostname** :

| URL | Application | Port Interne | Compose File |
|-----|-------------|--------------|--------------|
| `portfolio.freijstack.com` | Portfolio (prod) | 80 | saas/portfolio/ |
| `portfolio-staging.freijstack.com` | Portfolio (staging) | 80 | saas/portfolio/ |
| `vault.freijstack.com` | SecureVault Frontend | 80 | saas/securevault/ |
| `vault-api.freijstack.com` | SecureVault Backend | 3001 | saas/securevault/ |
| `n8n.freijstack.com` | n8n | 5678 | saas/n8n/ |

---

## 🗂️ Volumes Docker

### Volumes par Service

```bash
# Traefik (certificats SSL)
docker volume create traefik_data

# Portfolio (pas de volume, fichiers statiques)
# Les fichiers sont dans /srv/www sur le VPS

# SecureVault
docker volume create securevault_postgres_data

# n8n
docker volume create n8n_data
```

### Backup des Volumes

```bash
# Backup traefik_data (certificats)
docker run --rm \
  -v traefik_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/traefik-backup.tar.gz -C /data .

# Backup n8n_data
docker run --rm \
  -v n8n_n8n_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/n8n-backup.tar.gz -C /data .

# Backup securevault
docker run --rm \
  -v securevault_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/securevault-db-backup.tar.gz -C /data .
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
# Logs de tous les services
docker ps --format "table {{.Names}}\t{{.Status}}"

# Logs Traefik
docker logs -f traefik

# Logs d'une app spécifique
cd saas/portfolio && docker-compose logs -f
cd saas/securevault && docker-compose logs -f
cd saas/n8n && docker-compose logs -f
```

### Health Checks

```bash
# Traefik actif?
curl http://localhost:8080/ping

# Applications (via Traefik)
curl -I https://portfolio.freijstack.com
curl -I https://vault-api.freijstack.com/health
curl -I https://n8n.freijstack.com

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

# 4. Démarrer Traefik (BASE)
cd base-infra
docker-compose up -d
docker-compose logs -f

# Attendre que Traefik soit prêt
# Vérifier: curl http://localhost:8080/ping

# 5. Démarrer Portfolio
cd ../portfolio
cp .env.example .env
nano .env  # Configurer variables
docker-compose up -d

# 6. Démarrer SecureVault
cd ../saas/securevault
cp .env.example .env
nano .env  # Configurer secrets
docker-compose up -d
./init-db.sh

# 7. Démarrer n8n
cd ../n8n
cp .env.example .env
nano .env  # Configurer clés
docker-compose up -d

# 8. Vérifier tout
docker ps
docker network inspect web
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

Chaque service a son workflow :

- `infrastructure-deploy.yml` → Valide base-infra
- `portfolio-deploy.yml` → Déploie portfolio
- `securevault-deploy.yml` → Déploie SecureVault
- `n8n-deploy.yml` → Valide n8n

### Déploiement Automatique

Push sur `master` déclenche :
1. Build & tests
2. Security scans
3. Deploy to VPS via SSH
4. Health checks

---

## 📚 Documentation par Service

| Service | Documentation |
|---------|---------------|
| **base-infra** | [README.md](README.md) |
| **Portfolio** | [../saas/portfolio/README.md](../saas/portfolio/README.md) |
| **SecureVault** | [../saas/securevault/README.md](../saas/securevault/README.md) |
| **n8n** | [../saas/n8n/README.md](../saas/n8n/README.md) |

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
