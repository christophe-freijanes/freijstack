# App1: Gestionnaire de Tâches Sécurisé

Application SaaS complète de gestion de tâches avec authentification sécurisée, API RESTful et interface utilisateur réactive.

## 🎯 Objectif

Démontrer les compétences DevSecOps à travers une application production-ready:
- Architecture sécurisée (JWT, RBAC)
- API RESTful bien structurée
- Containerisation Docker (security best practices)
- Déploiement automatisé (CI/CD)
- Monitoring et logging
- Gestion d'erreurs robuste

## 🏗 Architecture

```
┌─────────────────────────────────────────┐
│        Frontend (React/Vue.js)          │
│  (Single Page Application - SPA)        │
└────────────────┬────────────────────────┘
                 │ HTTP/REST
┌────────────────▼────────────────────────┐
│       Backend (Node.js / Python)        │
│  - Express / FastAPI                    │
│  - Authentication (JWT)                 │
│  - Authorization (RBAC)                 │
│  - Input validation                     │
│  - Error handling                       │
└────────────────┬────────────────────────┘
                 │ TCP
┌────────────────▼────────────────────────┐
│     Database (PostgreSQL / MongoDB)     │
│  - User accounts                        │
│  - Tasks                                │
│  - Audit logs                           │
└─────────────────────────────────────────┘
```

## 📦 Stack Technologique

### Backend
- **Runtime**: Node.js 18+ ou Python 3.9+
- **Framework**: Express.js ou FastAPI
- **Authentication**: JWT (JSON Web Tokens)
- **Database Driver**: pg (PostgreSQL) ou pymongo
- **Validation**: Joi/Zod (JS) ou Pydantic (Python)
- **Logging**: Winston/Bunyan (JS) ou Python logging
- **Testing**: Jest/Mocha (JS) ou pytest (Python)

### Frontend
- **Framework**: React 18 ou Vue.js 3
- **State Management**: Redux/Pinia
- **HTTP Client**: axios
- **UI Components**: Material-UI / Ant Design / Bootstrap
- **Styling**: CSS/SCSS ou Tailwind CSS
- **Testing**: React Testing Library / Vitest

### Database
- **PostgreSQL 13+**
  - ACID compliance
  - Scalability
  - JSON support
  - Full-text search
  
- **MongoDB 5+**
  - Document flexibility
  - Horizontal scaling
  - Aggregation pipeline

### DevOps
- **Containerization**: Docker
- **Orchestration**: Kubernetes / Docker Compose
- **CI/CD**: GitHub Actions / GitLab CI
- **Registry**: Docker Hub / ECR / Harbor
- **IaC**: Docker Compose / Terraform

## 🚀 Démarrage Rapide

### Prérequis
- Docker & Docker Compose
- Node.js 18+ (pour dev local sans Docker)
- PostgreSQL 13+ (pour dev local sans Docker)

### Option 1: Docker Compose (Recommandé)

```bash
# Cloner le repo
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack/saas/app1

# Lancer l'application complète
docker-compose up -d

# Vérifier les services
docker-compose ps

# Logs
docker-compose logs -f app
docker-compose logs -f db

# Arrêter
docker-compose down
```

**Accès**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- Health check: http://localhost:8080/health

### Option 2: Manual Setup (Dev Local)

```bash
# Backend setup
cd backend
npm install
# ou
pip install -r requirements.txt

# Créer .env
cp .env.example .env
# Éditer .env avec vos paramètres

# Lancer le serveur
npm run dev
# ou
python app.py

# Serveur disponible sur http://localhost:8080
```

```bash
# Frontend setup
cd frontend
npm install

# Lancer le dev server
npm start

# App disponible sur http://localhost:3000
```

## 📚 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response 201:
{
  "id": "user-123",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

### Tasks

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer {token}

Response 200:
[
  {
    "id": "task-1",
    "title": "Complete project",
    "description": "Finish the DevSecOps project",
    "status": "in_progress",
    "priority": "high",
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-02T15:30:00Z"
  }
]
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New task",
  "description": "Task description",
  "priority": "medium"
}

Response 201:
{
  "id": "task-new",
  "title": "New task",
  ...
}
```

#### Update Task
```http
PUT /api/tasks/{taskId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "status": "completed"
}

Response 200:
{
  "id": "task-1",
  "title": "Updated title",
  ...
}
```

#### Delete Task
```http
DELETE /api/tasks/{taskId}
Authorization: Bearer {token}

Response 204 No Content
```

### System

#### Health Check
```http
GET /health

Response 200:
{
  "status": "healthy",
  "timestamp": "2025-01-02T16:00:00Z",
  "uptime": 3600
}
```

#### Metrics (Prometheus)
```http
GET /metrics

Response 200:
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 1234
...
```

## 🔒 Sécurité

### Best Practices Implémentées

- ✅ **JWT Authentication** - Stateless, secure token-based auth
- ✅ **Password Hashing** - bcrypt avec salt (10+ rounds)
- ✅ **HTTPS/TLS** - Chiffrement en transit
- ✅ **CORS** - Configuration restrictive
- ✅ **Input Validation** - Sanitization & validation complète
- ✅ **Rate Limiting** - Protection contre les abus
- ✅ **RBAC** - Role-Based Access Control
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **XSS Protection** - Content Security Policy headers
- ✅ **Secrets Management** - Environment variables, vault
- ✅ **Logging & Audit** - Tous les accès enregistrés
- ✅ **OWASP Compliance** - Top 10 mitigation

### Headers Sécurité

```javascript
// Exemple (Express.js)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## 📊 Monitoring

### Logs
```bash
# Afficher les logs de l'app
docker-compose logs app

# Afficher les logs de la DB
docker-compose logs db

# Suivi en temps réel
docker-compose logs -f app
```

### Metrics (Prometheus)
```bash
# Accédez à http://localhost:9090
# Requête exemple: rate(http_requests_total[5m])
```

### Tracing (Jaeger - Optional)
```bash
# Accédez à http://localhost:16686
# Visualisez les traces des requêtes
```

## 🧪 Tests

### Test d'intégration
```bash
# Backend
npm run test
# ou
pytest tests/

# With coverage
npm run test:coverage
# ou
pytest --cov tests/
```

### Test de performance
```bash
# Load testing avec Apache Bench
ab -n 1000 -c 100 http://localhost:8080/api/tasks

# ou avec wrk
wrk -t4 -c100 -d30s http://localhost:8080/api/tasks
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Exemple)
```yaml
# .github/workflows/deploy.yml
name: Deploy App1

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
        run: docker build -t app1:latest .
      - name: Push to registry
        run: docker push myregistry/app1:latest
      - name: Deploy to K8s
        run: kubectl apply -f kubernetes/deployment.yaml
```

## 📁 Structure des Répertoires

```
app1/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── app.js
│   ├── tests/
│   ├── docker/
│   │   └── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── public/
│   ├── docker/
│   │   └── Dockerfile
│   ├── package.json
│   └── README.md
├── docker-compose.yml
├── Dockerfile (multi-stage)
├── kubernetes/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
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

Pour questions ou issues, veuillez consulter la [documentation](./README.md) ou créer une issue.

---

**Créé par**: Christophe FREIJANES | **Licence**: MIT | **Dernière mise à jour**: Décembre 2025
