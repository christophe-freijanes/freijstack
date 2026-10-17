# ✅ Checklist de Déploiement - Automatisation Complète

## 🎯 Objectif

Valider que l'automatisation complète est en place et fonctionnelle.

## 📋 Prérequis

### 1. Configuration GitHub Secrets

Vérifier que ces secrets sont configurés dans **Settings → Secrets and variables → Actions** :

- [ ] `VPS_SSH_KEY` - Clé SSH privée pour accès VPS
- [ ] `VPS_SSH_HOST` - Hostname ou IP du VPS
- [ ] `VPS_SSH_USER` - Utilisateur SSH (ex: `root` ou `deploy`)
- [ ] `POSTGRES_PASSWORD` - Mot de passe PostgreSQL (pour migrations)
- [ ] *(Optionnel)* `AWS_ACCESS_KEY_ID` - Pour backups S3
- [ ] *(Optionnel)* `AWS_SECRET_ACCESS_KEY` - Pour backups S3

### 2. Configuration VPS

SSH sur le VPS et vérifier :

```bash
ssh user@vps

# 1. Vérifier que les répertoires existent
ls -la /srv/www/securevault
ls -la /srv/www/securevault-staging

# 2. Vérifier les fichiers .env
cat /srv/www/securevault/saas/securevault/.env | grep POSTGRES
cat /srv/www/securevault-staging/saas/securevault/.env | grep POSTGRES

# Variables requises dans .env :
# POSTGRES_USER=securevault (production) ou securevault_staging (staging)
# POSTGRES_DB=securevault (production) ou securevault_staging (staging)
# POSTGRES_PASSWORD=<password>
# JWT_SECRET=<secret>
# MASTER_KEY=<key>
```

Checklist VPS :

- [ ] Répertoire `/srv/www/securevault` existe
- [ ] Répertoire `/srv/www/securevault-staging` existe
- [ ] Fichier `.env` production configuré avec `POSTGRES_USER` et `POSTGRES_DB`
- [ ] Fichier `.env` staging configuré avec `POSTGRES_USER` et `POSTGRES_DB`
- [ ] Docker et Docker Compose installés
- [ ] Accès SSH depuis GitHub Actions fonctionne

## 🚀 Étape 1 : Validation Locale

Sur votre machine locale :

```bash
cd d:\Infra\Git\repo\freijstack

# 1. Vérifier que tous les fichiers sont présents
ls .github/workflows/03-app-securevault-deploy.yml
ls .github/workflows/05-health-prod.yml
ls docs/03-guides/AUTOMATION_GUIDE.md
ls scripts/validate-automation.sh

# 2. Exécuter le script de validation
bash scripts/validate-automation.sh
```

**Résultat attendu :** ✅ Tous les checks au vert

Checklist validation :

- [ ] Script `validate-automation.sh` s'exécute sans erreur
- [ ] Tous les fichiers requis sont présents
- [ ] Job `destroy-staging` trouvé dans workflow
- [ ] Health check configuré (cron toutes les 15 min)
- [ ] Auto-heal configuré

## 🧪 Étape 2 : Test Staging

Commiter et pusher sur develop :

```bash
git add .
git commit -m "feat: automatisation complète avec destruction staging et health check 24/7"
git push origin develop
```

**Ce qui doit se passer automatiquement :**

1. GitHub Actions démarre le workflow `securevault-deploy.yml`
2. Job `validate` : Vérifie la configuration VPS
3. Job `test` : Exécute les tests
4. Job `cleanup` : Nettoie les anciens conteneurs
5. Job `deploy` : Déploie sur **STAGING**
6. Job `post-verify` : Vérifie que staging fonctionne
7. Job `notify` : Notification du statut

Checklist GitHub Actions :

- [ ] Workflow démarre automatiquement après push
- [ ] Job `validate` passe (vert)
- [ ] Job `test` passe (vert)
- [ ] Job `deploy` passe (vert) avec environment = `staging`
- [ ] Job `destroy-staging` **ne s'exécute PAS** (normal, on n'est pas sur master)
- [ ] Workflow complet réussit

Test manuel staging :

