# 🔄 Flux d'Automatisation SecureVault

## Vue d'ensemble

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
                                           🏥 Health Check 24/7
```

## Workflow Détaillé

### 1. DÉVELOPPEMENT (develop)

```
Developer
   ↓
┌──────────────────────────────────────┐
│ git checkout develop                 │
│ git checkout -b feature/xyz          │
│ # Code changes                       │
│ git commit -m "feat: xyz"            │
│ git push origin feature/xyz          │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ Pull Request: feature → develop      │
│ • Code Review                        │
│ • CI Validation                      │
│ • Merge                              │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ git push origin develop              │
└──────────────────────────────────────┘
```

**Déclenchement automatique :**

```
GitHub Actions: securevault-deploy.yml
   ↓
┌──────────────────────────────────────┐
│ 1️⃣  Validate VPS Configuration       │
│    • Check SSH access                │
│    • Check directories               │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ 2️⃣  Run Tests                         │
│    • npm test (backend)              │
│    • npm test (frontend)             │
│    • Security checks                 │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ 3️⃣  Cleanup Old Containers            │
│    • Stop old containers             │
│    • Remove unused images            │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ 4️⃣  Deploy to STAGING                 │
│    • Pull latest code                │
│    • Build Docker images             │
│    • Run migrations (auto-detect)    │
│    • docker compose up -d            │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ 5️⃣  Post-Verification                 │
│    • Health check endpoints          │
│    • Verify containers running       │
│    • Check database connection       │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ ✅ STAGING DEPLOYED                   │
│ 📍 https://vault-staging.freijstack.com
│ 📍 https://vault-api-staging.freijstack.com
└──────────────────────────────────────┘
```

### 2. TESTS SUR STAGING

```
┌──────────────────────────────────────┐
│ Manual Testing on Staging            │
│ • Feature validation                 │
│ • Integration tests                  │
│ • User acceptance                    │
└──────────────────────────────────────┘
   ↓
Tests OK? ──┐
            │
         [YES]  [NO]
            │    │
            │    └──> Fix bugs on develop ──┐
            │                                │
            └──────────────────────────<────┘
```

### 3. DÉPLOIEMENT PRODUCTION (master)

```
┌──────────────────────────────────────┐
│ git checkout master                  │
│ git merge develop                    │
│ git push origin master               │
└──────────────────────────────────────┘
   ↓
GitHub Actions: securevault-deploy.yml
   ↓
┌──────────────────────────────────────┐
│ 1️⃣  Validate (same as staging)        │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ 2️⃣  Test (same as staging)            │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ 3️⃣  Cleanup (same as staging)         │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ 4️⃣  Deploy to PRODUCTION              │
│    • Pull latest code                │
│    • Build Docker images             │
│    • Run migrations (auto-detect)    │
│    • docker compose up -d            │
│    • /srv/www/securevault            │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ 5️⃣  Post-Verification                 │
│    • Health check production         │
│    • Verify all services up          │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ 6️⃣  🔥 DESTROY STAGING                │
│                                      │
│  if (push to master) {               │
│    • Stop staging containers         │
│    • Remove staging containers       │
│    • Remove staging network          │
│    • Keep volumes (safety)           │
│  }                                   │
└──────────────────────────────────────┘
   ↓
┌──────────────────────────────────────┐
│ ✅ PRODUCTION DEPLOYED                │
│ 🔥 STAGING DESTROYED                 │
│ 📍 https://vault.freijstack.com      │
│ 📍 https://vault-api.freijstack.com  │
└──────────────────────────────────────┘
```

## Health Check Continu (24/7)

```
┌────────────────────────────────────────────────────┐
│  Production Health Check (toutes les 15 minutes)   │
└────────────────────────────────────────────────────┘
                     ↓
        ┌────────────────────────┐
        │ GitHub Actions: Cron   │
        │ */15 * * * *           │
        └────────────────────────┘
                     ↓
    ┌────────────────────────────────┐
    │ 1. Check Frontend              │
    │    GET https://vault.freijstack.com
    │    Expected: HTTP 200          │
    └────────────────────────────────┘
                     ↓
    ┌────────────────────────────────┐
    │ 2. Check Backend API           │
    │    GET /api/health             │
    │    Expected: HTTP 200          │
    └────────────────────────────────┘
                     ↓
    ┌────────────────────────────────┐
    │ 3. Check Database              │
    │    pg_isready -U securevault   │
    │    Expected: "accepting"       │
    └────────────────────────────────┘
                     ↓
              [All OK?]
                /    \
            [YES]    [NO]
              ↓       ↓
         ┌───────────────────────┐
         │ ✅ All Healthy        │
         │ Continue monitoring   │
         └───────────────────────┘
                                  ↓
                     ┌──────────────────────────┐
                     │ 🔧 AUTO-HEAL             │
                     │                          │
                     │ 1. SSH to VPS            │
                     │ 2. docker compose restart│
                     │ 3. Wait 30s              │
                     │ 4. Re-check health       │
                     └──────────────────────────┘
                                  ↓
                            [Healed?]
                              /    \
                          [YES]    [NO]
                            ↓       ↓
                ┌────────────────────────────┐
                │ ✅ Auto-heal successful    │
                │ Resume monitoring          │
                └────────────────────────────┘
                                              ↓
                              ┌─────────────────────────┐
                              │ 🚨 ALERT                │
                              │ Manual intervention     │
                              │ required!               │
                              └─────────────────────────┘
