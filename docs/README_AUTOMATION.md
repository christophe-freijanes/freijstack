# 🤖 Automatisation Complète - SecureVault

## 🎯 Objectif

**Zéro intervention manuelle** pour les déploiements et la gestion des environnements.

## ✨ Nouveautés

### 1. **Déploiement automatique sur master (Production)**

Avant : Seul `develop` déclenchait un déploiement automatique  
Maintenant : `master` déploie automatiquement en **production**

```bash
git checkout master
git merge develop
git push origin master
→ Déploiement automatique production
```

### 2. **Destruction automatique du staging**

Après chaque merge vers `master`, le staging est **automatiquement détruit** :

- ✅ Arrêt des conteneurs staging
- ✅ Suppression des conteneurs
- ✅ Suppression du réseau
- 💾 Volumes préservés (sécurité)

### 3. **Health Check 24/7 avec Auto-Healing**

Production surveillée **toutes les 15 minutes** :

- 🔍 Frontend check
- 🔍 Backend API check  
- 🔍 Database check
- 🔧 Redémarrage automatique en cas de problème

### 4. **Auto-détection PostgreSQL**

Les migrations détectent automatiquement les credentials depuis `.env` :

```bash
POSTGRES_USER=securevault_staging  # Détecté automatiquement
POSTGRES_DB=securevault_staging    # Détecté automatiquement
```

Plus besoin de hardcoder les credentials !

## 📋 Workflows GitHub Actions

### 1. `securevault-deploy.yml` - Déploiement

**Triggers :**
- Push sur `develop` → Déploiement **staging**
- Push sur `master` → Déploiement **production** + Destruction staging
- Manuel via GitHub Actions

**Jobs :**
1. ✅ Validation
2. 🧪 Tests
3. 🧹 Cleanup
4. 🚀 Deploy (staging ou production)
5. 🔎 Post-verification
6. 🔥 **Destroy-staging** (uniquement si master)
7. 📢 Notify

### 2. `production-healthcheck.yml` - Surveillance

**Triggers :**
- Schedule : Toutes les 15 minutes
- Manuel via GitHub Actions

**Jobs :**
1. 🏥 Health-check (frontend, backend, database)
2. 🔧 Auto-heal (si problème détecté)
3. 📢 Notify

### 3. `backup.yml` - Sauvegardes

**Triggers :**
- Schedule : Tous les jours à 3h du matin
- Manuel via GitHub Actions

**Fonctionnalités :**
- Sauvegardes multi-cloud (AWS, Azure, GCP, etc.)
- Retention 30 jours
- Notifications Slack/Discord

## 🚀 Utilisation

### Workflow de développement

```bash
# 1. Développer sur une feature branch
git checkout develop
git checkout -b feature/ma-fonctionnalite
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin feature/ma-fonctionnalite

# 2. Merge vers develop (staging)
git checkout develop
git merge feature/ma-fonctionnalite
git push origin develop
→ ✅ Staging déployé automatiquement

# 3. Tester sur staging
# https://vault-staging.freijstack.com

# 4. Merge vers master (production)
git checkout master
git merge develop
git push origin master
→ ✅ Production déployée automatiquement
→ 🔥 Staging détruit automatiquement
```

### Déploiement manuel

Sur GitHub :
1. **Actions** → **SecureVault Deploy** → **Run workflow**
2. Sélectionner :
   - `environment: staging` ou `production`
   - `destroy_staging: false` (sauf test)
3. **Run workflow**

### Health Check manuel

Sur GitHub :
1. **Actions** → **Production Health Check** → **Run workflow**
2. Sélectionner :
   - `auto_heal: true` (redémarrage automatique si problème)
3. **Run workflow**

## 🔧 Scripts

### `scripts/validate-automation.sh`

Valide que tous les composants d'automatisation sont en place :

```bash
chmod +x scripts/validate-automation.sh
./scripts/validate-automation.sh
```

**Vérifie :**
- ✅ Workflows GitHub Actions
- ✅ Job destroy-staging
- ✅ Health check configuré
- ✅ Auto-healing activé
- ✅ Scripts de migration
- ✅ Documentation

