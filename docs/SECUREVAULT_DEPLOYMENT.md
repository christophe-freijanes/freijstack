# 🔐 SecureVault CI/CD Deployment Guide

Guide de configuration de la pipeline CI/CD dédiée pour SecureVault Manager.

## 📋 Prérequis

- **VPS Ubuntu 22.04+** avec Docker et Docker Compose installés
- **Accès SSH** au VPS
- **Clé SSH privée** pour l'authentification
- **Domaines DNS** configurés (vault.freijstack.com, vault-api.freijstack.com)
- **Traefik** déjà déployé sur le VPS

---

## 🔧 Configuration GitHub Actions

### Étape 1: Créer les secrets GitHub

Dans votre repo GitHub, allez à **Settings → Secrets and variables → Actions** et créez:

| Secret | Valeur | Description |
|--------|--------|-------------|
| `VPS_HOST` | `votre-ip-vps.com` | Adresse IP ou domaine du VPS |
| `VPS_USER` | `ubuntu` (ou autre) | Utilisateur SSH |
| `VPS_SSH_KEY` | Contenu clé privée | Clé SSH **privée** (générer si besoin) |
| `VPS_PORT` | `22` | Port SSH (optionnel, défaut 22) |

### Génération d'une clé SSH (si besoin):

```bash
# Sur votre machine locale
ssh-keygen -t ed25519 -f ~/.ssh/github_actions -N ""

# Copier la clé publique sur le VPS
cat ~/.ssh/github_actions.pub | ssh user@vps "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# Copier le contenu de la clé privée dans le secret VPS_SSH_KEY
cat ~/.ssh/github_actions
```

---

## 🚀 Structure du Déploiement sur VPS

La pipeline crée automatiquement:

```
/app/
├── securevault-prod/         # Production (branche master)
│   ├── saas/securevault/
│   │   ├── backend/
│   │   ├── frontend/
│   │   ├── docker-compose.yml
│   │   └── .env              # ⚠️ À créer manuellement
│   └── .git/
├── securevault-staging/      # Staging (branche develop)
│   └── [même structure]
```

---

## 📝 Configuration d'Environment (.env)

### Sur le VPS, créer les fichiers .env:

**Pour PRODUCTION** (`/app/securevault-prod/saas/securevault/.env`):

```bash
# Backend
NODE_ENV=production
PORT=8080
DB_HOST=postgres
DB_PORT=5432
DB_NAME=securevault_prod
DB_USER=vault_prod
DB_PASSWORD=<CHANGEZ_MOI>
JWT_SECRET=<CHANGEZ_MOI>
JWT_EXPIRY=7d
ENCRYPTION_KEY=<CHANGEZ_MOI>
LOG_LEVEL=info

# Frontend
REACT_APP_API_URL=https://vault-api.freijstack.com
```

**Pour STAGING** (`/app/securevault-staging/saas/securevault/.env`):

```bash
# Backend
NODE_ENV=staging
PORT=8081
DB_HOST=postgres
DB_PORT=5432
DB_NAME=securevault_staging
DB_USER=vault_staging
DB_PASSWORD=<CHANGEZ_MOI>
JWT_SECRET=<CHANGEZ_MOI>
JWT_EXPIRY=7d
ENCRYPTION_KEY=<CHANGEZ_MOI>
LOG_LEVEL=debug

# Frontend
REACT_APP_API_URL=https://vault-staging-api.freijstack.com
```

⚠️ **Générer des clés fortes:**

```bash
# JWT_SECRET et ENCRYPTION_KEY
openssl rand -base64 32
```

---

## 🔄 Pipeline Workflow

### Déclenchement Automatique

La pipeline s'exécute automatiquement quand:
- ✅ Push sur la branche `develop` → Déploie sur **STAGING**
- ✅ Push sur la branche `master` → Déploie sur **PRODUCTION**
- ✅ Changements dans `saas/securevault/**`

### Étapes de la Pipeline

```
1. Test & Build
   ├── Checkout code
   ├── Tests Backend (Node.js 18)
   ├── Tests Frontend (Node.js 18)
   ├── Build Docker images
   ├── Scan de sécurité (Trivy)
   └── Upload résultats

2. Deploy to VPS
   ├── SSH vers VPS
   ├── Git pull (clone si besoin)
   ├── Docker Compose up -d
   ├── Health check
   └── Logs

3. Verification
   └── Vérifier que l'API répond
```

### Déploiement Manuel

Allez à **Actions → Deploy SecureVault → Run workflow** pour:
- Choisir la branche
- Choisir l'environnement (staging/production)

---

## 📊 Monitoring Déploiement

### Voir les logs de déploiement:

1. **GitHub**: Actions → Deploy SecureVault → Sélectionner le run
2. **VPS**: 
   ```bash
   # Logs récents
   docker-compose -C /app/securevault-prod/saas/securevault logs -f
   
   # Status
   docker-compose -C /app/securevault-prod/saas/securevault ps
   ```

### Vérifier la santé:

```bash
# Production
curl https://vault-api.freijstack.com/health

# Staging
curl https://vault-staging-api.freijstack.com/health
```

---

## 🛠️ Troubleshooting

### Erreur: "Permission denied (publickey)"
- ✅ Vérifier que la clé SSH est dans `VPS_SSH_KEY`
- ✅ Vérifier que la clé publique est dans `~/.ssh/authorized_keys` sur le VPS
- ✅ Vérifier les permissions: `chmod 600 ~/.ssh/authorized_keys`

### Erreur: ".env file not found"
- ✅ Créer `/app/securevault-prod/saas/securevault/.env` sur le VPS
- ✅ Copier depuis `.env.example` et adapter

### Docker Compose ne démarre pas
```bash
# Sur VPS
cd /app/securevault-prod/saas/securevault
docker-compose up -d
docker-compose logs
```

### Port déjà utilisé
- ✅ Changer les ports dans `docker-compose.yml` ou `.env`
- ✅ Vérifier les conteneurs existants: `docker ps`

---

## 🔒 Sécurité

### Bonnes pratiques:

1. ✅ **Ne JAMAIS commiter `.env`** (déjà dans `.gitignore`)
2. ✅ **Secrets GitHub**: Utiliser pour les données sensibles
3. ✅ **Clés SSH**: Ed25519 (plus sûr que RSA)
4. ✅ **Droits fichiers**: `.env` doit être `600`
5. ✅ **Rollback rapide**: Git reset si besoin

### Scan de sécurité:

- **Trivy** scanne les images Docker automatiquement
- Résultats affichés dans **Security → Code scanning**
- Failing si vulnérabilités critiques

---

## 📈 Évolutions Futures

- [ ] Slack/Discord notifications
- [ ] Approvals manuel avant prod
- [ ] Rollback automatique en cas d'erreur
- [ ] Backup base de données avant déploiement
- [ ] Blue-green deployment

---

**Créé par**: Christophe FREIJANES  
**Date**: Décembre 2025
