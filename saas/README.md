# Applications SaaS Démos

[![Status](https://img.shields.io/badge/status-en%20développement-yellow?style=flat-square&logo=construction)](.)
[![Docker Compose](https://img.shields.io/badge/docker-compose-2496ED?style=flat-square&logo=docker)](../base-infra/docker-compose.yml)
[![Node.js](https://img.shields.io/badge/backend-Node.js%2018-339933?style=flat-square&logo=node.js)](./securevault/backend)
[![React](https://img.shields.io/badge/frontend-React%2018-61DAFB?style=flat-square&logo=react)](./securevault/frontend)
[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL%2015-336791?style=flat-square&logo=postgresql)](./securevault)
[![n8n](https://img.shields.io/badge/automation-n8n-orange?style=flat-square&logo=n8n)](./n8n)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](../LICENSE)

Exemples d'applications web conteneurisées démontrant les compétences **DevSecOps**, développement backend/frontend, et déploiement automatisé.

## 📋 Structure

```
saas/
├── portfolio/               # 🌐 Portfolio web professionnel
│   ├── docker-compose.yml   # Config nginx + Traefik
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── README.md
├── securevault/             # 🔐 Gestionnaire de secrets
│   ├── backend/
│   ├── frontend/
│   ├── docker-compose.yml   # Config déploiement local
│   ├── init-db.sh
│   └── README.md
├── n8n/                     # 🤖 Plateforme d'automation
│   ├── docker-compose.yml
│   └── README.md
└── README.md (ce fichier)
```

## 🎯 Objectifs

Chaque application démontre des compétences clés en DevSecOps et architecture microservices:
- ✅ **DevSecOps** - Security by design, encryption, audit logs
- ✅ **Containerization** - Docker best practices, multi-stage builds
- ✅ **CI/CD** - GitHub Actions automation, automatic deployment
- ✅ **Microservices** - Scalable, decoupled architecture
- ✅ **Infrastructure as Code** - Docker Compose, configuration management
- ✅ **Monitoring** - Logging, health checks, observability
- ✅ **High Availability** - Resilience, failover, load balancing

---

## 🌐 Applications

### 1. Portfolio - Site Web Professionnel

**Site vitrine multilingue (FR/EN)** - Démontre compétences Cloud & Security / DevSecOps.

#### Caractéristiques
- **Multilingue** - FR/EN avec 150+ clés de traduction
- **Responsive** - Adapté desktop, tablet, mobile (mobile-first)
- **Thèmes saisonniers** - Changement automatique selon la saison
- **Accessibilité** - WCAG AA (contraste 4.5:1, sémantique HTML5)
- **Sécurité** - CSP headers, pas de trackers externes
- **Performance** - Assets optimisés, animations fluides

#### Stack Technologique
- Frontend: HTML5, CSS3, JavaScript natif
- Serveur: nginx:alpine
- Orchestration: Docker Compose
- Proxy: Traefik v2.10 (réseau externe `web`)

**Voir**: [portfolio/README.md](./portfolio/README.md)

### 2. SecureVault Manager

**Gestionnaire de secrets chiffrés** - Application de démonstration DevSecOps.

#### Caractéristiques
- **Chiffrement fort**: AES-256-GCM, clés dérivées avec PBKDF2
- **Authentification**: JWT + RBAC (rôles: admin, user)
- **Journalisation**: Audit logs pour toutes les opérations sensibles
- **Traefik + TLS**: Exposition sécurisée via reverse-proxy et ACME
- **PostgreSQL**: Stockage structuré des secrets et métadonnées
- **Docker Compose**: Orchestration locale et prod simplifiée
- **Sécurité**: Rate limiting, headers CSP, validation d'entrées

#### Stack Technologique
- Backend: Node.js 18 + Express
- Frontend: React 18 (build servi par Nginx)
- Base de données: PostgreSQL 15
- Orchestration: Docker Compose
- Proxy: Traefik v2.10 (réseau externe `web`)

**Voir**: [securevault/README.md](./securevault/README.md)

### 3. n8n - Plateforme d'Automation

**Plateforme d'automation & workflows** - Démontre automation sans-code et intégrations.

#### Caractéristiques
- **Visual Workflow Builder** - Interface drag-and-drop pour créer workflows
- **400+ Intégrations** - APIs, bases de données, services cloud, webhooks
- **Scheduling** - Exécution planifiée (cron, intervals, webhooks)
- **Variables & Expressions** - Logique conditionnelle avancée
- **Error Handling** - Gestion des erreurs et retry automatique
- **Credential Management** - Stockage sécurisé des credentials
- **Execution Logs** - Traçabilité complète des exécutions

#### Cas d'Usage
- **ETL** - Extract, Transform, Load de données
- **Data Sync** - Synchronisation multi-sources
- **Notifications** - Alertes Slack, Email, Teams
- **Approvals** - Workflows d'approbation multi-étapes
- **Automation** - Tâches récurrentes sans code

**Voir**: [n8n/README.md](./n8n/README.md)

---

## 🚀 Déploiement

### Déploiement Local

#### Portfolio

```bash
cd saas/portfolio
cp .env.example .env && nano .env
docker-compose up -d

# Vérifications
curl -I https://portfolio.freijstack.com
curl -I https://portfolio-staging.freijstack.com
```

#### SecureVault Manager

```bash
cd saas/securevault
cp .env.example .env && nano .env
docker-compose up -d --build
./init-db.sh

# Vérifications
curl https://vault-api.freijstack.com/health
curl -I https://vault.freijstack.com
```

#### n8n

```bash
cd saas/n8n
cp .env.example .env && nano .env
docker-compose up -d

# Vérifications
curl http://localhost:5678/health
```

### Développement

#### SecureVault
```bash
# Backend
cd saas/securevault/backend
npm install
npm run dev

# Frontend
cd ../frontend
npm install
npm start

# Tests
cd ../backend && npm test
```

#### n8n

```bash
# Workflows disponibles dans l'interface web
# http://localhost:5678
```

### Production Deployment

#### SecureVault
```bash
# Build images
docker build -t myregistry/securevault-backend:v1 ./saas/securevault/backend
docker build -t myregistry/securevault-frontend:v1 ./saas/securevault/frontend

# Push to registry
docker push myregistry/securevault-backend:v1
docker push myregistry/securevault-frontend:v1

# Déploiement avec Traefik
cd saas/securevault
docker-compose up -d --build
```

#### n8n

```bash
# Géré par base-infra/docker-compose.yml
cd base-infra
docker-compose up -d --build
```

### Security Best Practices
- ✅ **Dockerfile**: Utilisateur non-root, distroless images, minimal layers
- ✅ **Image scanning**: Trivy, Snyk détectent les vulnérabilités
- ✅ **Secrets**: Kubernetes secrets ou Vault (jamais en env vars)
- ✅ **Network policies**: Isolation par namespace, pod-to-pod communication
- ✅ **RBAC**: Service accounts avec permissions minimales
- ✅ **Audit logging**: Toutes les opérations enregistrées
- ✅ **Resource limits**: CPU/memory requests/limits configurés
- ✅ **Health checks**: Liveness et readiness probes

### Monitoring & Observability
```bash
# Health checks (local)
curl http://localhost:8080/health
curl -I http://localhost:8080

# Health checks (prod via Traefik)
curl https://vault-api.freijstack.com/health
curl -I https://vault.freijstack.com
```

### CI/CD Pipeline
Le projet utilise GitHub Actions:
- **Validate**: Linting, tests
- **Build**: Docker build, push to registry
- **Security**: Trivy scan, SAST
- **Deploy**: Kubernetes rollout

```yaml
# .github/workflows/securevault-deploy.yml
name: Deploy SecureVault
on:
     push:
          paths:
               - 'saas/securevault/**'
```

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│         Client / Browser            │
└────────────┬────────────────────────┘
             │ HTTPS
┌────────────▼────────────────────────┐
│          Traefik (TLS)              │
└────────────┬───────────────┬────────┘
             │               │
       ┌─────▼─────┐   ┌─────▼─────┐
       │ Frontend   │   │  Backend  │
       │ (Nginx)    │   │ (Express) │
       └─────┬──────┘   └─────┬─────┘
             │                │
             └────────┬───────┘
                      ▼
                 PostgreSQL
```

## 📝 Contribution

Les applications SaaS sont en développement actif. Les contributions sont bienvenues:

```bash
# Fork et clone
git clone https://github.com/votre-username/freijstack.git
cd freijstack/saas

# Créer une branche feature
git checkout -b feat/awesome-feature

# Développer et tester
npm test
docker-compose up

# Commit et push
git add .
git commit -m "feat: awesome feature"
git push origin feat/awesome-feature

# Créer une Pull Request
```

---

**Créé par**: Christophe FREIJANES  
**Dernière mise à jour**: Décembre 2025  
**Status**: 🚧 En développement  
**Contributions**: Bienvenues ✅

# ELK Stack (Elasticsearch + Kibana)
# Logs centralisés avec Filebeat / Fluentd
```

---

## 📊 Compétences Démontrées

| Domaine | Technologies |
|---------|--------------|
| **Backend** | Node.js, Express, Socket.io |
| **Frontend** | React, Vue.js |
| **Databases** | PostgreSQL, MongoDB |
| **Messaging** | RabbitMQ, Redis |
| **Containers** | Docker, Docker Compose |
| **Orchestration** | Kubernetes |
| **CI/CD** | GitHub Actions, GitLab CI |
| **Monitoring** | Prometheus, Grafana, ELK |
| **Security** | JWT, TLS, RBAC, Input validation |
| **IaC** | Terraform, Docker Compose |

---

## 🔗 Ressources

- [SecureVault Manager](./securevault/README.md)
- [Architecture globale](/docs/architecture.md)

---

**Créé par**: Christophe FREIJANES | **Dernière mise à jour**: Décembre 2025

