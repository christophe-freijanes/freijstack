# App2: Service de Notification en Temps Réel

Microservice spécialisé en notifications avec architecture event-driven, WebSockets pour la communication en direct, et message queuing pour la fiabilité.

## 🎯 Objectif

Démontrer les compétences DevSecOps à travers une architecture microservices moderne:
- Communication WebSocket en temps réel
- Message queue (RabbitMQ/Redis) pour découplage
- Architecture event-driven & scalable
- Microservices patterns (circuit breaker, retry)
- Monitoring distribué
- Déploiement Kubernetes

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│         (WebSocket client connection)                    │
└──────────────────────┬─────────────────────────────────┘
                       │ WebSocket
┌──────────────────────▼─────────────────────────────────┐
│           Notification Service (Node.js)               │
│  - WebSocket server (Socket.io)                        │
│  - Event handlers                                      │
│  - Subscription management                            │
└──────────────┬────────────────────────────┬────────────┘
               │ Consume                    │ Consume
┌──────────────▼──────────────────────┐ ┌──▼────────────────┐
│   Message Queue (RabbitMQ/Redis)    │ │ Cache (Redis)     │
│   - Notification events             │ │ - User sessions   │
│   - Delivery queue                  │ │ - Notification ID │
└──────────────┬──────────────────────┘ └──┬────────────────┘
               │ Store
               ▼
┌──────────────────────────────────────────┐
│    Database (MongoDB)                    │
│  - Notifications collection              │
│  - User subscriptions                    │
│  - Delivery logs                         │
│  - Audit trail                           │
└──────────────────────────────────────────┘
```

## 📦 Stack Technologique

### Backend
- **Runtime**: Node.js 18+ avec TypeScript
- **WebSocket**: Socket.io pour communication bidirectionnelle
- **Message Queue**: RabbitMQ 3.8+ ou Redis 6+
- **Framework**: Express.js ou Fastify
- **Database Driver**: MongoDB driver / Mongoose
- **Validation**: Joi / Zod
- **Logging**: Winston / Bunyan
- **Monitoring**: Prometheus client
- **Testing**: Jest / Mocha

### Infrastructure
- **Container**: Docker
- **Orchestration**: Kubernetes
- **Service Mesh**: Istio (optional)
- **Message Queue**: RabbitMQ / Redis
- **Database**: MongoDB
- **Monitoring**: Prometheus + Grafana
- **Tracing**: Jaeger / Zipkin
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

### DevOps
- **IaC**: Kubernetes manifests / Helm
- **CI/CD**: GitHub Actions / GitLab CI
- **Registry**: Docker Hub / ECR / Harbor
- **GitOps**: ArgoCD (optional)

## 🚀 Démarrage Rapide

### Prérequis
- Docker & Docker Compose
- Node.js 18+ (pour dev local)
- MongoDB 5+
- RabbitMQ 3.8+ ou Redis 6+

### Option 1: Docker Compose (Recommandé)

```bash
# Cloner le repo
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack/saas/app2

# Lancer tous les services
docker-compose up -d

# Vérifier les services
docker-compose ps

# Logs
docker-compose logs -f notification-service

# Arrêter
docker-compose down
```

**Services disponibles**:
- Notification Service: http://localhost:8081
- RabbitMQ Admin: http://localhost:15672 (user/pass: guest/guest)
- MongoDB Express: http://localhost:8081/mongodb (optional)
- Prometheus: http://localhost:9090

### Option 2: Dev Local

```bash
# Installer les dépendances
npm install

# Créer .env
cp .env.example .env

# Variables requises:
# MONGODB_URL=mongodb://localhost:27017/notifications
# RABBITMQ_URL=amqp://guest:guest@localhost:5672
# JWT_SECRET=your-secret
# NODE_ENV=development

# Lancer le service
npm run dev

# Service disponible sur http://localhost:8081
# WebSocket disponible sur ws://localhost:8081
```

## 📡 WebSocket Events

### Connexion Client

```javascript
// Frontend (React)
import io from 'socket.io-client';

const socket = io('http://localhost:8081', {
  auth: {
    token: 'jwt-token'
  }
});

// Événement de connexion
socket.on('connect', () => {
  console.log('Connected to notification service');
});

// S'abonner aux notifications
socket.emit('subscribe', { userId: 'user-123' });

// Recevoir une notification
socket.on('notification', (data) => {
  console.log('Nouvelle notification:', data);
  // {
  //   id: 'notif-abc',
  //   type: 'task_assigned',
  //   message: 'Task assigned to you',
  //   data: { taskId: '123', taskTitle: '...' },
  //   timestamp: '2025-01-02T16:00:00Z'
  // }
});

// Acquitter une notification
socket.emit('notification:acknowledge', { notificationId: 'notif-abc' });

