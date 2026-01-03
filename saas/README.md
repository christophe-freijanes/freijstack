# 🚀 SaaS Applications

Ce dossier contient les applications SaaS de démonstration du portfolio DevSecOps de **Christophe FREIJANES**.

---

## 📋 Contenu

```
saas/
├── portfolio/          # 🌐 Portfolio web multilingue
├── securevault/        # 🔐 Gestionnaire de secrets chiffrés
├── registry/           # 🐳 Docker Registry privé
└── README.md           # Ce fichier
```

---

## 🌐 Portfolio

**Portfolio web multilingue** de présentation professionnelle.

- **Langues**: Français (FR) et Anglais (EN)
- **Design**: HTML5/CSS3 vanilla, responsive, thèmes saisonniers
- **Accès Production**: https://portfolio.freijstack.com/
- **Accès Staging**: https://portfolio-staging.freijstack.com/

### Démarrage Rapide

```bash
cd saas/portfolio

# Option 1: Ouvrir index.html dans un navigateur
# Option 2: Serveur local
python3 -m http.server 8000
# Accès: http://localhost:8000

# Option 3: Avec Node.js
npx http-server .
# Accès: http://localhost:8080
```

**Voir**: [portfolio/README.md](portfolio/README.md) pour les détails.

---

## 🔐 SecureVault Manager

**Gestionnaire de secrets sécurisé** avec chiffrement AES-256-GCM et audit complet.

### Fonctionnalités
- ✅ Secrets chiffrés (AES-256-GCM)
- ✅ Authentification JWT + RBAC
- ✅ Audit logs détaillés
- ✅ Dashboard React moderne
- ✅ Support multi-environnement (prod/staging)

### Stack Technique
- **Backend**: Node.js 18 + Express.js
- **Frontend**: React 18 + React Router v6
- **Database**: PostgreSQL 15
- **Encryption**: AES-256-GCM (Node.js native)
- **Infrastructure**: Docker Compose + Traefik

### Déploiement

#### Production
```bash
cd saas/securevault
cp .env.example .env
# Configurer .env avec vos secrets
docker compose up -d --build
./init-db.sh

# Accès
curl https://vault.freijstack.com
curl https://vault-api.freijstack.com/health
```

#### Staging
```bash
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d --build
# Accès sur: https://vault-staging.freijstack.com
```

**Voir**: [securevault/README.md](securevault/README.md) pour les détails complets.

---

## 🐳 Docker Registry

**Registre Docker privé** pour stocker vos images conteneur avec interface web de gestion.

### Fonctionnalités
- ✅ Docker Registry v2 officiel
- ✅ Interface web Joxit
- ✅ Authentification htpasswd
- ✅ Support prod/staging
- ✅ Cleanup automatisé via CI/CD
- ✅ HTTPS/TLS via Traefik

### Stack Technique
- **Registry**: Docker Registry v2
- **UI**: Joxit Docker Registry UI
- **Auth**: htpasswd (basique)
- **Reverse Proxy**: Traefik

### Déploiement

#### Production
```bash
cd saas/registry

# Générer htpasswd
./generate-htpasswd.sh admin yourpassword

# Démarrer
docker compose up -d

# Accès
# Registry API: https://registry.freijstack.com
# Registry UI: https://registry-ui.freijstack.com
```

#### Staging
```bash
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d
# Registry: https://registry-staging.freijstack.com
# UI: https://registry-ui-staging.freijstack.com
```

**Voir**: [registry/README.md](registry/README.md) pour les détails complets.

---

## 🏗️ Architecture Générale

```
┌─────────────────────────────────────┐
│         Traefik (Reverse Proxy)     │
│  (Gestion SSL/TLS automatique)      │
└──────┬──────────────────────────────┘
       │
       ├─────────────────────┬──────────────────┐
       │                     │                  │
       ▼                     ▼                  ▼
┌──────────────┐    ┌──────────────┐   ┌────────────────┐
│  Portfolio   │    │ SecureVault  │   │ Docker Registry│
│ nginx:alpine │    │ Node + React │   │ Registry v2 +  │
│  (Statique)  │    │ + PostgreSQL │   │   Joxit UI     │
└──────────────┘    └──────────────┘   └────────────────┘
```

