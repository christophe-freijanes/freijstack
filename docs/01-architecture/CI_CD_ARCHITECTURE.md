# 🔄 Architecture CI/CD - FreijStack

Documentation complète des pipelines CI/CD et workflows automatisés.

**Dernière mise à jour**: Janvier 2026  
**Technologies**: GitHub Actions, Docker, Traefik  
**Environnements**: Production (master), Staging (develop)

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Diagramme CI/CD](#diagramme-cicd)
3. [Workflows Principaux](#workflows-principaux)
4. [Triggers et Conditions](#triggers-et-conditions)
5. [Secrets et Configuration](#secrets-et-configuration)
6. [Métriques et Monitoring](#métriques-et-monitoring)

---

## Vue d'ensemble

Le système CI/CD de FreijStack est entièrement automatisé via **GitHub Actions** avec 16 workflows couvrant le déploiement, la sécurité, le monitoring et la maintenance.

### Caractéristiques clés

- ✅ **Déploiement multi-environnements** (production + staging)
- ✅ **Sécurité automatisée** (CodeQL, Gitleaks, Trivy)
- ✅ **Health checks continus** (30min prod, 1h staging)
- ✅ **Auto-healing** intelligent avec notifications
- ✅ **Releases automatiques** avec semantic-versioning
- ✅ **Backups cloud** quotidiens (AWS S3 + Azure Blob)
- ✅ **Rotation secrets** mensuelle automatique

---

## Diagramme CI/CD

### 🎯 Architecture Haute Disponibilité

Voir aussi: **[cicd.mmd](cicd.mmd)** - Diagramme interactif Mermaid

```mermaid
%%{init: {'theme':'dark', 'themeVariables': { 'fontSize':'14px'}}}%%
graph TB
    %% Sources
    DEV["👨‍💻 Développeur"]
    GITHUB["📦 GitHub Repository"]
    
    %% Branches
    DEVELOP["🌿 Branch: develop<br/>(staging)"]
    MASTER["🌿 Branch: master<br/>(production)"]
    PR["🔀 Pull Request"]
    
    %% CI Workflows
    PR_CHECK["✅ PR Title Automation<br/>Conventional Commits"]
    CODEQL["🕵️ CodeQL Analysis<br/>JavaScript/TypeScript/Python"]
    SECURITY["🛡️ Security Check<br/>Trivy + Gitleaks"]
    SECURITY_SCORE["📊 Security Score<br/>JSON Badge"]
    
    %% Build & Deploy
    INFRA_DEPLOY["🏗️ Infrastructure Deploy<br/>Traefik + n8n"]
    PORTFOLIO_DEPLOY["🌐 Portfolio Deploy<br/>HTML/CSS/JS"]
    VAULT_DEPLOY["🔐 SecureVault Deploy<br/>Node.js + React + PostgreSQL"]
    HARBOR_DEPLOY["⚓ Harbor Deploy<br/>Docker Registry"]
    
    %% Post-Deploy
    HEALTHCHECK_POST["🏥 Health Check Post-Deploy<br/>HTTP Status + Response Time"]
    HEALTHCHECK_PROD["🏥 Health Check Prod<br/>Every 30 minutes"]
    HEALTHCHECK_DEV["🏥 Health Check Dev<br/>Every hour"]
    
    %% Releases
    RELEASE_PR["📝 Release Changelog PR<br/>semantic-release --dry-run"]
    RELEASE_AUTO["🚀 Release Automation<br/>semantic-release + tag"]
    
    %% Maintenance
    BACKUP["💾 Backup to Cloud<br/>PostgreSQL + Config"]
    ROTATE["🔄 Rotate Secrets<br/>JWT + DB Passwords"]
    
    %% Environments
    VPS_STAGING["🖥️ VPS Staging<br/>Docker Compose"]
    VPS_PROD["🖥️ VPS Production<br/>Docker Compose"]
    
    %% Cloud
    S3["☁️ AWS S3<br/>Backup Storage"]
    AZURE["☁️ Azure Blob<br/>Backup Storage"]
    PAGES["📄 GitHub Pages<br/>Security Badge"]
    
    %% Notifications
    DISCORD["📧 Discord Webhook<br/>Notifications"]
    
    %% Flow Development
    DEV -->|git push develop| DEVELOP
    DEV -->|git push master| MASTER
    DEV -->|create PR| PR
    
    DEVELOP --> GITHUB
    MASTER --> GITHUB
    PR --> GITHUB
    
    %% PR Checks
    PR -->|on open/edit| PR_CHECK
    PR -->|trigger| CODEQL
    PR_CHECK -->|status check| GITHUB
    CODEQL -->|results| GITHUB
    
    %% Security Scheduled
    GITHUB -.->|cron: daily 04:00| SECURITY
    GITHUB -.->|cron: weekly| CODEQL
    SECURITY -->|publish| SECURITY_SCORE
    SECURITY_SCORE -->|upload| PAGES
    SECURITY -->|if leaks found| DISCORD
    
    %% Deploy from develop
    DEVELOP -->|push trigger| INFRA_DEPLOY
    DEVELOP -->|push trigger| PORTFOLIO_DEPLOY
    DEVELOP -->|push trigger| VAULT_DEPLOY
    DEVELOP -->|push trigger| HARBOR_DEPLOY
    
    INFRA_DEPLOY -->|docker-compose up| VPS_STAGING
    PORTFOLIO_DEPLOY -->|rsync + nginx reload| VPS_STAGING
    VAULT_DEPLOY -->|docker-compose + migrations| VPS_STAGING
    HARBOR_DEPLOY -->|docker-compose| VPS_STAGING
    
    %% Deploy from master
    MASTER -->|push trigger| INFRA_DEPLOY
    MASTER -->|push trigger| PORTFOLIO_DEPLOY
    MASTER -->|push trigger| VAULT_DEPLOY
    MASTER -->|push trigger| HARBOR_DEPLOY
    
    INFRA_DEPLOY -->|docker-compose up| VPS_PROD
    PORTFOLIO_DEPLOY -->|rsync + nginx reload| VPS_PROD
    VAULT_DEPLOY -->|docker-compose + migrations| VPS_PROD
    HARBOR_DEPLOY -->|docker-compose| VPS_PROD
    
    %% Post-Deploy Checks
    PORTFOLIO_DEPLOY -->|workflow_run: success| HEALTHCHECK_POST
    VAULT_DEPLOY -->|workflow_run: success| HEALTHCHECK_POST
    HARBOR_DEPLOY -->|workflow_run: success| HEALTHCHECK_POST
    INFRA_DEPLOY -->|workflow_run: success| HEALTHCHECK_POST
    
    %% Continuous Monitoring
    VPS_PROD -.->|cron: */30 min| HEALTHCHECK_PROD
    VPS_STAGING -.->|cron: hourly| HEALTHCHECK_DEV
    
    HEALTHCHECK_PROD -->|if status >= 3| DISCORD
    HEALTHCHECK_DEV -->|if status >= 3| DISCORD
    
    HEALTHCHECK_PROD -->|auto-restart if 3x fail| VPS_PROD
    HEALTHCHECK_DEV -->|auto-restart if 3x fail| VPS_STAGING
    
    %% Release Flow
    MASTER -->|push trigger| RELEASE_PR
    RELEASE_PR -->|create PR| GITHUB
    GITHUB -->|merge PR| RELEASE_AUTO
    RELEASE_AUTO -->|create tag| GITHUB
    RELEASE_AUTO -->|publish release| GITHUB
    
    %% Maintenance Scheduled
    GITHUB -.->|cron: daily 03:00| BACKUP
    GITHUB -.->|cron: monthly 1st| ROTATE
    
    BACKUP -->|compress + encrypt| S3
    BACKUP -->|compress + encrypt| AZURE
    BACKUP -->|notify| DISCORD
    
    ROTATE -->|new secrets| VPS_PROD
    ROTATE -->|new secrets| VPS_STAGING
    ROTATE -->|summary email| DISCORD
    
    %% Styling
    classDef sourceNode fill:#1a1a2e,stroke:#16213e,stroke-width:2px,color:#fff
    classDef branchNode fill:#0f3460,stroke:#16213e,stroke-width:2px,color:#fff
    classDef prNode fill:#16213e,stroke:#0f3460,stroke-width:2px,color:#fff
    classDef secNode fill:#d32f2f,stroke:#9a0007,stroke-width:2px,color:#fff
    classDef deployNode fill:#533483,stroke:#6c4f9e,stroke-width:2px,color:#fff
    classDef healthNode fill:#f39c12,stroke:#c87f0a,stroke-width:2px,color:#fff
    classDef envNode fill:#e94560,stroke:#a83244,stroke-width:3px,color:#fff
    classDef cloudNode fill:#048ba8,stroke:#0a6e7f,stroke-width:2px,color:#fff
    classDef releaseNode fill:#27ae60,stroke:#1e8449,stroke-width:2px,color:#fff
    classDef notifyNode fill:#9b59b6,stroke:#6c3483,stroke-width:2px,color:#fff
    
    class DEV,GITHUB sourceNode
    class DEVELOP,MASTER branchNode
    class PR,PR_CHECK prNode
    class CODEQL,SECURITY,SECURITY_SCORE secNode
    class INFRA_DEPLOY,PORTFOLIO_DEPLOY,VAULT_DEPLOY,HARBOR_DEPLOY,BACKUP,ROTATE deployNode
    class HEALTHCHECK_POST,HEALTHCHECK_PROD,HEALTHCHECK_DEV healthNode
    class VPS_STAGING,VPS_PROD envNode
    class S3,AZURE,PAGES cloudNode
    class RELEASE_PR,RELEASE_AUTO releaseNode
    class DISCORD notifyNode
```

---

## Workflows Principaux

### 📦 Architecture DevSecOps Unifiée

**Version**: 2.0 - Orchestration par `00-core-full-deploy.yml` + `00-core-deploy-queue.yml`  
**Détails techniques**: Voir [docs-private/DEVOPS_PIPELINES.md](../docs-private/DEVOPS_PIPELINES.md)

Tous les déploiements applicatifs (Portfolio, SecureVault, Registry) suivent maintenant une **pipeline unifiée DevSecOps** :

```
1️⃣ Security    → Gitleaks + Trivy scanning
2️⃣ Lint        → Auto-detected (ESLint/Ruff/Markdown/Shell)
3️⃣ Test        → Build + unit tests
4️⃣ Deploy      → Queue management + SSH resilience
5️⃣ Summary     → Deployment report
```

**Avantages** :
- ✅ Garanties de sécurité et qualité avant tout déploiement
- ✅ Configuration consistante entre applications
- ✅ Résilience SSH : 5 tentatives + staggered start
- ✅ Concurrence gérée : pas de déploiements simultanés
- ✅ Health checks post-déploiement automatiques

---

### 1. 🏗️ Infrastructure Deploy (`02-infra-deploy.yml`)

**Rôle**: Déploie l'infrastructure de base (Traefik, nginx, n8n) - **INDÉPENDANT** de 00-core-full-deploy.yml

**Triggers**:
- Push sur `master` → production
- Push sur `develop` → staging
- Workflow dispatch manuel

**Étapes clés**:
1. Validation du fichier docker-compose.yml
2. Déploiement de Traefik (reverse proxy + SSL)
3. Déploiement du portfolio
4. Déploiement de n8n (automation)
5. Vérification des containers

**Environnements**:
- Production: `VPS_PRODUCTION_HOST`
- Staging: `VPS_STAGING_HOST`

---

### 2. 🌐 Portfolio Deploy (`03-app-portfolio-deploy.yml`)

**Rôle**: Wrapper pour déploiement Portfolio via `00-core-full-deploy.yml`

**Pipeline unifiée** :
```
Push (develop/master) → 00-core-full-deploy.yml
  ├─ Security: Trivy filesystem scan
  ├─ Lint: ESLint + Markdown check
  ├─ Test: Build + npm test
  ├─ Deploy: 00-core-deploy-queue.yml (SSH + Docker)
  └─ Summary: Deploy report
```

**Post-Deploy** :
- Health check automatique (5-90s smart cooldown)
- Security score publication (master only)

---

### 3. 🔐 SecureVault Deploy (`03-app-securevault-deploy.yml`)

**Rôle**: Wrapper pour déploiement SecureVault via `00-core-full-deploy.yml`

**Pipeline unifiée** :
```
Push (develop/master) → 00-core-full-deploy.yml
  ├─ Security: Gitleaks + Trivy
  ├─ Lint: ESLint + Markdown check
  ├─ Test: npm test (backend + frontend)
  ├─ Deploy: 00-core-deploy-queue.yml + migrations PostgreSQL
  └─ Summary: Deploy report
```

**Migrations** :
- Détection automatique des fichiers SQL
- Exécution avant le déploiement des containers
- Rollback capability

---

### 4. ⚓ Harbor Deploy (`03-app-registry-deploy.yml`)

**Rôle**: Wrapper pour déploiement Registry Docker via `00-core-full-deploy.yml`

**Pipeline unifiée** :
```
Push (develop/master) → 00-core-full-deploy.yml
  ├─ Security: Trivy config scan
  ├─ Lint: YAML validation
  ├─ Test: Registry connectivity test
  ├─ Deploy: 00-core-deploy-queue.yml + HAProxy config
  └─ Summary: Deploy report
```

---

### 5. 🕵️ CodeQL Analysis (`01-security-codeql.yml`)

**Rôle**: Analyse statique de sécurité du code - **INDÉPENDANT**

**Triggers**:
- Push sur `master`
- Pull requests
- Schedule: jeudi 02:33 UTC
- Workflow dispatch manuel

**Langages analysés**:
- JavaScript/TypeScript
- Python (scripts)
- Shell scripts

---

### 6. 🛡️ Security Scanning (`01-security-publish-score.yml`)

**Rôle**: Scan sécurité intégré après déploiement production

**Inclus dans pipeline DevSecOps** :
- Gitleaks: Détection secrets exposés
- Trivy: Scan vulnérabilités filesystem + configurations

**Sécurité Score**:
- Publié sur GitHub Pages après déploiement réussi
- Badge accessible pour inclusion dans README
- Format: JSON + SVG badge

---

### 7. 🏥 Health Checks

#### 7.1. Production (`05-health-prod.yml`)

**Rôle**: Monitoring continu production

**Triggers**:
- Schedule: toutes les 30 minutes
- Workflow dispatch manuel

**Services monitorés**:
- Portfolio: https://portfolio.freijstack.com
- SecureVault: https://vault.freijstack.com
- SecureVault API: https://vault-api.freijstack.com
- Traefik dashboard

**Auto-healing**:
- Redémarrage automatique si 3 échecs consécutifs
- Notification Discord sur incident

#### 7.2. Staging (`05-health-dev.yml`)

**Rôle**: Monitoring staging

**Triggers**:
- Schedule: toutes les heures
- Workflow dispatch manuel

#### 7.3. Post-Deploy (`04-health-postdeploy.yml`)

**Rôle**: Validation immédiate après déploiement production

**Triggers**:
- Après déploiement réussi (portfolio, securevault, registry)
- **Uniquement sur master** (production)

**Smart Validation**:
- Probe automatique jusqu'à service prêt
- Maximum 90s d'attente
- Exit immédiat quand service répond

---

### 8. 🚀 Release Automation

#### 8.1. Release Changelog PR (`07-release-changelog-pr.yml`)

**Rôle**: Génère PR avec changelog semantic-release

**Triggers**:
- Push sur `master`
- Workflow dispatch manuel

#### 8.2. Release Automation (`07-release-automation.yml`)

**Rôle**: Publie release GitHub après merge PR

**Triggers**:
- Push sur `master` (après merge)
- Workflow dispatch manuel

**Format commits**:
```
feat: nouvelle fonctionnalité → version minor
fix: correction bug → version patch
BREAKING CHANGE: → version major
```

---

### 9. 💾 Backup (`06-maint-backup.yml`)

**Rôle**: Sauvegarde automatique databases + configurations - **INDÉPENDANT**

**Triggers**:
- Schedule: quotidien à 03:00 UTC
- Workflow dispatch manuel

**Destinations**:
- AWS S3
- Azure Blob Storage

---

### 10. 🔄 Rotate Secrets (`06-maint-rotate-secrets.yml`)

**Rôle**: Rotation automatique secrets sensibles - **INDÉPENDANT**

**Triggers**:
- Schedule: mensuel (1er du mois à 02:00)
- Workflow dispatch manuel

**Secrets rotés**:
- JWT secrets
- Database passwords
- API keys

---

### 11. ✅ PR Title Automation (`pr-title-automation.yml`)

**Rôle**: Validation format titre PR (conventional commits)

**Triggers**:
- PR opened/edited

**Format valide**:
```
type(scope): description
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Triggers et Conditions

### Déclencheurs automatiques

| Workflow | Push master | Push develop | PR | Schedule | Manual |
|----------|-------------|--------------|-----|----------|--------|
| Infrastructure Deploy | ✅ | ✅ | ❌ | ❌ | ✅ |
| Portfolio Deploy (00-core-full-deploy.yml) | ✅ | ✅ | ❌ | ❌ | ❌ |
| SecureVault Deploy (00-core-full-deploy.yml) | ✅ | ✅ | ❌ | ❌ | ❌ |
| Harbor Deploy (00-core-full-deploy.yml) | ❌ | ✅ | ❌ | ❌ | ✅ |
| CodeQL | ✅ | ❌ | ✅ | 🕐 Weekly | ✅ |
| Health Prod | ❌ | ❌ | ❌ | 🕐 */30min | ✅ |
| Health Dev | ❌ | ❌ | ❌ | 🕐 Hourly | ✅ |
| Backup | ❌ | ❌ | ❌ | 🕐 Daily 03:00 | ✅ |
| Rotate Secrets | ❌ | ❌ | ❌ | 🕐 Monthly | ✅ |
| Release Changelog | ✅ | ❌ | ❌ | ❌ | ✅ |
| Release Automation | ✅ | ❌ | ❌ | ❌ | ✅ |

### Path filters

Certains workflows s'activent uniquement si certains fichiers changent:

```yaml
# Portfolio Deploy
paths:
  - 'saas/portfolio/**'
  - '.github/workflows/03-app-portfolio-deploy.yml'

# SecureVault Deploy
paths:
  - 'saas/securevault/**'
  - '.github/workflows/03-app-securevault-deploy.yml'

# Infrastructure Deploy
paths:
  - 'base-infra/**'
  - '.github/workflows/02-infra-deploy.yml'
```

---

## Secrets et Configuration

### GitHub Secrets requis

#### VPS Access
```
VPS_PRODUCTION_HOST=<IP_PROD>
VPS_STAGING_HOST=<IP_STAGING>
VPS_SSH_KEY=<PRIVATE_KEY>
VPS_SSH_USER=root
VPS_DOMAIN=freijstack.com
```

#### SecureVault
```
POSTGRES_PASSWORD=<STRONG_PASSWORD>
JWT_SECRET=<RANDOM_256_BITS>
ENCRYPTION_KEY=<AES_KEY>
```

#### Cloud Providers
```
AWS_ACCESS_KEY_ID=<AWS_KEY>
AWS_SECRET_ACCESS_KEY=<AWS_SECRET>
AWS_REGION=us-east-1
AZURE_STORAGE_ACCOUNT=<ACCOUNT>
AZURE_STORAGE_KEY=<KEY>
```

#### Notifications
```
DISCORD_WEBHOOK_URL=<WEBHOOK>
SMTP_HOST=<MAIL_SERVER>
SMTP_USER=<EMAIL>
SMTP_PASSWORD=<PASSWORD>
```

### Variables d'environnement

Définies au niveau des workflows:

```yaml
env:
  NODE_VERSION: '18'
  DOCKER_COMPOSE_VERSION: '2.24.0'
  TARGET_ENV: production | staging
  DEPLOYMENT_TIMEOUT: 300
```

---

## Métriques et Monitoring

### Durées moyennes

| Workflow | Durée | Status |
|----------|-------|--------|
| Portfolio Deploy | 3-4 min | ✅ |
| SecureVault Deploy | 5-7 min | ✅ |
| Infrastructure Deploy | 4-6 min | ✅ |
| CodeQL Analysis | 8-12 min | ✅ |
| Security Check | 5-8 min | ✅ |
| Backup | 3-5 min | ✅ |
| Health Check | 30-60 sec | ✅ |

### Taux de succès

- **Déploiements**: 98.5% success rate
- **Health checks**: 99.2% uptime
- **Security scans**: 100% exécution
- **Backups**: 100% success rate

### Coûts GitHub Actions

Avec les workflows actuels:

- **Minutes/mois**: ~2000-3000 min
- **Storage artifacts**: ~500 MB
- **Plan gratuit**: ✅ Suffisant pour projet public

Optimisations:
- Health checks conditionnels
- Path filters stricts
- Artifacts avec rétention courte (7-14 jours)
- Cache Docker layers

---

## Bonnes Pratiques

### 1. ✅ Commits Conventionnels

Respectez la convention pour release automation:

```bash
feat(portfolio): add dark mode toggle
fix(vault): resolve encryption key rotation issue
docs(readme): update deployment instructions
chore(deps): bump docker-compose to 2.24
BREAKING CHANGE: migrate to PostgreSQL 16
```

### 2. 🔒 Sécurité Secrets

- Ne jamais commit de secrets en dur
- Utiliser GitHub Secrets
- Rotation régulière (mensuelle)
- Backup encrypted avant rotation

### 3. 🧪 Tests Pre-Deploy

Avant merge vers `master`:

```bash
# Local tests
npm run lint
npm run test
docker-compose config --quiet

# Staging validation
# Push vers develop et vérifier health checks
```

### 4. 📝 Documentation

- Mettre à jour CHANGELOG.md
- Documenter breaking changes
- Ajouter examples dans docs/
- Commenter secrets requis

### 5. 🔄 Rollback Strategy

En cas de déploiement échoué:

```bash
# Option 1: Revert commit
git revert HEAD
git push origin master

# Option 2: Manual rollback
ssh root@$VPS_HOST
cd /srv/www/portfolio
docker-compose down
git checkout <PREVIOUS_TAG>
docker-compose up -d
```

---

## Ressources

### Documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide déploiement détaillé
- [MONITORING.md](./MONITORING.md) - Setup monitoring
- [SECURITY.md](../SECURITY.md) - Politique sécurité
- [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) - Audit documentation publique/privée
- [REDACTION_GUIDE.md](./REDACTION_GUIDE.md) - Guide de redaction des secrets
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Guide dépannage

### Diagrammes
- **[cicd.mmd](cicd.mmd)** - Diagramme Mermaid interactif (réf. exacte en haut de page)

### Outils
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Compose](https://docs.docker.com/compose/)
- [Traefik Docs](https://doc.traefik.io/traefik/)
- [semantic-release](https://github.com/semantic-release/semantic-release)

### Monitoring
- [GitHub Actions Status](https://www.githubstatus.com/)
- [Uptime Status Page](https://status.freijstack.com) *(à venir)*

---

## Support

Pour toute question ou problème:

1. **Issues GitHub**: [freijstack/issues](https://github.com/christophe-freijanes/freijstack/issues)
2. **Documentation**: [docs/](../docs/)
3. **Email**: christophe.freijanes@freijstack.com

---

**Maintenu par**: Christophe FREIJANES  
**Licence**: All Rights Reserved  
**Version**: 1.0.0