- [ ] Frontend accessible : https://vault-staging.freijstack.com
- [ ] Backend accessible : https://vault-api-staging.freijstack.com/api/health
- [ ] Peut s'enregistrer et se connecter
- [ ] Fonctionnalités de base fonctionnent

## 🚀 Étape 3 : Test Production

Merger vers master :

```bash
git checkout master
git pull origin master
git merge develop
git push origin master
```

**Ce qui doit se passer automatiquement :**

1. GitHub Actions démarre le workflow `securevault-deploy.yml`
2. Job `validate` : Vérifie la configuration VPS
3. Job `test` : Exécute les tests
4. Job `cleanup` : Nettoie les anciens conteneurs
5. Job `deploy` : Déploie sur **PRODUCTION**
6. Job `post-verify` : Vérifie que production fonctionne
7. Job `destroy-staging` : 🔥 **DÉTRUIT STAGING AUTOMATIQUEMENT**
8. Job `notify` : Notification du statut

Checklist GitHub Actions :

- [ ] Workflow démarre automatiquement après push sur master
- [ ] Job `validate` passe (vert)
- [ ] Job `test` passe (vert)
- [ ] Job `deploy` passe (vert) avec environment = `production`
- [ ] Job `destroy-staging` **S'EXÉCUTE** et passe (vert)
- [ ] Logs montrent "Staging environment destroyed successfully!"
- [ ] Workflow complet réussit

Test manuel production :

- [ ] Frontend accessible : https://vault.freijstack.com
- [ ] Backend accessible : https://vault-api.freijstack.com/api/health
- [ ] Peut s'enregistrer et se connecter
- [ ] Fonctionnalités de base fonctionnent

Vérification destruction staging :

```bash
# SSH sur le VPS
ssh user@vps

# Vérifier que les conteneurs staging n'existent plus
docker ps -a | grep staging
# Résultat attendu : Aucun conteneur staging

# Vérifier que le réseau staging n'existe plus
docker network ls | grep staging
# Résultat attendu : Aucun réseau staging

# Vérifier que production tourne toujours
cd /srv/www/securevault/saas/securevault
docker compose ps
# Résultat attendu : frontend, backend, postgres UP
```

Checklist destruction staging :

- [ ] Aucun conteneur staging (docker ps -a | grep staging → vide)
- [ ] Aucun réseau staging (docker network ls | grep staging → vide)
- [ ] Conteneurs production actifs (securevault-frontend, backend, postgres UP)
- [ ] Production accessible et fonctionnelle

## 🏥 Étape 4 : Test Health Check

### Test automatique

Attendre 15 minutes après le déploiement, puis :

1. Aller sur GitHub : **Actions** → **Production Health Check**
2. Vérifier qu'un run automatique a eu lieu (schedule)
3. Vérifier que tous les checks passent au vert

Checklist health check automatique :

- [ ] Workflow s'exécute automatiquement toutes les 15 min
- [ ] Job `health-check` vérifie frontend, backend, database
- [ ] Tous les checks passent (HTTP 200, pg_isready OK)
- [ ] Job `auto-heal` ne s'exécute PAS (normal, production healthy)

### Test manuel

Déclencher manuellement un health check :

1. GitHub : **Actions** → **Production Health Check** → **Run workflow**
2. Sélectionner `auto_heal: true`
3. Cliquer **Run workflow**

Checklist health check manuel :

- [ ] Workflow démarre
- [ ] Frontend check : ✅ (HTTP 200)
- [ ] Backend check : ✅ (HTTP 200)
- [ ] Database check : ✅ (accepting connections)
- [ ] Job `auto-heal` ne s'exécute PAS (production healthy)

### Test auto-healing (optionnel, avancé)

⚠️ **ATTENTION** : Cela va redémarrer production temporairement !

Pour tester l'auto-healing, simuler un problème :

```bash
# SSH sur le VPS
ssh user@vps
cd /srv/www/securevault/saas/securevault

# Arrêter le backend temporairement
docker compose stop backend
```

Attendre 15 min max que le health check s'exécute automatiquement, ou déclencher manuellement.

