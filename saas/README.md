# Applications SaaS Démos

Exemples d'applications SaaS conteneurisées démontrant les compétences **DevSecOps**, développement backend/frontend, et déploiement automatisé.

**Status**: 🚧 En cours de développement

## 📋 Structure

```
saas/
├── app1/
│   ├── Dockerfile
│   └── README.md
├── app2/
│   ├── Dockerfile
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

## 🎯 App1: Gestionnaire de Tâches Sécurisé

Application complète de gestion de tâches avec focus sécurité.

### Caractéristiques
- **Authentification & Autorisation** - JWT, RBAC, OAuth2 ready
- **API RESTful sécurisée** - Input validation, rate limiting, CORS
- **Base de données persistante** - PostgreSQL / MongoDB
- **Interface utilisateur interactive** - Frontend moderne (React/Vue)
- **Conteneurisation Docker** - Multi-stage builds, security best practices, non-root user
- **Déploiement** - Kubernetes / Docker Compose ready
- **Monitoring** - Prometheus metrics, structured logging, health checks
- **CI/CD** - Automated testing, code quality, security scans
- **Database Migrations** - Version control, rollback capability

### Stack Technologique
- **Backend**: Node.js/Python + Express/FastAPI
- **Frontend**: React / Vue.js
- **Database**: PostgreSQL (prod) / SQLite (dev)
- **Container**: Docker (multi-stage)
- **Orchestration**: Kubernetes (optional) / Docker Compose
- **Testing**: Jest / pytest, coverage > 80%
- **Linting**: ESLint, prettier, mypy

### Lancer l'application

```bash
cd app1

# Avec Docker
docker build -t app1:latest .
docker run -p 8080:8080 \
  -e DB_HOST=postgres \
  -e JWT_SECRET=your-secret \
  -e LOG_LEVEL=info \
  app1:latest

# Avec Docker Compose
docker-compose up -d app1 postgres

# Tester
curl http://localhost:8080/api/health
```

### Endpoints API
```
POST   /api/auth/register        - Créer compte (hash password + validation)
POST   /api/auth/login           - Connexion (JWT token)
GET    /api/auth/verify          - Vérifier token
GET    /api/tasks                - Lister tâches (paginated, filtered)
POST   /api/tasks                - Créer tâche (validation, audit log)
GET    /api/tasks/{id}           - Détail tâche
PUT    /api/tasks/{id}           - Mettre à jour (idempotent)
DELETE /api/tasks/{id}           - Supprimer (soft delete)
GET    /api/health               - Health check (readiness/liveness)
GET    /metrics                  - Prometheus metrics
```

### Sécurité
- ✅ Input validation (zod, pydantic)
- ✅ SQL injection prevention (prepared statements)
- ✅ Rate limiting (express-rate-limit)
- ✅ CORS configuration
- ✅ HTTPS only (in prod)
- ✅ JWT with expiration
- ✅ Password hashing (bcrypt)
- ✅ Audit logging

---

## 🎯 App2: Service de Notification en Temps Réel

Microservice spécialisé en notifications avec architecture résiliente.

### Caractéristiques
- **WebSockets** - Communication bidirectionnelle en direct avec fallback HTTP
- **Queue messaging** - RabbitMQ / Redis Streams pour fiabilité et déduplication
- **Base de données NoSQL** - MongoDB pour stockage des notifications (schémaless)
- **Architecture Microservices** - Découplage, scalabilité horizontale
- **Sécurité par conception** - TLS, authentification bearer token, rate limiting
- **Déploiement automatisé** - CI/CD avec GitHub Actions / GitLab CI
- **Monitoring & Alerting** - Prometheus, Grafana, logs centralisés (ELK)
- **High Availability** - Replicas, load balancing, graceful shutdown

### Stack Technologique
- **Backend**: Node.js + Socket.io / Python + FastAPI
- **Message Queue**: RabbitMQ / Redis Streams
- **Database**: MongoDB (replica set)
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Container**: Docker (multi-stage)
- **Orchestration**: Kubernetes / Docker Compose
- **CI/CD**: GitHub Actions

### Lancer l'application

```bash
cd app2

# Avec Docker Compose (complet)
docker-compose up -d

# Manuellement
docker build -t app2:latest .
docker run -p 8081:8081 \
  -e RABBITMQ_URL=amqp://rabbitmq:5672 \
  -e MONGODB_URL=mongodb://mongo:27017 \
  -e LOG_LEVEL=info \
  app2:latest

# Tester WebSocket
curl http://localhost:8081/api/health
```

### WebSocket Events
```javascript
// Client connect
socket.emit('subscribe', { userId: '123', channels: ['updates'] });