```

## État des Environnements

### Avant Merge (develop actif)

```
┌────────────────────────────────────────────────────────┐
│                    VPS: freijstack                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  /srv/www/securevault-staging (ACTIF)                 │
│  ├── securevault-staging-backend                      │
│  ├── securevault-staging-frontend                     │
│  └── securevault-staging-postgres                     │
│  📍 https://vault-staging.freijstack.com               │
│                                                        │
│  /srv/www/securevault (ACTIF)                         │
│  ├── securevault-backend                              │
│  ├── securevault-frontend                             │
│  └── securevault-postgres                             │
│  📍 https://vault.freijstack.com                       │
│  🏥 Health check: ✅                                   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Après Merge vers Master (staging détruit)

```
┌────────────────────────────────────────────────────────┐
│                    VPS: freijstack                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  /srv/www/securevault-staging (VIDE)                  │
│  ❌ Containers détruits                                │
│  ❌ Network supprimé                                   │
│  💾 Volumes préservés (sécurité)                       │
│                                                        │
│  /srv/www/securevault (ACTIF)                         │
│  ├── securevault-backend                              │
│  ├── securevault-frontend                             │
│  └── securevault-postgres                             │
│  📍 https://vault.freijstack.com                       │
│  🏥 Health check: ✅                                   │
│  🔄 Dernière version de develop déployée              │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Timeline Exemple

```
09:00 │ Developer commits sur develop
      │ git push origin develop
      │
09:02 │ GitHub Actions: Déploiement staging démarre
      │ • Validation
      │ • Tests
      │ • Build
      │ • Deploy
      │
09:05 │ ✅ Staging déployé
      │ 📍 https://vault-staging.freijstack.com
      │
09:10 │ Tests manuels sur staging
      │ • Feature validation
      │ • Bug fixes si nécessaire
      │
11:00 │ Staging validé, prêt pour production
      │ git checkout master
      │ git merge develop
      │ git push origin master
      │
11:02 │ GitHub Actions: Déploiement production démarre
      │ • Validation
      │ • Tests
      │ • Build
      │ • Deploy production
      │
11:05 │ ✅ Production déployée
      │ 📍 https://vault.freijstack.com
      │
11:06 │ 🔥 Staging destruction démarre
      │ • Stop containers
      │ • Remove containers
      │ • Remove network
      │
11:07 │ ✅ Staging détruit
      │ Production seule active
      │
11:15 │ 🏥 Health check automatique #1
11:30 │ 🏥 Health check automatique #2
11:45 │ 🏥 Health check automatique #3
12:00 │ 🏥 Health check automatique #4
      │ ... (toutes les 15 min)
```

## Sauvegardes Automatiques

```
Tous les jours à 03:00 UTC
         ↓
┌──────────────────────────────────┐
│ GitHub Actions: Backup           │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ 1. Dump PostgreSQL               │
│    • Production: securevault     │
│    • Staging: securevault_staging│
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ 2. Compress (gzip)               │
│    securevault_prod_2025-12-29.sql.gz
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ 3. Upload to Cloud               │
│    • AWS S3                      │
│    • Azure Blob                  │
│    • Google Cloud Storage        │
│    • Backblaze B2                │
│    • DigitalOcean Spaces         │
│    • Wasabi                      │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ 4. Cleanup Old Backups           │
│    Keep last 30 days             │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ 5. Notification                  │
│    • Slack/Discord               │
│    • Status in GitHub Actions    │
└──────────────────────────────────┘
```

## Résumé Visuel

```
╔═══════════════════════════════════════════════════════════╗
║              AUTOMATISATION COMPLÈTE                      ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  DÉVELOPPEMENT                                            ║
║  └─> Push develop ──> Staging déployé automatiquement    ║
║                                                           ║
║  PRODUCTION                                               ║
║  └─> Merge master ──> Production déployée automatiquement║
║                  └──> Staging détruit automatiquement    ║
║                                                           ║
║  SURVEILLANCE                                             ║
║  └─> Health check toutes les 15 minutes                  ║
║      └─> Auto-healing si problème                        ║
║                                                           ║
║  SAUVEGARDES                                              ║
║  └─> Backup quotidien vers multi-cloud (03:00)           ║
║                                                           ║
║  INTERVENTIONS MANUELLES REQUISES                         ║
║  └─> AUCUNE ! 🎉                                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```
