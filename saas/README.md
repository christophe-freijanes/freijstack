# Applications SaaS Démos

Exemples d'applications SaaS conteneurisées démontrant les compétences **DevSecOps**, développement backend/frontend, et déploiement automatisé.

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

## 🎯 App1: Gestionnaire de Tâches Sécurisé

Application complète de gestion de tâches avec focus sécurité.

### Caractéristiques
- **Authentification & Autorisation** - JWT, RBAC
- **API RESTful sécurisée** - Input validation, rate limiting
- **Base de données persistante** - PostgreSQL / MongoDB
- **Interface utilisateur interactive** - Frontend moderne (React/Vue)
- **Conteneurisation Docker** - Multi-stage builds, security best practices
- **Déploiement** - Kubernetes / Docker Compose ready
- **Monitoring** - Logs, métriques, health checks
- **CI/CD** - Automated testing et deployment

### Stack Technologique
- Backend: Node.js/Python + Express/FastAPI
- Frontend: React / Vue.js
- Database: PostgreSQL
- Container: Docker
- Orchestration: Kubernetes (optional)

### Lancer l'application

```bash
cd app1

# Avec Docker
docker build -t app1:latest .
docker run -p 8080:8080 \
  -e DB_HOST=postgres \
  -e JWT_SECRET=your-secret \
  app1:latest

# Avec Docker Compose
docker-compose up -d
```

### Endpoints API
```
POST   /api/auth/register        - Créer compte
POST   /api/auth/login           - Connexion
GET    /api/tasks                - Lister tâches
POST   /api/tasks                - Créer tâche
PUT    /api/tasks/{id}           - Mettre à jour
DELETE /api/tasks/{id}           - Supprimer
GET    /api/health               - Health check
```

---

## 🎯 App2: Service de Notification en Temps Réel

Microservice spécialisé en notifications avec architecture résiliente.

### Caractéristiques
- **WebSockets** - Communication bidirectionnelle en direct
- **Queue messaging** - RabbitMQ / Redis Streams pour fiabilité
- **Base de données NoSQL** - MongoDB pour stockage des notifications
- **Architecture Microservices** - Découplage, scalabilité
- **Sécurité par conception** - TLS, authentification, rate limiting
- **Déploiement automatisé** - CI/CD avec GitHub Actions / GitLab CI
- **Monitoring & Alerting** - Prometheus, Grafana, logs centralisés

### Stack Technologique
- Backend: Node.js + Socket.io
- Message Queue: RabbitMQ / Redis
- Database: MongoDB
- Monitoring: Prometheus + Grafana
- Container: Docker
- CI/CD: GitHub Actions

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
```

### WebSocket Events
```javascript
// Client connect
socket.emit('subscribe', { userId: '123' });

// Server sends notification
socket.on('notification', (data) => {
  console.log('New notification:', data);
});

// Acknowledge
socket.emit('notification:ack', { notificationId: '456' });
```

---

## 🚀 Déploiement DevSecOps

### Local Development
```bash
# Setup environnement
cp .env.example .env
docker-compose up -d

# Logs
docker-compose logs -f app1
docker-compose logs -f app2
```

### Production
```bash
# Build & push images
docker build -t myregistry/app1:v1.0 ./app1
docker push myregistry/app1:v1.0

docker build -t myregistry/app2:v1.0 ./app2
docker push myregistry/app2:v1.0

# Deploy to Kubernetes
kubectl apply -f kubernetes/app1-deployment.yaml
kubectl apply -f kubernetes/app2-deployment.yaml

# Verify
kubectl get pods
kubectl get services
```

### Security Best Practices
- ✅ Utilisateur non-root dans Dockerfile
- ✅ Scan des images (Trivy, Snyk)
- ✅ Secrets dans secret management (Vault, K8s secrets)
- ✅ Network policies pour isolation
- ✅ RBAC sur Kubernetes
- ✅ Audit logging
- ✅ Health checks et liveness probes

### Monitoring & Logging
```bash
# Prometheus scrape
curl http://app1:8080/metrics
curl http://app2:8081/metrics

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