// Déconnexion
socket.on('disconnect', () => {
  console.log('Disconnected from notification service');
});
```

### Événements Disponibles

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `connect` | Server → Client | Client connecté |
| `disconnect` | Server → Client | Client déconnecté |
| `subscribe` | Client → Server | S'abonner aux notifications |
| `unsubscribe` | Client → Server | Se désabonner |
| `notification` | Server → Client | Nouvelle notification reçue |
| `notification:acknowledge` | Client → Server | Marquer comme lue |
| `notification:read` | Server → Client | Confirmation de lecture |
| `error` | Server → Client | Erreur WebSocket |

## 📨 API REST

### Créer une notification

```http
POST /api/notifications
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user-123",
  "type": "task_assigned",
  "title": "Nouvelle tâche assignée",
  "message": "Vous avez reçu une nouvelle tâche",
  "data": {
    "taskId": "task-456",
    "taskTitle": "Implement feature X"
  },
  "priority": "high"
}

Response 201:
{
  "id": "notif-xyz",
  "userId": "user-123",
  "status": "sent",
  "createdAt": "2025-01-02T16:00:00Z"
}
```

### Récupérer les notifications

```http
GET /api/notifications
Authorization: Bearer {token}

Response 200:
[
  {
    "id": "notif-xyz",
    "userId": "user-123",
    "type": "task_assigned",
    "title": "Nouvelle tâche assignée",
    "message": "Vous avez reçu une nouvelle tâche",
    "status": "unread",
    "createdAt": "2025-01-02T16:00:00Z"
  }
]
```

### Marquer comme lue

```http
PUT /api/notifications/{notificationId}/read
Authorization: Bearer {token}

Response 200:
{
  "id": "notif-xyz",
  "status": "read",
  "readAt": "2025-01-02T16:05:00Z"
}
```

### Santé du service

```http
GET /health

Response 200:
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "rabbitmq": "connected",
    "redis": "connected"
  },
  "uptime": 3600
}
```

## 🔒 Sécurité

### Best Practices

- ✅ **JWT Authentication** - Validation de token pour WebSocket
- ✅ **Input Validation** - Sanitization complète
- ✅ **Rate Limiting** - Protection des endpoints
- ✅ **CORS Configuration** - Whitelist des origins
- ✅ **TLS/HTTPS** - Chiffrement en transit
- ✅ **Database Encryption** - MongoDB field-level encryption
- ✅ **Secret Management** - Environment variables
- ✅ **Audit Logging** - Tous les événements enregistrés
- ✅ **DDoS Protection** - Rate limiting & WAF
- ✅ **Message Signing** - Intégrité des messages

### Headers Sécurité

```javascript
// Middleware Express
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
```

## 📊 Monitoring & Observabilité

### Prometheus Metrics

```bash
# Accés: http://localhost:9090

# Requêtes exemple:
rate(notifications_sent_total[5m])
notifications_queue_length
websocket_connections_active
mongodb_command_duration_seconds
```

### Logging (ELK Stack)

```bash
# Kibana: http://localhost:5601
# Index: notification-service-*
# Logs: JSON structurés avec timestamp, level, message, context
```

### Tracing (Jaeger)

```bash
# Jaeger UI: http://localhost:16686
# Visualisez les traces distribuées
# Correlation IDs pour tracking request-to-response
```

## 🧪 Tests

### Unit Tests
```bash
npm run test:unit
# Tests des handlers, validations, utils
```

### Integration Tests
```bash
npm run test:integration
# Tests WebSocket, database, message queue
```

### Load Tests
```bash
npm run test:load
# Artillery ou k6
# Simule 100+ WebSocket connections
# Teste la scalabilité
```

### Coverage
```bash
npm run test:coverage
# Cible: 80%+ coverage
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy App2

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      - name: Build Docker image
        run: docker build -t app2:latest .
      - name: Push to registry
        run: docker push myregistry/app2:latest
      - name: Deploy to K8s
        run: kubectl apply -f kubernetes/deployment.yaml
```

## ☸ Déploiement Kubernetes

### ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app2-config
data:
  NODE_ENV: production
  LOG_LEVEL: info
```

### Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app2-secrets
type: Opaque
stringData:
  JWT_SECRET: your-secret
  MONGODB_URL: mongodb://mongodb:27017/notifications
  RABBITMQ_URL: amqp://rabbitmq:5672
```

### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: notification-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: notification-service
  template:
    metadata:
      labels:
        app: notification-service
    spec:
      containers:
      - name: app
        image: myregistry/app2:latest
        ports:
        - containerPort: 8081
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: app2-config
              key: NODE_ENV
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app2-secrets
              key: JWT_SECRET
        livenessProbe:
          httpGet:
            path: /health
            port: 8081
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8081
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: notification-service
spec:
  type: LoadBalancer
  selector:
    app: notification-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8081
```

## 📁 Structure des Répertoires

```
app2/
├── src/
│   ├── controllers/
│   │   ├── notificationController.ts
│   │   └── healthController.ts
│   ├── services/
│   │   ├── notificationService.ts
│   │   ├── websocketService.ts
│   │   ├── messageQueueService.ts
│   │   └── databaseService.ts
│   ├── models/
│   │   └── notification.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── metrics.ts
│   │   └── validators.ts
│   ├── config/
│   │   └── config.ts
│   └── app.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── load/
├── kubernetes/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── secret.yaml
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── package.json
└── README.md (ce fichier)
```

## 🤝 Contribution

Pour contribuer:
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour questions ou issues, veuillez consulter la [documentation](../README.md) ou créer une issue.

---

**Créé par**: Christophe FREIJANES | **Licence**: MIT | **Dernière mise à jour**: Décembre 2025
