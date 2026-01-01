# 🤖 Guide Automatisation - FreijStack

Documentation complète de l'automatisation CI/CD pour FreijStack, couvrant les déploiements automatiques, la gestion des environnements, et les workflows intelligents.

**Dernière mise à jour**: Janvier 2026  
**Public visé**: DevOps, administrateurs, contributeurs  
**Objectif**: Zéro intervention manuelle pour les déploiements

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Principe de Fonctionnement](#principe-de-fonctionnement)
3. [Environnements](#environnements)
4. [Workflow Développement](#workflow-développement)
5. [Déploiements Automatiques](#déploiements-automatiques)
6. [Health Checks & Auto-Healing](#health-checks--auto-healing)
7. [Fonctionnalités Avancées](#fonctionnalités-avancées)
8. [Résolution de Problèmes](#résolution-de-problèmes)

---

## 🎯 Vue d'ensemble

### Objectif Principal

**Zéro intervention manuelle** pour les déploiements et la gestion des environnements FreijStack :
- Déploiement automatique staging et production
- Tests automatisés avant déploiement
- Health checks continus avec auto-healing
- Destruction automatique environnements éphémères
- Sécurité intégrée à chaque étape

### Caractéristiques Clés

✅ **Déploiement multi-environnements** automatique  
✅ **Staging éphémère** - détruit automatiquement après merge  
✅ **Production 24/7** - monitoring continu avec auto-healing  
✅ **Migrations automatiques** - détection credentials PostgreSQL  
✅ **Sécurité intégrée** - CodeQL, Gitleaks, Trivy  
✅ **Backups automatiques** - quotidiens multi-cloud  

---

## 🔄 Principe de Fonctionnement

### Cycle de Vie Complet

```mermaid
graph LR
    A[🌿 Push develop] --> B[🚀 Deploy Staging]
    B --> C[✅ Tests Auto]
    C --> D[👍 Validation]
    D --> E[🔀 Merge master]
    E --> F[🚀 Deploy Production]
    F --> G[🔥 Destroy Staging]
    G --> H[🏥 Health Check 24/7]
    
    style A fill:#0f3460
    style B fill:#533483
    style E fill:#0f3460
    style F fill:#533483
    style G fill:#e94560
    style H fill:#048ba8
```

### Flux d'Automatisation

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      AUTOMATISATION COMPLÈTE                              │
│                     Zéro Intervention Manuelle                            │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   DEVELOP   │ ───> │   STAGING   │ ───> │   MASTER    │
│   (code)    │      │  (tests)    │      │ (production)│
└─────────────┘      └─────────────┘      └─────────────┘
     Push                 Auto                 Merge
      ↓                    ↓                     ↓
  ✅ Validate         ✅ Deploy            ✅ Deploy Prod
  ✅ Test             📍 staging.com       🔥 Destroy Staging
  ✅ Build            ⏱️ Éphémère          🏥 Health Check 24/7
```

### Règles de Base

1. **Production** (`master`) : Toujours en ligne, jamais détruite
2. **Staging** (`develop`) : Éphémère, détruit automatiquement après merge vers master
3. **Feature branches** : Validation uniquement, pas de déploiement
4. **Aucune intervention manuelle** : Tout est automatisé via GitHub Actions

---

## 🌐 Environnements

### Staging (develop)

**Caractéristiques** :
- 🎯 **Objectif** : Tests d'intégration et validation fonctionnelle
- 🌿 **Branche** : `develop`
- 📍 **URLs** : 
  - Portfolio: `https://portfolio-staging.freijstack.com`
  - SecureVault: `https://vault-staging.freijstack.com`
  - SecureVault API: `https://vault-api-staging.freijstack.com`
- ⏱️ **Cycle de vie** : Éphémère (détruit après merge vers master)
- 🔄 **Health checks** : Toutes les heures
- 💾 **Base de données** : `securevault_staging`

**Déploiement** :
```bash
git push origin develop  # Déploie automatiquement en staging
```

**Destruction automatique** :
- Après merge vers `master`
- Conteneurs arrêtés et supprimés
- Réseau supprimé
- Volumes préservés (sécurité)

---

### Production (master)

**Caractéristiques** :
- 🎯 **Objectif** : Environnement production stable 24/7
- 🌿 **Branche** : `master`
- 📍 **URLs** :
  - Portfolio: `https://portfolio.freijstack.com`
  - SecureVault: `https://vault.freijstack.com`
  - SecureVault API: `https://vault-api.freijstack.com`
- ⏱️ **Cycle de vie** : Permanent (jamais détruit)
- 🔄 **Health checks** : Toutes les 30 minutes
- 🔧 **Auto-healing** : Redémarrage automatique si problème
- 💾 **Base de données** : `securevault`
- 📊 **Monitoring** : Prometheus + Grafana + Loki

**Déploiement** :
```bash
git push origin master  # Déploie en production + détruit staging
```

**Protection** :
- Jamais détruite automatiquement
- Backups quotidiens automatiques
- Monitoring continu
- Alertes immédiates en cas d'incident

---

## 💻 Workflow Développement

### 1. Créer une Feature Branch

```bash
# Partir de develop à jour
git checkout develop
git pull origin develop

# Créer la branche feature
git checkout -b feature/ma-fonctionnalite
```

### 2. Développer et Commiter

```bash
# Développer la fonctionnalité
# ... code changes ...

# Commiter (convention conventional commits)
git add .
git commit -m "feat(vault): add password strength indicator"

# Push la branche
git push origin feature/ma-fonctionnalite
```

**Conventions commits** :
```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: modification documentation
style: formatage code
refactor: refactorisation
test: ajout tests
chore: tâches de maintenance
```

### 3. Pull Request vers develop

```bash
# Sur GitHub: Create Pull Request
# feature/ma-fonctionnalite → develop
```

**Ce qui se passe automatiquement** :
- ✅ Validation titre PR (conventional commits)
- ✅ CodeQL analysis (sécurité)
- ✅ Tests unitaires
- ✅ Build validation
- 👀 Code review (humain)

### 4. Merge vers develop (Staging)

Après approbation et merge du PR :

**Déclenchement automatique** :
1. ✅ **Validation** - Configuration VPS, SSH access, directories
2. ✅ **Tests** - npm test (backend + frontend), security checks
3. 🧹 **Cleanup** - Arrêt anciens conteneurs, suppression images inutilisées
4. 🚀 **Deploy Staging** :
   - Pull latest code sur VPS
   - Build Docker images
   - Auto-détection credentials PostgreSQL
   - Run migrations database
   - `docker compose up -d` (staging)
5. 🔎 **Post-Verification** :
   - Health check endpoints
   - Vérification conteneurs running
   - Check connexion database
6. 📊 **Summary** - Rapport détaillé dans GitHub Actions

**Accès Staging** :
```
Frontend: https://vault-staging.freijstack.com
Backend API: https://vault-api-staging.freijstack.com
```

### 5. Tests sur Staging

Tests manuels et validation :
- ✅ Validation fonctionnelle
- ✅ Tests d'intégration
- ✅ Acceptance utilisateur
- ✅ Tests de performance
- ✅ Vérification sécurité

### 6. Merge vers master (Production)

Quand staging est validé :

```bash
# Option 1: Via Pull Request GitHub
# develop → master

# Option 2: Merge local
git checkout master
git pull origin master
git merge develop
git push origin master
```

**Déclenchement automatique** :
1. ✅ **Validation** (identique staging)
2. ✅ **Tests** (identique staging)
3. 🧹 **Cleanup** (identique staging)
4. 🚀 **Deploy Production** :
   - Pull latest code sur VPS
   - Build Docker images
   - Run migrations database
   - `docker compose up -d` (production)
   - Déploiement dans `/srv/www/securevault`
5. 🔎 **Post-Verification** :
   - Health check production endpoints
   - Vérification tous services UP
   - Test connexion database
6. 🔥 **Destroy Staging** :
   - Arrêt conteneurs staging
   - Suppression conteneurs staging
   - Suppression réseau staging
   - Préservation volumes (backup)
7. 🏥 **Activation Health Checks 24/7**
8. 📧 **Notifications** - Discord/Email

**Accès Production** :
```
Frontend: https://vault.freijstack.com
Backend API: https://vault-api.freijstack.com
```

---

## 🚀 Déploiements Automatiques

### Workflow: `securevault-deploy.yml`

**Triggers** :
```yaml
on:
  push:
    branches:
      - develop  # → Staging
      - master   # → Production
    paths:
      - 'saas/securevault/**'
  workflow_dispatch:  # Manuel
```

**Jobs** :

#### 1. Validation (validate)
```yaml
Steps:
- Checkout code
- Validate SSH access to VPS
- Check directories exist
- Verify docker-compose.yml
Duration: ~30s
```

#### 2. Tests (test)
```yaml
Steps:
- Run backend tests (npm test)
- Run frontend tests (npm test)
- Security scans (Trivy, Gitleaks)
- Lint code
Duration: ~2min
```

#### 3. Cleanup (cleanup)
```yaml
Steps:
- Stop old containers
- Remove unused images
- Prune Docker system
- Free disk space
Duration: ~30s
```

#### 4. Deploy (deploy)
```yaml
Steps:
- Determine environment (staging/production)
- Pull latest code via Git
- Build Docker images
- Auto-detect PostgreSQL credentials
- Run database migrations
- docker compose up -d
- Wait for services ready
Duration: ~3-5min
```

**Auto-détection PostgreSQL** :
```bash
# Extrait automatiquement depuis .env
POSTGRES_USER=$(grep POSTGRES_USER .env | cut -d '=' -f2)
POSTGRES_DB=$(grep POSTGRES_DB .env | cut -d '=' -f2)
POSTGRES_PASSWORD=$(grep POSTGRES_PASSWORD .env | cut -d '=' -f2)
```

#### 5. Post-Verification (post-verify)
```yaml
Steps:
- Health check frontend (HTTP 200)
- Health check backend API (HTTP 200)
- Test database connectivity
- Verify all containers running
- Check logs for errors
Duration: ~1min
```

#### 6. Destroy Staging (destroy-staging)
```yaml
Condition: github.ref == 'refs/heads/master'
Steps:
- Stop staging containers
- Remove staging containers
- Remove staging network
- Preserve volumes (backup safety)
Duration: ~30s
```

#### 7. Notify (notify)
```yaml
Steps:
- Send Discord notification
- Send email summary
- Update GitHub deployment status
Duration: ~10s
```

---

## 🏥 Health Checks & Auto-Healing

### Workflow: `healthcheck-prod.yml`

**Surveillance Production 24/7**

**Triggers** :
```yaml
schedule:
  - cron: '*/30 * * * *'  # Toutes les 30 minutes
workflow_dispatch:  # Manuel avec option auto-heal
```

**Services Monitorés** :

#### 1. Frontend Health
```bash
URL: https://vault.freijstack.com
Expected: HTTP 200
Timeout: 5s
Retry: 3 fois
```

#### 2. Backend API Health
```bash
URL: https://vault-api.freijstack.com/api/health
Expected: HTTP 200 + JSON {"status": "ok"}
Timeout: 5s
Retry: 3 fois
```

#### 3. Database Health
```bash
Command: pg_isready -U securevault -d securevault
Expected: Exit code 0
Timeout: 3s
Retry: 3 fois
```

**Auto-Healing** :

Si 3 échecs consécutifs détectés :

```bash
# 1. Tentative redémarrage service spécifique
docker compose restart backend
# ou
docker compose restart frontend

# 2. Si échec, redémarrage complet
docker compose restart

# 3. Si échec, recreation complète
docker compose down
docker compose up -d

# 4. Vérification post-healing
# Health checks à nouveau
```

**Notifications** :
- 🚨 Discord webhook immédiat
- 📧 Email aux administrateurs
- 📊 Log dans GitHub Actions summary
- 📈 Métriques Prometheus (si configuré)

### Workflow: `healthcheck-dev.yml`

**Surveillance Staging**

**Triggers** :
```yaml
schedule:
  - cron: '0 * * * *'  # Toutes les heures
workflow_dispatch:
```

**Différences vs Production** :
- Moins fréquent (coût optimisé)
- Auto-healing optionnel (paramètre manuel)
- Alertes moins prioritaires

---

## 🔧 Fonctionnalités Avancées

### 1. Auto-détection PostgreSQL

Les migrations détectent automatiquement les credentials depuis `.env` :

**Avant** (hardcodé) :
```bash
psql -U securevault_staging -d securevault_staging -f migration.sql
```

**Maintenant** (auto-détecté) :
```bash
POSTGRES_USER=$(grep POSTGRES_USER .env | cut -d '=' -f2)
POSTGRES_DB=$(grep POSTGRES_DB .env | cut -d '=' -f2)
psql -U $POSTGRES_USER -d $POSTGRES_DB -f migration.sql
```

**Avantages** :
- ✅ Pas de credentials hardcodés
- ✅ Même script pour staging et production
- ✅ Sécurité renforcée
- ✅ Maintenance simplifiée

### 2. Staging Éphémère

**Pourquoi détruire le staging ?** :
- 💰 Économie ressources serveur
- 🔒 Réduction surface d'attaque
- 🧹 Environnement propre à chaque cycle
- 📊 Production seule en monitoring continu

**Processus destruction** :
```bash
# Arrêt graceful
docker compose -f docker-compose.staging.yml stop

# Suppression conteneurs
docker compose -f docker-compose.staging.yml rm -f

# Suppression réseau
docker network rm securevault-staging-network

# Volumes préservés (backup)
# Les volumes ne sont JAMAIS supprimés automatiquement
```

**Récréation staging** :
```bash
# Automatique au prochain push sur develop
git push origin develop
# → Redéploiement complet staging
```

### 3. Rollback Strategy

En cas de déploiement échoué :

**Option 1: Revert Git**
```bash
# Revert le commit problématique
git revert HEAD
git push origin master

# Déploiement automatique de la version précédente
```

**Option 2: Rollback Manuel**
```bash
# SSH sur VPS
ssh root@vps.freijstack.com

# Aller dans le dossier
cd /srv/www/securevault

# Checkout version précédente
git log --oneline  # Trouver le hash
git checkout <hash-previous-version>

# Redémarrer
docker compose down
docker compose up -d
```

**Option 3: Restore Backup**
```bash
# Restaurer depuis backup quotidien
# Voir workflow backup.yml
```

### 4. Secrets Management

**Rotation Automatique** :

Workflow: `rotate-secrets.yml`
```yaml
schedule:
  - cron: '0 2 1 * *'  # 1er du mois à 2h
```

**Secrets rotés** :
- JWT_SECRET
- ENCRYPTION_KEY
- DB_PASSWORD (staging)
- SESSION_SECRET
- API_KEYS

**Process** :
1. Génération nouveaux secrets
2. Backup anciens secrets
3. Mise à jour .env files
4. Redémarrage services
5. Vérification health checks
6. Notification

---

## 🔍 Résolution de Problèmes

### Déploiement Échoué

**Symptôme** : GitHub Actions status rouge

**Diagnostic** :
```bash
# 1. Consulter les logs GitHub Actions
# → Actions → Workflow échoué → Logs détaillés

# 2. SSH sur VPS
ssh root@vps.freijstack.com

# 3. Vérifier l'état des conteneurs
cd /srv/www/securevault  # ou securevault-staging
docker compose ps
docker compose logs backend
docker compose logs frontend
docker compose logs postgres
```

**Solutions** :
- Vérifier les variables d'environnement (.env)
- Vérifier la connexion database
- Vérifier les migrations SQL
- Rollback à la version précédente
- Consulter [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Health Check Échoue

**Symptôme** : Health check rouge, alertes Discord

**Diagnostic** :
```bash
# Test manuel
curl -I https://vault.freijstack.com
curl https://vault-api.freijstack.com/api/health

# SSH et vérifier
docker compose ps
docker compose logs -f backend
```

**Auto-healing** :
- Automatique si activé (production)
- Manuel via workflow_dispatch si staging

### Staging Non Détruit

**Symptôme** : Staging encore actif après merge master

**Vérification** :
```bash
# Vérifier les logs du workflow
# → Actions → securevault-deploy → Job: destroy-staging
```

**Solution manuelle** :
```bash
ssh root@vps.freijstack.com
cd /srv/www/securevault-staging/saas/securevault
docker compose down
docker compose rm -f
docker network rm securevault-staging-network
```

### Migrations Échouées

**Symptôme** : Erreur lors des migrations database

**Diagnostic** :
```bash
# Vérifier la connexion
docker exec -it securevault-postgres psql -U securevault -d securevault -c "SELECT version();"

# Vérifier les migrations appliquées
docker exec -it securevault-postgres psql -U securevault -d securevault -c "SELECT * FROM schema_migrations;"
```

**Solutions** :
- Vérifier le fichier migration SQL
- Vérifier les permissions database
- Appliquer la migration manuellement
- Consulter les logs backend

---

## 📚 Ressources Complémentaires

### Documentation
- [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md) - Architecture CI/CD complète avec diagrammes
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide déploiement détaillé
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Guide dépannage
- [MONITORING.md](./MONITORING.md) - Setup monitoring Prometheus/Grafana

### Workflows GitHub Actions
- `.github/workflows/securevault-deploy.yml` - Déploiement SecureVault
- `.github/workflows/healthcheck-prod.yml` - Health checks production
- `.github/workflows/healthcheck-dev.yml` - Health checks staging
- `.github/workflows/backup.yml` - Backups automatiques
- `.github/workflows/rotate-secrets.yml` - Rotation secrets

### Commandes Utiles

**Vérifier déploiement** :
```bash
# Logs temps réel
docker compose logs -f

# État des conteneurs
docker compose ps

# Statistiques ressources
docker stats
```

**Debugging** :
```bash
# Entrer dans un conteneur
docker exec -it securevault-backend sh

# Vérifier variables environnement
docker exec securevault-backend env

# Tester database depuis backend
docker exec securevault-backend nc -zv postgres 5432
```

**Maintenance** :
```bash
# Nettoyer Docker
docker system prune -a --volumes

# Restart complet
docker compose restart

# Rebuild images
docker compose build --no-cache
```

---

## 💡 Best Practices

### Développement

1. **Toujours partir de develop à jour**
   ```bash
   git checkout develop && git pull
   ```

2. **Utiliser conventional commits**
   ```bash
   feat: add feature
   fix: resolve bug
   docs: update docs
   ```

3. **Tester localement avant push**
   ```bash
   npm test
   docker compose up -d
   ```

4. **Feature branches courtes**
   - Max 3-5 jours de dev
   - Merge fréquent vers develop

### Déploiement

1. **Toujours tester sur staging d'abord**
   - Push develop → test staging
   - Validation complète
   - Puis merge master

2. **Monitoring post-déploiement**
   - Vérifier health checks
   - Consulter logs
   - Tester fonctionnalités critiques

3. **Backups avant changements majeurs**
   - Trigger backup manuel
   - Vérifier backup récent
   - Documenter rollback plan

### Sécurité

1. **Jamais de secrets dans le code**
   - Utiliser .env
   - GitHub Secrets pour CI/CD
   - Rotation régulière

2. **Scan sécurité automatique**
   - CodeQL activé
   - Gitleaks configuré
   - Trivy scan enabled

3. **Monitoring continu**
   - Health checks activés
   - Alertes configurées
   - Logs centralisés

---

## 🎓 Formation & Support

### Tutoriels
1. **Démarrage Rapide** - [QUICK_DEPLOY_GUIDE.md](./QUICK_DEPLOY_GUIDE.md)
2. **Guide Utilisateur** - [USER_GUIDE.md](./USER_GUIDE.md)
3. **Architecture Complète** - [ARCHITECTURE.md](./ARCHITECTURE.md)

### Support
- **Issues GitHub** : [github.com/christophe-freijanes/freijstack/issues](https://github.com/christophe-freijanes/freijstack/issues)
- **Documentation** : [docs/](../docs/)
- **Email** : christophe.freijanes@freijstack.com

---

**Maintenu par**: Christophe FREIJANES  
**Licence**: All Rights Reserved  
**Version**: 2.0.0  
**Dernière mise à jour**: Janvier 2026