**Résultat attendu :**
1. Health check détecte que backend est DOWN
2. Job `auto-heal` s'exécute automatiquement
3. Backend redémarre : `docker compose restart`
4. Health check réussit après restart
5. Production fonctionne à nouveau

Checklist auto-healing :

- [ ] Health check détecte le problème
- [ ] Job `auto-heal` s'exécute
- [ ] Services redémarrent automatiquement
- [ ] Production fonctionne après auto-heal
- [ ] Logs GitHub Actions montrent "Auto-heal successful"

## 💾 Étape 5 : Test Backups (Optionnel)

Si vous avez configuré les backups cloud :

1. GitHub : **Actions** → **Backup** → **Run workflow**
2. Sélectionner :
   - `environment: production`
   - `provider: s3` (ou autre provider configuré)
3. Cliquer **Run workflow**

Checklist backup :

- [ ] Workflow démarre
- [ ] Dump PostgreSQL réussit
- [ ] Compression réussit
- [ ] Upload vers cloud réussit
- [ ] Notification envoyée (optionnel)

## 📊 Étape 6 : Monitoring Continu

### Dashboard GitHub Actions

Vérifier régulièrement :

- **Actions** → **SecureVault Deploy** : Historique des déploiements
- **Actions** → **Production Health Check** : Historique des checks (tous les 15 min)
- **Actions** → **Backup** : Historique des sauvegardes (quotidien)

Checklist monitoring :

- [ ] Health checks s'exécutent toutes les 15 minutes
- [ ] Tous les checks passent au vert
- [ ] Backups quotidiens à 03:00 UTC
- [ ] Aucune alerte d'erreur

### Logs VPS

Vérifier régulièrement les logs :

```bash
ssh user@vps
cd /srv/www/securevault/saas/securevault

# Logs temps réel
docker compose logs -f

# Logs backend uniquement
docker compose logs -f backend

# Logs des 100 dernières lignes
docker compose logs --tail=100 backend
```

## 🎯 Récapitulatif Final

Une fois toutes les étapes validées, vous avez :

✅ **Déploiement automatique** :
- Push sur `develop` → Staging déployé automatiquement
- Merge vers `master` → Production déployée automatiquement
- Staging détruit automatiquement après déploiement production

✅ **Surveillance 24/7** :
- Health check toutes les 15 minutes
- Auto-healing en cas de problème
- Production toujours en ligne

✅ **Sauvegardes automatiques** :
- Backup quotidien vers le cloud
- Retention 30 jours
- Multi-cloud support

✅ **Zéro intervention manuelle** :
- Aucune tâche manuelle requise
- Tout est automatisé
- Production reste toujours en vie
- Staging éphémère (tests uniquement)

## 🐛 Dépannage

### Problème : Staging ne se détruit pas

**Solution :**

1. Vérifier les logs du job `destroy-staging` sur GitHub Actions
2. Destruction manuelle :
```bash
ssh user@vps
cd /srv/www/securevault-staging/saas/securevault
docker compose down
docker rm -f $(docker ps -a | grep staging | awk '{print $1}')
docker network rm securevault_staging_network
```

### Problème : Health check échoue

**Solution :**

1. Vérifier que production est accessible : https://vault.freijstack.com
2. SSH sur VPS et vérifier les conteneurs :
```bash
cd /srv/www/securevault/saas/securevault
docker compose ps
docker compose logs backend
```
3. Si nécessaire, redémarrer :
```bash
docker compose restart
```

### Problème : Migrations échouent

**Solution :**

1. Vérifier les credentials PostgreSQL dans `.env`
2. Exécuter manuellement :
```bash
cd /srv/www/securevault
./scripts/run-migrations.sh production
```

## 📚 Documentation

Pour plus de détails :

- [docs/03-guides/AUTOMATION_GUIDE.md](../03-guides/AUTOMATION_GUIDE.md) - Guide complet
- [.github/workflows/README.md](../../.github/workflows/README.md) - Guide workflows

## 🎉 C'est Terminé !

Si toutes les étapes sont validées (cases cochées), votre automatisation est **complète et fonctionnelle**.

**Vous n'avez plus rien à faire manuellement !** 🎊

---

**Date de validation :** _________________

**Validé par :** _________________

**Signature :** _________________