### `scripts/run-migrations.sh`

Exécute les migrations avec auto-détection des credentials :

```bash
# Staging
./scripts/run-migrations.sh staging

# Production
./scripts/run-migrations.sh production
```

### `scripts/backup-to-cloud.sh`

Sauvegarde multi-cloud :

```bash
# Backup staging vers S3
./scripts/backup-to-cloud.sh staging s3

# Backup production vers tous les providers configurés
./scripts/backup-to-cloud.sh production all
```

## 🌍 Environnements

### Staging (Éphémère)

| Propriété | Valeur |
|-----------|--------|
| **Branche** | `develop` |
| **Durée de vie** | Temporaire |
| **URL Frontend** | https://vault-staging.freijstack.com |
| **URL Backend** | https://vault-api-staging.freijstack.com |
| **Base de données** | securevault_staging |
| **Répertoire VPS** | /srv/www/securevault-staging |

**Destruction automatique** après merge vers master.

### Production (Permanente)

| Propriété | Valeur |
|-----------|--------|
| **Branche** | `master` |
| **Durée de vie** | Permanente |
| **URL Frontend** | https://vault.freijstack.com |
| **URL Backend** | https://vault-api.freijstack.com |
| **Base de données** | securevault |
| **Répertoire VPS** | /srv/www/securevault |
| **Health Check** | Toutes les 15 minutes |
| **Auto-Healing** | Activé |

**Jamais détruite automatiquement**, surveillée 24/7.

## 📊 Monitoring

### GitHub Actions Dashboard

Tous les workflows sont visibles dans **Actions** :

- 🚀 **SecureVault Deploy** : Historique des déploiements
- 🏥 **Production Health Check** : État de santé production
- 💾 **Backup** : Historique des sauvegardes

### Logs en temps réel

```bash
# SSH sur le VPS
ssh user@vps

# Logs staging
cd /srv/www/securevault-staging/saas/securevault
docker compose logs -f

# Logs production
cd /srv/www/securevault/saas/securevault
docker compose logs -f
```

## 🐛 Dépannage

### Staging ne se détruit pas

```bash
# Destruction manuelle
ssh user@vps
cd /srv/www/securevault-staging/saas/securevault
docker compose down
docker rm -f securevault-staging-backend securevault-staging-frontend securevault-staging-postgres
docker network rm securevault_staging_network
```

### Production ne répond plus

Le health check **auto-heal** devrait résoudre automatiquement. Si non :

```bash
ssh user@vps
cd /srv/www/securevault/saas/securevault
docker compose restart
docker compose logs -f backend
```

### Migrations échouent

```bash
# Vérifier les credentials PostgreSQL
cd /srv/www/securevault/saas/securevault
cat .env | grep POSTGRES

# Exécuter manuellement
cd /srv/www/securevault
./scripts/run-migrations.sh production
```

## 📚 Documentation complète

Pour plus de détails, consultez :

- [docs/AUTOMATION.md](../docs/AUTOMATION.md) - Guide complet de l'automatisation
- [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) - Guide de déploiement
- [docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) - Résolution de problèmes
- [docs/CLOUD_BACKUP.md](../docs/CLOUD_BACKUP.md) - Sauvegardes cloud

## ✅ Checklist

### Configuration initiale (une fois)

- [ ] Secrets GitHub configurés
- [ ] Workflows activés
- [ ] Health check activé
- [ ] .env configuré sur VPS (staging + production)

### Validation

```bash
# Vérifier que tout est en place
chmod +x scripts/validate-automation.sh
./scripts/validate-automation.sh
```

Si validation OK, vous êtes prêt ! 🎉

## 🎯 Résumé

**Aucune intervention manuelle requise :**

1. 📝 Développer sur `develop`
2. 🧪 Push → Staging auto-déployé
3. ✅ Tester
4. 🚀 Merge vers `master` → Production déployée, staging détruit
5. 🏥 Health check 24/7 avec auto-healing
6. 💾 Sauvegardes quotidiennes automatiques

**Production reste toujours en ligne** ✅
