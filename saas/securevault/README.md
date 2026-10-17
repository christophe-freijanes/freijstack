# 🔐 SecureVault Manager

[![Docker](https://img.shields.io/badge/docker-compose-2496ED?style=flat-square&logo=docker)](./docker-compose.yml)
[![Backend](https://img.shields.io/badge/backend-Node.js%2018-339933?style=flat-square&logo=node.js)](./backend)
[![Frontend](https://img.shields.io/badge/frontend-React%2018-61DAFB?style=flat-square&logo=react)](./frontend)
[![Database](https://img.shields.io/badge/database-PostgreSQL%2015-336791?style=flat-square&logo=postgresql)](./docker-compose.yml)
[![Encryption](https://img.shields.io/badge/encryption-AES--256--GCM-blue?style=flat-square&logo=security)](./backend/src/utils/crypto.js)
[![Authentication](https://img.shields.io/badge/auth-JWT%2BRBAC-green?style=flat-square&logo=jwt)](./backend/src/middleware/auth.js)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](../../LICENSE)

**Gestionnaire de secrets sécurisé** avec chiffrement AES-256-GCM, authentification JWT, et audit complet.

Application SaaS de démonstration pour le portfolio DevSecOps de **Christophe FREIJANES**.

---

## 🎯 Fonctionnalités

### Sécurité
- ✅ **Chiffrement AES-256-GCM** - Secrets chiffrés en base avec IV et auth tag uniques
- ✅ **Authentication JWT** - Tokens sécurisés avec expiration
- ✅ **Bcrypt hashing** - Passwords hashés avec 12 rounds
- ✅ **RBAC** - Role-Based Access Control (user/admin)
- ✅ **Rate Limiting** - Protection contre brute-force (100 req/15min)
- ✅ **Audit Logs** - Traçabilité complète de toutes les actions
- ✅ **HTTPS/TLS** - Certificats Let's Encrypt via Traefik
- ✅ **Security Headers** - Helmet.js (CSP, XSS, CSRF protection)

### Fonctionnalités Utilisateur
- 🔑 Créer, lire, modifier, supprimer des secrets
- 📝 Description optionnelle pour chaque secret
- ⏰ Expiration automatique des secrets (optionnel)
- 📊 Dashboard avec liste des secrets
- 📜 Journal d'audit personnel
- 🔍 Recherche et filtrage

### Stack Technique

**Backend**:
- Node.js 18 + Express.js
- PostgreSQL 15
- JWT (jsonwebtoken)
- Bcrypt
- Crypto (Node.js native - AES-256-GCM)
- Helmet, CORS, Rate Limiting

**Frontend**:
- React 18
- React Router v6
- Axios
- Lucide Icons
- CSS3 (responsive design)

**Infrastructure**:
- Docker + Docker Compose
- Traefik v2 (reverse proxy + SSL)
- Multi-stage Docker builds
- Health checks

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         React Frontend (SPA)                │
│  - Login/Register                           │
│  - Secrets CRUD                             │
│  - Audit Logs Viewer                        │
│  nginx:alpine (port 80)                     │
└──────────────┬──────────────────────────────┘
               │ HTTPS (Traefik)
               ▼
┌─────────────────────────────────────────────┐
│       Express.js Backend API                │
│  - JWT Authentication                       │
│  - AES-256-GCM Encryption                   │
│  - RBAC Middleware                          │
│  - Audit Logging                            │
│  Node.js 18 (port 3001)                     │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│      PostgreSQL 15 Database                 │
│  - users (bcrypt passwords)                 │
│  - secrets (encrypted_value, iv, auth_tag)  │
│  - audit_logs (action, timestamp, IP)       │
└─────────────────────────────────────────────┘
```

### Flux de Chiffrement

```
1. User Input (secret value)
   ↓
2. Backend: AES-256-GCM Encrypt
   - Generate random IV (16 bytes)
   - Encrypt with ENCRYPTION_KEY
   - Generate auth tag
   ↓
3. Store in PostgreSQL:
   {
     encrypted_value: "hex",
     iv: "hex",
     auth_tag: "hex"
   }
   ↓
4. On Read: Decrypt with IV + auth_tag
   ↓
5. Return plaintext to user
```

---

## 🚀 Installation & Déploiement

### Prérequis

- Docker 20.10+
- Docker Compose v2+
- Traefik configuré (voir [base-infra](../../base-infra/README.md))
- DNS configuré pour sous-domaines:
  - `vault.freijstack.com` → Frontend
  - `vault-api.freijstack.com` → Backend API

### 1. Cloner et Configurer

```bash
cd /srv/docker
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack/saas/securevault
```

### 2. Générer Secrets

```bash
# JWT Secret (32 bytes = 64 hex chars)
openssl rand -hex 32

# Encryption Key (32 bytes = 64 hex chars)
openssl rand -hex 32

# Database Password
openssl rand -base64 24
```

### 3. Créer .env

Le projet utilise un **système d'environnement variabilisé** avec des fichiers `.env` spécifiques:

**Fichiers disponibles**:
- `.env.example` - Template avec documentation complète
- `.env.production` - Configuration production (vault.freijstack.com)
- `.env.staging` - Configuration staging (vault-staging.freijstack.com)

**Pour développement local**:
```bash
cp .env.example .env
nano .env
```

**Pour déploiement sur VPS** (requis):
```bash
# Pour production
nano /srv/www/securevault/.env

# Pour staging
nano /srv/www/securevault-staging/.env
```

**Contenu minimal .env** (secrets critiques à ajouter):
```env
# Générer avec: openssl rand -hex 32
POSTGRES_PASSWORD=<YOUR_SECURE_DB_PASSWORD_HERE>
JWT_SECRET=<YOUR_JWT_SECRET_32_BYTES_HEX_HERE>
ENCRYPTION_KEY=<YOUR_ENCRYPTION_KEY_32_BYTES_HEX_HERE>
```

⚠️ **IMPORTANT**: 
- Les templates `.env.production` et `.env.staging` sont **versionnés** (sans secrets)
- Les secrets réels sont dans `/srv/www/securevault/.env` sur le VPS (non versionnés)
- CI/CD injecte automatiquement les secrets du VPS dans les containers

**Architecture de déploiement**:
```
1. GitHub Actions copie .env.production ou .env.staging (depuis le repo)
2. Script injecte les secrets depuis /srv/www/securevault/.env (VPS)
3. docker compose up utilise le .env fusionné
4. Un seul docker-compose.yml pour les deux environnements ✨
```

### 4. Lancer l'Application

```bash
# Build et démarrage
docker-compose up -d --build

# Vérifier containers
docker-compose ps

# Vérifier logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 5. Initialiser Base de Données

```bash
# Rendre le script exécutable
chmod +x init-db.sh

# Exécuter
./init-db.sh
```

### 6. Vérifier Déploiement

```bash
# Health check backend
curl https://vault-api.freijstack.com/health

# Réponse attendue:
# {"status":"healthy","timestamp":"2025-12-28T...","service":"securevault-backend","version":"1.0.0"}

# Frontend accessible
curl -I https://vault.freijstack.com
# HTTP/2 200
```

---

## 🔧 Configuration DNS

Ajouter ces enregistrements DNS chez votre registrar :

```
Type    Nom                   Valeur
A       vault                 IP_VPS (ex: 51.178.42.69)
A       vault-api             IP_VPS (ex: 51.178.42.69)
```

Vérifier propagation :
```bash
dig vault.freijstack.com +short
dig vault-api.freijstack.com +short
```

---

## 📊 API Endpoints

### Authentication

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/auth/register` | Créer un compte | ❌ |
| POST | `/api/auth/login` | Se connecter | ❌ |

**Exemple Register**:
```bash
curl -X POST https://vault-api.freijstack.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecureP@ss123"
  }'
```

**Exemple Login**:
```bash
curl -X POST https://vault-api.freijstack.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecureP@ss123"
  }'

# Réponse:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...[base64_encoded_jwt]",
#   "user": {"id": 1, "username": "johndoe", ...}
# }
```

> ⚠️ **Note**: Le token JWT ci-dessus est un exemple. Les vrais tokens sont générés dynamiquement.

### Secrets Management

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/secrets` | Liste des secrets | ✅ JWT |
| GET | `/api/secrets/:id` | Détail secret (déchiffré) | ✅ JWT |
| POST | `/api/secrets` | Créer secret | ✅ JWT |
| PUT | `/api/secrets/:id` | Modifier secret | ✅ JWT |
| DELETE | `/api/secrets/:id` | Supprimer secret | ✅ JWT |

**Exemple Create Secret**:
```bash
TOKEN="your_jwt_token_here"

curl -X POST https://vault-api.freijstack.com/api/secrets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "aws-api-key",
    "value": "AKIAIOSFODNN7EXAMPLE",
    "description": "Clé API AWS Production",
    "expires_at": "2026-12-31T23:59:59Z"
  }'
```

**Exemple Get Secret (decrypted)**:
```bash
curl https://vault-api.freijstack.com/api/secrets/1 \
  -H "Authorization: Bearer $TOKEN"

# Réponse:
# {
#   "id": 1,
#   "name": "aws-api-key",
#   "value": "AKIAIOSFODNN7EXAMPLE",  ← Déchiffré automatiquement
#   "description": "Clé API AWS Production",
#   "expires_at": "2026-12-31T23:59:59.000Z",
#   "created_at": "2025-12-28T10:00:00.000Z"
# }
```

### Audit Logs

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/audit` | Logs de l'utilisateur | ✅ JWT |
| GET | `/api/audit/all` | Tous les logs (admin) | ✅ JWT (admin) |

---

## 🧪 Tests Locaux

### Développement Local (sans Docker)

**Backend**:
```bash
cd backend

# Installer dépendances
npm install

# Créer .env
cp .env.example .env
# Éditer .env avec DATABASE_URL pointant vers PostgreSQL local

# Lancer
npm run dev
# → http://localhost:3001
```

**Frontend**:
```bash
cd frontend

# Installer dépendances
npm install

# Créer .env
cp .env.example .env.local
# REACT_APP_API_URL=http://localhost:3001/api

# Lancer
npm start
# → http://localhost:3000
```

### Tests avec Docker Compose

```bash
# Dev avec hot reload
docker-compose -f docker-compose.dev.yml up

# Tests unitaires backend
docker-compose exec backend npm test

# Tests sécurité
docker run --rm -v $(pwd):/src trufflesecurity/trufflehog:latest filesystem /src --json
```

---

## 🔒 Sécurité

### Cryptographie

**Algorithme**: AES-256-GCM (Galois/Counter Mode)
- **Clé**: 256 bits (32 bytes) générée avec `openssl rand -hex 32`
- **IV**: 128 bits (16 bytes) unique par secret
- **Auth Tag**: 128 bits pour authentification intégrité

**Avantages GCM**:
- ✅ Chiffrement authentifié (AEAD)
- ✅ Détection tampering
- ✅ Résistant aux attaques par padding oracle

### Passwords

- **Bcrypt** avec 12 rounds (2^12 = 4096 itérations)
- Hash stocké dans PostgreSQL (jamais le plaintext)
- Salt automatique par bcrypt

### JWT Tokens

- **Algorithme**: HS256 (HMAC-SHA256)
- **Expiration**: 24h (configurable via `JWT_EXPIRES_IN`)
- **Secret**: 256 bits générés aléatoirement

### Rate Limiting

- **Limite**: 100 requêtes par 15 minutes par IP
- **Endpoints protégés**: Tous les `/api/*`

### Headers Sécurité (Helmet.js)

- `Content-Security-Policy` - Prévenir XSS
- `X-Frame-Options: SAMEORIGIN` - Prévenir clickjacking
- `X-Content-Type-Options: nosniff` - Prévenir MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS filter

---

## 📈 Monitoring

### Health Checks

```bash
# Backend
curl https://vault-api.freijstack.com/health

# Frontend
curl https://vault.freijstack.com/health

# Database (via backend logs)
docker-compose logs postgres | grep "ready"
```

### Métriques

- **Audit Logs**: Tous les événements tracés (login, CRUD secrets, erreurs)
- **Docker Health Checks**: Containers auto-restart si unhealthy
- **PostgreSQL Stats**: `docker-compose exec postgres pg_stat_activity`

---

## 🐛 Troubleshooting

### Backend ne démarre pas

**Symptôme**: `Error: ENCRYPTION_KEY environment variable not set`

**Solution**:
```bash
# Vérifier .env existe
ls -la .env

# Vérifier variables chargées
docker-compose config | grep ENCRYPTION_KEY

# Re-générer clé
openssl rand -hex 32
```

### Erreur "Failed to decrypt secret"

**Cause**: `ENCRYPTION_KEY` a changé depuis création du secret

**Solution**:
- ⚠️ **Ne JAMAIS changer `ENCRYPTION_KEY` en production**
- Si changé, secrets existants sont perdus
- Backup avant rotation clés

### CORS errors

**Symptôme**: Frontend ne peut pas appeler l'API

**Solution**:
```bash
# Vérifier FRONTEND_URL dans docker-compose.yml
grep FRONTEND_URL docker-compose.yml

# Doit matcher l'origine exacte
FRONTEND_URL: https://vault.freijstack.com
```

### Database connection failed

```bash
# Vérifier PostgreSQL running
docker-compose ps postgres

# Vérifier logs
docker-compose logs postgres

# Restart si nécessaire
docker-compose restart postgres
```

---

## 🔄 Backup & Restore

### Backup Database

```bash
# Backup complet
docker-compose exec postgres pg_dump -U securevault securevault > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup avec compression
docker-compose exec postgres pg_dump -U securevault securevault | gzip > backup.sql.gz
```

### Restore Database

```bash
# Restore depuis fichier
cat backup.sql | docker-compose exec -T postgres psql -U securevault securevault

# Restore depuis gzip
gunzip -c backup.sql.gz | docker-compose exec -T postgres psql -U securevault securevault
```

### Backup Encryption Key

⚠️ **CRITIQUE**: Sauvegarder `ENCRYPTION_KEY` dans un coffre sécurisé (Vault, 1Password, etc.)

Sans cette clé, **tous les secrets sont irrécupérables**.

---

## 📚 Resources

- **API Documentation**: Swagger/OpenAPI (TODO)
- **Architecture**: [/docs/01-architecture/architecture.md](../../docs/01-architecture/architecture.md)
- **Deployment Guide**: [/docs/02-deployment/DEPLOYMENT.md](../../docs/02-deployment/DEPLOYMENT.md)
- **Troubleshooting**: [/docs/04-operations/TROUBLESHOOTING.md](../../docs/04-operations/TROUBLESHOOTING.md)

---

## 🧑‍💻 Développement

### Structure du Code

```
saas/securevault/
├── backend/
│   ├── src/
│   │   ├── server.js              # Entry point
│   │   ├── config/
│   │   │   └── database.js        # PostgreSQL connection
│   │   ├── routes/
│   │   │   ├── auth.js            # Register, Login
│   │   │   ├── secrets.js         # CRUD secrets
│   │   │   └── audit.js           # Audit logs
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verification
│   │   │   ├── errorHandler.js   # Global errors
│   │   │   └── audit.js           # Audit logging
│   │   └── utils/
│   │       └── crypto.js          # AES-256-GCM encrypt/decrypt
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js                 # Main component
│   │   ├── components/
│   │   │   ├── Login.js           # Login page
│   │   │   ├── Register.js        # Register page
│   │   │   └── Dashboard.js       # Main dashboard
│   │   └── App.css                # Styles
│   ├── public/
│   │   └── index.html
│   ├── Dockerfile
│   ├── nginx.conf                 # SPA routing
│   └── package.json
├── docker-compose.yml             # Orchestration
├── init-db.sh                     # Database setup
└── README.md                      # This file
```

### Ajouter une Fonctionnalité

1. **Backend** - Créer route dans `/routes`
2. **Frontend** - Créer composant dans `/components`
3. **Database** - Ajouter migration SQL dans `init-db.sh`
4. **Tests** - Ajouter tests dans `/tests`

---

## 📜 Licence

**Tous droits réservés** - Christophe FREIJANES

Application de démonstration pour portfolio DevSecOps.

---

## 📞 Contact

- **Auteur**: Christophe FREIJANES
- **Portfolio**: https://portfolio.freijstack.com
- **GitHub**: https://github.com/christophe-freijanes/freijstack

---

**Version**: 1.1.0  
**Dernière mise à jour**: Janvier 2026  
**Status**: ✅ Production Ready
