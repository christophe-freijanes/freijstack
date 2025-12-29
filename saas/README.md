# Applications SaaS Démos

Exemples d'applications SaaS conteneurisées démontrant les compétences **DevSecOps**, développement backend/frontend, et déploiement automatisé.

**Status**: 🚧 En cours de développement

## 📋 Structure

```
saas/
├── securevault/
│   ├── backend/
│   ├── frontend/
│   ├── docker-compose.yml
│   ├── init-db.sh
│   └── README.md
└── README.md (ce fichier)
```

## 🎯 Objectifs

Chaque application démontre des compétences clés:
- ✅ **DevSecOps** - Security by design
- ✅ **Containerization** - Docker best practices
- ✅ **CI/CD** - GitHub Actions automation
- ✅ **Microservices** - Scalable architecture
- ✅ **Infrastructure as Code** - Terraform/Helm
- ✅ **Monitoring** - Prometheus, Grafana, Logging
- ✅ **High Availability** - Resilience, failover

## 🔐 SecureVault Manager

Application de démo centrée sur la gestion de secrets chiffrés.

### Caractéristiques
- **Chiffrement fort**: AES-256-GCM, clés dérivées avec PBKDF2
- **Authentification**: JWT + RBAC (rôles: admin, user)
- **Journalisation**: Audit logs pour toutes les opérations sensibles
- **Traefik + TLS**: Exposition sécurisée via reverse-proxy et ACME
- **PostgreSQL**: Stockage structuré des secrets et métadonnées
- **Docker Compose**: Orchestration locale et prod simplifiée
- **Sécurité**: Rate limiting, headers CSP, validation d'entrées

### Stack Technologique
- Backend: Node.js 18 + Express
- Frontend: React 18 (build servi par Nginx)
- Base de données: PostgreSQL 15
- Orchestration: Docker Compose
- Proxy: Traefik v2.10 (réseau externe `web`)

### Démarrer SecureVault

```bash
cd saas/securevault
cp .env.example .env && nano .env
docker-compose up -d --build
./init-db.sh

# Vérifications
curl https://vault-api.freijstack.com/health
curl -I https://vault.freijstack.com
```

## 🚀 Déploiement DevSecOps

### Local Development
```bash
# Cloner et setup
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack/saas/securevault

# Vérifier Docker
docker --version
docker-compose --version

# Lancer tous les services
docker-compose up -d --build

# Vérifier status
docker-compose ps
docker-compose logs -f

# Arrêter
docker-compose down
```

### Développement SecureVault
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd ../frontend
npm install
npm start

# Tests
cd ../backend && npm test
```

### Production Deployment
```bash
# Build images
docker build -t myregistry/securevault-backend:v1 ./backend
docker build -t myregistry/securevault-frontend:v1 ./frontend

# Push to registry
docker push myregistry/securevault-backend:v1
docker push myregistry/securevault-frontend:v1

# Déploiement avec Traefik (compose)
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

