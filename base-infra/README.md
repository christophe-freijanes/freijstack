# 🏗️ Infrastructure de Base

[![Docker Compose](https://img.shields.io/badge/docker-compose-2496ED?style=flat-square&logo=docker)](./docker-compose.yml)
[![Traefik](https://img.shields.io/badge/proxy-Traefik%20v2-blue?style=flat-square&logo=traefik)](./docker-compose.yml)
[![nginx](https://img.shields.io/badge/webserver-nginx-green?style=flat-square&logo=nginx)](./docker-compose.yml)
[![n8n](https://img.shields.io/badge/automation-n8n-orange?style=flat-square&logo=n8n)](./docker-compose.yml)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](../LICENSE)

Infrastructure centralisée partagée par toutes les applications (Portfolio, SecureVault, etc.).

---

## 📋 Contenu

### Services Gérés

```
base-infra/
├── docker-compose.yml       # Configuration Traefik uniquement
├── README.md               # Ce fichier
└── BASE_INTEGRATION.md     # Guide d'intégration globale
```

### 🔧 Services Inclus

1. **Traefik v2.10**
   - Reverse proxy moderne
   - Gestion automatique SSL/TLS (Let's Encrypt)
   - Routage par hostname
   - API dashboard disponible
   - Network `web` pour communication avec toutes les apps

### 🌐 Applications Séparées

Chaque application a maintenant **sa propre configuration** :

| Application | Emplacement | Docker Compose |
|-------------|-------------|----------------|
| **Portfolio** | `saas/portfolio/` | `saas/portfolio/docker-compose.yml` |
| **SecureVault** | `saas/securevault/` | `saas/securevault/docker-compose.yml` |
| **n8n** | `saas/n8n/` | `saas/n8n/docker-compose.yml` |

**Toutes communiquent** avec Traefik via le network Docker `web`.

**Guide complet**: [BASE_INTEGRATION.md](./BASE_INTEGRATION.md)

---

## 🚀 Déploiement

### Prérequis

- Docker 20.10+
- Docker Compose v2+
- Accès SSH au VPS (pour production)
- Variables d'environnement configurées

### Variables d'Environnement

Créer un fichier `.env` à la racine ou dans `base-infra/` :

```env
# Domaine principal
DOMAIN_NAME=freijstack.com
SSL_EMAIL=your-email@example.com

# Portfolio
SUBDOMAIN_PORTFOLIO=portfolio
SUBDOMAIN_PORTFOLIO_STAGING=portfolio-staging

# n8n
SUBDOMAIN_N8N=n8n
GENERIC_TIMEZONE=Europe/Paris
```

### Démarrer Localement

```bash
cd base-infra

# Créer volumes
docker volume create traefik_data

# Créer network Docker partagé
docker network create web

# Démarrer Traefik
docker-compose up -d
```

Services accessibles :
- **Traefik Dashboard**: http://localhost:8080 (insecure mode)
- **Pour les applications**: voir [BASE_INTEGRATION.md](./BASE_INTEGRATION.md)

### En Production (VPS)

```bash
# SSH vers VPS
ssh user@your-vps.com

# Cloner le repo
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack

# Créer network Docker
docker network create web

# Démarrer Traefik
cd base-infra
docker volume create traefik_data
docker-compose up -d

# Vérifier status
docker-compose ps
docker-compose logs -f

# Démarrer les applications (voir BASE_INTEGRATION.md)
cd ../saas/portfolio && docker-compose up -d
cd ../saas/n8n && docker-compose up -d
cd ../saas/securevault && docker-compose up -d
```

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Internet / DNS                      │
└────────┬─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│        Traefik (Reverse Proxy + SSL/TLS)           │
│  Ports: 80 (redirect → 443), 443 (HTTPS)           │
└──────┬──────────────────┬──────────────────┬────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐
│   nginx (vol)   │ │     n8n      │ │   portfolio/*   │
│   /srv/www      │ │   (port 5678)│ │   (staging)     │
│ (Portfolio)     │ │              │ │                 │
└─────────────────┘ └──────────────┘ └─────────────────┘
```

---

## 🔐 Sécurité

✅ **Traefik**:
- Let's Encrypt ACME challenge (HTTP-01)
- Certificats SSL/TLS automatiques
- Redirection HTTP → HTTPS
- Security headers (HSTS, CSP, etc.)

✅ **Volumes**:
- Données persistantes dans volumes Docker
- Backups réguliers des certificats Let's Encrypt
- Isolation réseau Docker

✅ **Authentification n8n**:
- Configuration via variables d'environnement
- Tokens sécurisés pour API
- Logs d'audit des workflows

---

## 📡 Routage Traefik

### Domaines Configurés

Traefik route automatiquement basé sur les labels des applications :

| Service | URL | Géré par |
|---------|-----|----------|
| Portfolio Prod | `portfolio.freijstack.com` | saas/portfolio/docker-compose.yml |
| Portfolio Staging | `portfolio-staging.freijstack.com` | saas/portfolio/docker-compose.yml |
| SecureVault Frontend | `vault.freijstack.com` | saas/securevault/docker-compose.yml |
| SecureVault Backend | `vault-api.freijstack.com` | saas/securevault/docker-compose.yml |
| n8n | `n8n.freijstack.com` | saas/n8n/docker-compose.yml |

**Note**: Chaque application définit ses propres labels Traefik dans son docker-compose.yml

---

## 🛠️ Maintenance

### Logs & Monitoring

```bash
# Logs Traefik
docker-compose logs traefik -f

# Logs n8n
docker-compose logs n8n -f

# Logs nginx (portfolio)
docker-compose logs portfolio -f

# Status tous les services
docker-compose ps

# Vérifier santé Traefik
curl http://localhost:8080/ping
```

### Renouvellement Certificats

Les certificats Let's Encrypt sont gérés automatiquement par Traefik :

```bash
# Vérifier certificats
docker-compose exec traefik ls -la /letsencrypt/

# Forcer renouvellement (si besoin)
docker-compose restart traefik
```

### Mise à Jour

```bash
# Vérifier nouvelles versions
docker-compose pull

# Redémarrer services avec nouvelles images
docker-compose up -d
```

---

## 🔗 Ressources & Liens

- [Guide d'Intégration Complet](./BASE_INTEGRATION.md) - Architecture et déploiement
- [Portfolio](../saas/portfolio/README.md) - Application web statique
- [SecureVault Manager](../saas/securevault/README.md) - Gestionnaire de secrets
- [n8n Automation](../saas/n8n/README.md) - Plateforme d'automation
- [Traefik Documentation](https://doc.traefik.io/)

---

## 📝 Notes

- **Traefik API** (insecure mode) : accessible sur `http://localhost:8080` en local uniquement
- **Network Docker** : Le network `web` doit être créé avant de démarrer les applications
- **Volumes externes** : `traefik_data` doit être créé avant le premier démarrage
- **Certificats** : Les certificats Let's Encrypt sont stockés dans le volume `traefik_data`
- **Applications** : Chaque application a maintenant son propre docker-compose.yml
- **Déploiement** : Toujours démarrer Traefik en premier, puis les applications

---

**Créé par**: Christophe FREIJANES | **Dernière mise à jour**: Décembre 2025