// Server sends notification
socket.on('notification', (data) => {
  console.log('New notification:', data);
  console.log('  - id:', data.id);
  console.log('  - message:', data.message);
  console.log('  - timestamp:', data.timestamp);
});

// Acknowledge reception
socket.emit('notification:ack', { notificationId: '456' });

// Disconnect
socket.disconnect();
```

### REST Endpoints
```
POST   /api/auth/token          - Obtenir token Bearer
POST   /api/notifications       - Créer notification
GET    /api/notifications       - Lister notifications (user)
GET    /api/health              - Health check
GET    /metrics                 - Prometheus metrics
```

### Sécurité
- ✅ Bearer token authentication
- ✅ CORS restrictif
- ✅ Rate limiting par IP/user
- ✅ Message validation (JSON schema)
- ✅ Deduplication (event ID)
- ✅ Graceful shutdown (drain connections)
- ✅ Error handling sans leak d'info sensible
- ✅ TLS en production

---

## 🚀 Déploiement DevSecOps

### Local Development
```bash
# Cloner et setup
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack/saas

# Vérifier Docker
docker --version
docker-compose --version

# Lancer tous les services
docker-compose up -d

## 🔄 Maintenance
- Ne jamais committer de secrets (`.env`, clés, certificats). Utiliser des variables d'environnement ou un vault.
- À chaque modification dans `saas/` ou ses sous-dossiers, mettre à jour les README correspondants.
- La CI inclut un contrôle de cohérence README et échouera si un dossier change sans mise à jour de son README.
- Respecter les bonnes pratiques Docker (multi-stage, utilisateur non-root, images slim).

# Vérifier status
docker-compose ps
docker-compose logs -f

# Arrêter
docker-compose down
```

### Développement d'une application
```bash
cd app1

# Installer dépendances
npm install
# ou: pip install -r requirements.txt

# Développement local
npm run dev
# ou: python -m uvicorn main:app --reload

# Tests
npm test
# ou: pytest -v

# Linting & format
npm run lint
npm run format
# ou: pylint ., black .
```

### Production Deployment
```bash
# Build images
docker build -t myregistry/app1:v1.0.0 ./app1
docker build -t myregistry/app2:v1.0.0 ./app2

# Push to registry
docker push myregistry/app1:v1.0.0
docker push myregistry/app2:v1.0.0

# Deploy to Kubernetes
kubectl apply -f kubernetes/namespaces.yaml
kubectl apply -f kubernetes/app1/
kubectl apply -f kubernetes/app2/

# Verify deployment
kubectl get deployments -n saas
kubectl get pods -n saas
kubectl get services -n saas

# Port forward for testing
kubectl port-forward -n saas svc/app1 8080:8080
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
# Prometheus scrape endpoints
curl http://app1:8080/metrics
curl http://app2:8081/metrics

# Grafana dashboards (localhost:3000)
# Username: admin / Password: admin

# Logs (ELK Stack)
# Kibana: http://localhost:5601

# Health checks
curl http://app1:8080/api/health
curl http://app2:8081/api/health
```

### CI/CD Pipeline
Le projet utilise GitHub Actions:
- **Validate**: Linting, tests
- **Build**: Docker build, push to registry
- **Security**: Trivy scan, SAST
- **Deploy**: Kubernetes rollout

```yaml
# .github/workflows/saas-deploy.yml
name: Deploy SaaS Apps
on:
  push:
    paths:
      - 'saas/app1/**'
      - 'saas/app2/**'
```

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│         Client / Browser            │
└────────────┬────────────────────────┘
             │ HTTPS
┌────────────▼────────────────────────┐
│        Load Balancer (Nginx)        │
└────────┬─────────────────┬──────────┘
         │                 │
    ┌────▼────┐      ┌────▼────┐
    │  App1   │      │  App2   │
    │ Replica │      │ Replica │
    └────┬────┘      └────┬────┘
         │                 │
    ┌────▼─────────────────▼────┐
    │  Message Queue (RabbitMQ) │
    └────┬──────────────────────┘
         │
    ┌────▼──────────┬──────────────┐
    │  PostgreSQL   │   MongoDB    │
    │   (App1 DB)   │  (App2 Logs) │
    └───────────────┴──────────────┘
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

- [Détails App1](./app1/README.md)
- [Détails App2](./app2/README.md)
- [Architecture globale](/docs/architecture.md)

---

**Créé par**: Christophe FREIJANES | **Dernière mise à jour**: Décembre 2025