---

## 📊 Environnements

### Production
- **Branch**: `master`
- **CI/CD**: Déploiement automatique sur push
- **Monitoring**: 24/7, health checks automatiques
- **Backups**: Quotidiens (AWS S3 + Azure Blob)

### Staging
- **Branch**: `develop`
- **CI/CD**: Déploiement automatique (environnements éphémères)
- **Nettoyage**: Auto-suppression après tests
- **Health checks**: Toutes les heures

---

## 🔐 Sécurité

### Bonnes Pratiques Appliquées

✅ **Chiffrement**
- Secrets chiffrés AES-256-GCM en base
- TLS 1.3 pour tous les transports
- Certificats Let's Encrypt automatiques

✅ **Authentification**
- JWT pour les APIs
- Bcrypt pour les passwords
- 2FA optionnel (selon l'app)

✅ **Autorisation**
- RBAC (Role-Based Access Control)
- Permissions granulaires par ressource
- Audit logs de toutes les actions

✅ **Infrastructure**
- Conteneurs isolés (Docker)
- Pas d'exposition de ports internes
- Network segmentation (Traefik)

---

## 🚀 Déploiement Multi-Environnement

### CI/CD Pipeline

```
Code → GitHub → GitHub Actions
                  ├─> Validate & Lint
                  ├─> Build & Test
                  ├─> Security Scan (CodeQL, Gitleaks, Trivy)
                  ├─> Deploy to Staging (develop branch)
                  └─> Deploy to Production (master branch)
```

### Branches

| Branche | Environnement | URL |
|---------|--------------|-----|
| `develop` | Staging | *-staging.freijstack.com |
| `master` | Production | *.freijstack.com |

---

## 📝 Fichiers de Configuration

### Variables d'Environnement

Chaque application a un fichier `.env.example` :

```bash
# Copier et configurer
cp .env.example .env
nano .env

# Ne JAMAIS commiter .env !
# (Déjà dans .gitignore)
```

### Docker Compose

Chaque app dispose de :
- `docker-compose.yml` - Configuration production
- `docker-compose.staging.yml` - Overrides pour staging (si applicable)
- `Dockerfile` pour frontend et backend (si applicable)

---

## 🛠️ Maintenance

### Logs & Monitoring

```bash
# Logs en temps réel
docker compose logs -f servicename

# Vérifier les conteneurs
docker compose ps

# Redémarrer une app
docker compose restart servicename

# Mettre à jour une image
docker compose pull
docker compose up -d
```

### Health Checks

```bash
# SecureVault
curl https://vault-api.freijstack.com/health

# Portfolio (code 200 OK)
curl -I https://portfolio.freijstack.com

# Docker Registry
curl https://registry.freijstack.com/v2/_catalog
```

---

## 📚 Documentation Complète

- **Portfolio**: [portfolio/README.md](portfolio/README.md)
- **SecureVault**: [securevault/README.md](securevault/README.md)
- **Docker Registry**: [registry/README.md](registry/README.md)
- **Architecture**: [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- **Déploiement**: [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)
- **CI/CD**: [../docs/CI_CD_ARCHITECTURE.md](../docs/CI_CD_ARCHITECTURE.md)

---

## 📬 Support & Contact

Pour les questions ou issues :
- 💼 [LinkedIn](https://www.linkedin.com/in/christophe-freijanes)
- 🎓 [Certifications](https://www.credly.com/users/christophe-freijanes)
- 🌐 [Portfolio Principal](https://portfolio.freijstack.com)

---

© 2025 Christophe FREIJANES. Tous droits réservés.
