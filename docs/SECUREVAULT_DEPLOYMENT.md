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

### ✅ Réutilisation des Secrets Portfolio

**Bonne nouvelle**: SecureVault utilise les mêmes secrets que le portfolio!

Vérifiez que vous avez déjà configuré dans **Settings → Secrets and variables → Actions**:

| Secret | Utilisé pour |
|--------|-------------|
| `VPS_SSH_HOST` | IP/domaine du VPS |
| `VPS_SSH_USER` | Utilisateur SSH |
| `VPS_SSH_KEY` | Clé SSH pour déploiement |

✅ **Aucun nouveau secret à créer** - la pipeline utilise les secrets existants!

---

## 📂 Configuration DNS Requise

Avant le premier déploiement, configurez les enregistrements DNS A :

**Production** (branche `master`):
- `vault.freijstack.com` → IP de votre VPS
- `vault-api.freijstack.com` → IP de votre VPS

**Staging** (branche `develop`):
- `vault-staging.freijstack.com` → IP de votre VPS
- `vault-api-staging.freijstack.com` → IP de votre VPS

💡 **Le workflow CI/CD vérifie automatiquement** que les DNS sont configurés avant de déployer.

---

## 🔐 Gestion des Secrets

### ✅ Génération Automatique

Le workflow **génère automatiquement** tous les secrets lors du premier déploiement :
- `DB_PASSWORD` : 64 caractères hexadécimaux
- `JWT_SECRET` : 64 caractères hexadécimaux  
- `ENCRYPTION_KEY` : 64 caractères hexadécimaux

### 📝 Variables d'Environnement (.env)

Les fichiers `.env` sont **créés automatiquement** sur le VPS avec la configuration complète.

**Emplacement**:
- Production : `/srv/www/securevault/.env`
- Staging : `/srv/www/securevault-staging/.env`

**Contenu généré automatiquement** (voir section "Structure du Déploiement" ci-dessous pour détails).

⚠️ **Générer des clés fortes:**

```bash
# JWT_SECRET et ENCRYPTION_KEY
openssl rand -base64 32
```

---

## 🚀 Structure du Déploiement sur VPS

La pipeline crée automatiquement (même que le portfolio):

```
/srv/www/
├── portfolio/                    # Portfolio prod
├── portfolio-staging/            # Portfolio staging  
├── securevault/                  # SecureVault prod (master)
│   └── saas/securevault/.env    # Auto-créé par CI/CD
└── securevault-staging/          # SecureVault staging (develop)
    └── saas/securevault/.env    # Auto-créé par CI/CD
```

**Même infrastructure VPS** que le portfolio ✅

### 📝 Variables d'Environnement Auto-configurées

Le workflow CI/CD **génère automatiquement** le fichier `.env` avec:

**Production** (branche `master`):
```env
DB_PASSWORD=<généré automatiquement>
JWT_SECRET=<généré automatiquement>
ENCRYPTION_KEY=<généré automatiquement>
API_DOMAIN=vault-api.freijstack.com
FRONTEND_DOMAIN=vault.freijstack.com
FRONTEND_URL=https://vault.freijstack.com
```

**Staging** (branche `develop`):
```env
DB_PASSWORD=<généré automatiquement>
JWT_SECRET=<généré automatiquement>
ENCRYPTION_KEY=<généré automatiquement>
API_DOMAIN=vault-api-staging.freijstack.com
FRONTEND_DOMAIN=vault-staging.freijstack.com
FRONTEND_URL=https://vault-staging.freijstack.com
```

💡 **Les secrets sont générés avec `openssl rand -hex 32`** lors du premier déploiement.

⚠️ **Si le `.env` existe déjà**, seules les variables de domaine manquantes seront ajoutées (sans toucher aux secrets).

---

## 🔄 Pipeline Workflow

### Déclenchement Automatique

La pipeline s'exécute automatiquement quand:
- ✅ Push sur la branche `develop` → Déploie sur **STAGING** (`/srv/www/securevault-staging/`)
- ✅ Push sur la branche `master` → Déploie sur **PRODUCTION** (`/srv/www/securevault/`)
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
