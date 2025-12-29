# 🚀 Guide de Déploiement Rapide - Staging

## Situation actuelle

❌ **Staging n'est pas accessible** (HTTP 404 sur tous les endpoints)

## Solution : Déployer maintenant

### Étape 1 : Commiter vos changements

```bash
git status

# Vérifier les fichiers modifiés/ajoutés
git add .

git commit -m "feat: automatisation complète + favicons professionnels

- Auto-déploiement production sur push master
- Destruction automatique staging après merge
- Health check 24/7 avec auto-healing
- Favicon professionnel (cadenas bleu)
- Support PWA complet
- Scripts de diagnostic améliorés"
```

### Étape 2 : Pusher sur develop

```bash
git push origin develop
```

### Étape 3 : Suivre le déploiement

1. Aller sur GitHub : https://github.com/christophe-freijanes/freijstack/actions
2. Cliquer sur le workflow en cours : **SecureVault Deploy**
3. Suivre l'exécution en temps réel

**Jobs attendus :**
- ✅ Validate (vérification VPS)
- ✅ Test (tests unitaires)
- ✅ Cleanup (nettoyage anciens conteneurs)
- ✅ Deploy (déploiement staging)
- ✅ Post-verify (vérification)
- ✅ Notify (notification statut)

**Durée estimée : 5-7 minutes**

### Étape 4 : Vérifier le déploiement

Une fois le workflow terminé (✅ vert), retester :

```powershell
.\scripts\diagnose-registration.ps1 -Environment staging
```

**Résultat attendu :**
```
✓ Backend is responding
  Response: {"status":"healthy",...}

✓ CORS preflight successful (HTTP 204)
  ✓ Access-Control-Allow-Origin: https://vault-staging.freijstack.com
  ✓ Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
  ✓ Access-Control-Allow-Headers: Content-Type,...

✓ Registration successful!
  Response: {"message":"User registered successfully",...}
```

### Étape 5 : Tester dans le navigateur

1. Ouvrir https://vault-staging.freijstack.com
2. Cliquer sur "S'inscrire" / "Register"
3. Remplir le formulaire :
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `TestPass123!`
4. Soumettre

**Résultat attendu :** ✅ Compte créé avec succès

## Si le déploiement échoue

### Vérifier les logs GitHub Actions

1. Aller dans l'onglet **Actions**
2. Cliquer sur le run qui a échoué
3. Cliquer sur le job en rouge
4. Lire les logs d'erreur

### Problèmes courants

#### 1. SSH connection failed
```bash
# Vérifier que la clé SSH est configurée dans GitHub Secrets
# Settings → Secrets → VPS_SSH_KEY
```

#### 2. Docker compose failed
```bash
# SSH sur le VPS et vérifier manuellement
ssh user@vps
cd /srv/www/securevault-staging/saas/securevault
docker compose logs backend
```

#### 3. Database migration failed
```bash
# Vérifier les credentials PostgreSQL dans .env
ssh user@vps
cd /srv/www/securevault-staging/saas/securevault
cat .env | grep POSTGRES
docker compose exec postgres psql -U securevault_staging -d securevault_staging -c '\dt'
```

## Déploiement manuel (Plan B)

Si le workflow GitHub Actions échoue, déployer manuellement :

```bash
# SSH sur le VPS
ssh user@vps

# Aller dans staging
cd /srv/www/securevault-staging

# Mettre à jour le code
git fetch origin
git reset --hard origin/develop

# Aller dans securevault
cd saas/securevault

# Redémarrer les conteneurs
docker compose down
docker compose up -d --build

# Attendre 30 secondes
sleep 30

# Vérifier
docker compose ps
docker compose logs backend --tail=50

# Tester
curl https://vault-api-staging.freijstack.com/api/health
```

## Résumé des commandes

```bash
# Local
git add .
git commit -m "feat: automatisation + favicons"
git push origin develop

# Attendre 5 minutes

# Retester
.\scripts\diagnose-registration.ps1 -Environment staging

# Si succès, tester dans le navigateur
start https://vault-staging.freijstack.com
```

## Prochaines étapes après validation

Une fois staging validé et fonctionnel :

1. **Merger vers master** (déploiement production)
```bash
git checkout master
git merge develop
git push origin master
```

2. **Staging sera automatiquement détruit** après le déploiement production ✅

3. **Production surveillée 24/7** avec health check et auto-healing ✅

Besoin d'aide ? Consultez :
- [REGISTRATION_PROBLEM_IDENTIFIED.md](REGISTRATION_PROBLEM_IDENTIFIED.md)
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
