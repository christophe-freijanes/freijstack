# 🏗️ Infrastructure de Base

[![Docker Compose](https://img.shields.io/badge/docker-compose-2496ED?style=flat-square&logo=docker)](./docker-compose.yml)
[![Traefik](https://img.shields.io/badge/proxy-Traefik%20v2.10-blue?style=flat-square&logo=traefik)](./docker-compose.yml)
[![nginx](https://img.shields.io/badge/webserver-nginx:alpine-green?style=flat-square&logo=nginx)](./docker-compose.yml)
[![n8n](https://img.shields.io/badge/automation-n8n%20latest-orange?style=flat-square&logo=n8n)](./docker-compose.yml)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](../LICENSE)

---

## 📋 Vue d'ensemble

**Infrastructure centralisée** et partagée par toutes les applications SaaS (Portfolio, SecureVault, Docker Registry, etc.).

Gère le reverse proxy, l'automation, et les services web statiques avec SSL/TLS automatique, santé checks, et monitoring.

---

## 📦 Services Inclus

### 🔄 Traefik v2.10 (Reverse Proxy)

Reverse proxy moderne avec gestion SSL/TLS automatique et routage intelligent.

```yaml
Ports:
  80 (HTTP) → Redirect 301 vers HTTPS
  443 (HTTPS) → TLS 1.3
  8080 (API) → Dashboard (insecure mode, localhost only)
```

**Fonctionnalités**:
- ✅ Certificats Let's Encrypt (ACME HTTP-01)
- ✅ Renouvellement automatique
- ✅ Routage par hostname (virtualhosts)
- ✅ Middleware de sécurité (HSTS, CSP, etc.)
- ✅ Health checks intégrés
- ✅ Dashboard web
- ✅ Métriques Prometheus

**Network**: `web` (partagé avec toutes les apps)

---

### 🤖 n8n (Automation Platform)

Plateforme no-code/low-code d'automation et de workflows.

```
Domain: automation.freijstack.com (ou n8n.freijstack.com)
Port (local): 5678
Volume: n8n_data (persistant)
```

**Fonctionnalités**:
- 📦 400+ intégrations natives
- 🎯 Visual workflow builder
- ⏰ Scheduling & webhooks
- 📊 Data transformation
- 🔐 Credential management
- 📈 Audit logs

**Démarrage**:
```bash
# Via docker-compose ci-dessous
# Accessible sur: https://n8n.freijstack.com
```

---

### 📁 Portfolio (nginx:alpine)

Serveur web statique pour le portfolio avec support multi-environnement.

```
Production:  portfolio.freijstack.com
Staging:     portfolio-staging.freijstack.com
Port (local): 80
Volume:      /srv/www/ (servi par nginx)
```

**Fichiers servis**:
- `index.html` - Page principale
- `style.css` - Styles
- `script.js` - Logique client
- `public/` - Assets (images, favicons, etc.)

---

## 🚀 Démarrage Rapide

### Prérequis

- Docker 20.10+
- Docker Compose v2+
- 1GB RAM minimum
- Accès aux ports 80 et 443

### 1. Cloner & Configurer

```bash
cd base-infra

# Créer le fichier .env
cp .env.example .env
nano .env

# Variables essentielles:
DOMAIN_NAME=freijstack.com           # Votre domaine
SSL_EMAIL=your-email@example.com     # Email Let's Encrypt
SUBDOMAIN_PORTFOLIO=portfolio
SUBDOMAIN_PORTFOLIO_STAGING=portfolio-staging
SUBDOMAIN_N8N=n8n
GENERIC_TIMEZONE=Europe/Paris
```

### 2. Créer les Volumes & Networks

```bash
# Créer volume pour Traefik (certificats)
docker volume create traefik_data

# Créer volume pour n8n
docker volume create n8n_data

# Créer network Docker partagé
docker network create web
```

### 3. Démarrer les Services

```bash
# Démarrer tous les services
docker compose up -d

# Vérifier le statut
docker compose ps

# Vérifier les logs
docker compose logs -f
```

### 4. Accès Services

```
✅ Traefik Dashboard:    http://localhost:8080  (insecure mode)
✅ n8n:                  https://n8n.freijstack.com
✅ Portfolio:            https://portfolio.freijstack.com
✅ Portfolio Staging:    https://portfolio-staging.freijstack.com
```

---

## 🏛️ Configuration Docker Compose

### Services

```yaml
services:
  traefik:           # Reverse proxy + SSL
  n8n:               # Automation platform
  portfolio:         # Web server statique
```

### Volumes

```yaml
volumes:
  traefik_data:      # Certificats Let's Encrypt (persistant)
  n8n_data:          # Données n8n (persistant)
  /srv/www/:         # Portfolio files (bind mount)
```

### Networks

```yaml
networks:
  web:               # Partagé avec toutes les applications
```

---

## 📊 Architecture

```
┌──────────────────────────────────────────┐
│          Internet / DNS                  │
│   portfolio.freijstack.com              │
│   n8n.freijstack.com                    │
│   automation.freijstack.com             │
└────────────┬─────────────────────────────┘
             │
             ▼
     ┌───────────────┐
     │  Traefik v2   │
     │ (Port 80/443) │
     └───────┬───────┘
             │
    ┌────────┼────────┬────────┐
    │        │        │        │
    ▼        ▼        ▼        ▼
  ┌───┐  ┌─────┐  ┌────┐  ┌──────┐
  │n8n│  │Port.│  │Port.│  │Other │
  │   │  │Prod │  │Stage│  │Apps  │
  └───┘  └─────┘  └────┘  └──────┘
```

---

## 🔐 Sécurité

### TLS/HTTPS

✅ Certificats Let's Encrypt automatiques  
✅ Renouvellement 30 jours avant expiration  
✅ Redirection HTTP → HTTPS (301)  
✅ TLS 1.3 uniquement (no TLS 1.0/1.1/1.2)  
✅ Ciphers modernes (ECDHE, ChaCha20)  

### Headers Sécurité

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: (appliqué par apps)
```

### Network Docker

✅ Services isolés (network `web`)  
✅ Pas d'exposition de ports internes  
✅ Communication par DNS Docker  

---

## 🛠️ Maintenance & Monitoring

### Logs en Temps Réel

```bash
# Tous les logs
docker compose logs -f

# Traefik uniquement
docker compose logs -f traefik

# n8n uniquement
docker compose logs -f n8n

# Portfolio uniquement
docker compose logs -f portfolio
```

### Statut Services

```bash
# Vérifier tous les containers
docker compose ps

# Vérifier santé Traefik
curl -v http://localhost:8080/ping
# Réponse: OK (code 200)

# Vérifier santé n8n
curl https://n8n.freijstack.com/health
# Réponse: {"status": "ok"}

# Vérifier Portfolio
curl -I https://portfolio.freijstack.com
# Réponse: HTTP/2 200
```

### Redémarrage Services

```bash
# Redémarrer un service
docker compose restart traefik
docker compose restart n8n
docker compose restart portfolio

# Redémarrer tous les services
docker compose restart

# Redémarrer avec rebuild (si changements images)
docker compose up -d --build
```

### Certificats Let's Encrypt

```bash
# Lister certificats
docker compose exec traefik ls -la /letsencrypt/

# Vérifier expiration
docker compose exec traefik openssl x509 -in /letsencrypt/acme.json -text -noout | grep -A2 "Validity"

# Forcer renouvellement
docker compose restart traefik
```

### Mises à Jour Images

```bash
# Vérifier nouvelles versions
docker compose pull

# Appliquer (redémarrage auto)
docker compose up -d

# Supprimer anciennes images
docker image prune -f
```

---

## 🔧 Configuration Avancée

### Variables d'Environnement Complètes

```env
# Domaine & Email
DOMAIN_NAME=freijstack.com
SSL_EMAIL=admin@freijstack.com

# Portfolio subdomains
SUBDOMAIN_PORTFOLIO=portfolio
SUBDOMAIN_PORTFOLIO_STAGING=portfolio-staging

# n8n
SUBDOMAIN_N8N=n8n
GENERIC_TIMEZONE=Europe/Paris
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secure_password

# Traefik (optionnel)
TRAEFIK_DASHBOARD_USER=traefik
TRAEFIK_DASHBOARD_PASSWORD=secure_password
```

### Ajouter une Nouvelle Application

Pour ajouter une nouvelle app (ex: Docker Registry, Redis, etc.):

1. **Créer docker-compose.yml** dans le dossier app:
   ```yaml
   version: '3.8'
   services:
     app:
       image: app:latest
       networks:
         - web
       labels:
         - traefik.enable=true
         - traefik.http.routers.app.rule=Host(`app.freijstack.com`)
         - traefik.http.routers.app.entrypoints=websecure
         - traefik.http.routers.app.tls.certresolver=letsencrypt
         - traefik.http.services.app.loadbalancer.server.port=3000
   
   networks:
     web:
       external: true
   ```

2. **Démarrer l'app**:
   ```bash
   cd ../saas/app
   docker compose up -d
   ```

3. **Traefik routera automatiquement** vers l'app via labels

---

## 🐳 Intégration Applications

Voir **[BASE_INTEGRATION.md](./BASE_INTEGRATION.md)** pour :
- Guide complet d'intégration des services
- Architecture détaillée de communication
- Déploiement en production
- Troubleshooting

---

## 📚 Documentation Complète

- **Architecture Générale**: [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- **CI/CD Pipeline**: [../docs/CI_CD_ARCHITECTURE.md](../docs/CI_CD_ARCHITECTURE.md)
- **Guide Déploiement**: [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)
- **Monitoring**: [../docs/MONITORING.md](../docs/MONITORING.md)
- **Troubleshooting**: [../docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md)
- **SaaS Apps**: [../saas/README.md](../saas/README.md)

---

## 🔗 Ressources

- [Traefik v2.10 Docs](https://doc.traefik.io/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Docker Compose](https://docs.docker.com/compose/)
- [n8n Documentation](https://docs.n8n.io/)

---

**Créé par**: Christophe FREIJANES  
**Dernière mise à jour**: Janvier 2026  
**Version**: 1.0.0


