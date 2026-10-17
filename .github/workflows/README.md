<a id="-github-actions-workflows---freijstack"></a>
# GitHub Actions Workflows - FreijStack

Workflows CI/CD et automatisations du projet.

**Dernière mise à jour**: Janvier 2026  
**Version**: 2.0.0 - DevSecOps Unified Architecture  
**Workflows actifs**: 21+

---

<a id="-liste-complète-des-workflows"></a>
## Workflows

> **Note**: Workflows applicatifs (Portfolio, SecureVault, Registry) utilisent maintenant `00-core-full-deploy.yml` pour une pipeline DevSecOps unifiée. Voir docs-private/DEVOPS_PIPELINES.md (document interne non publié) pour les détails techniques.

| Workflow | Fichier | Déclencheur | Durée | Description |
|----------|---------|-------------|-------|-------------|
| **Infrastructure Deploy**| [02-infra-deploy.yml](02-infra-deploy.yml) | Push master/develop (base-infra/*), manuel | ~3-5 min | Déploiement Traefik, n8n, portfolio |
| **SecureVault Deploy**| [03-app-securevault-deploy.yml](03-app-securevault-deploy.yml) | Push develop (auto), manuel (prod) | ~5-7 min | Wrapper → 00-core-full-deploy.yml + migrations |
| **Registry Build**| 03-app-registry-build.yml (absent du dépôt) | Push registry/*, manuel | ~2-3 min | Build images Docker Registry |
| **Registry Deploy**| [03-app-registry-deploy.yml](03-app-registry-deploy.yml) | Push master (registry/*), manuel | ~3-4 min | Wrapper → 00-core-full-deploy.yml + HAProxy |
| **Registry Cleanup**| [03-app-registry-cleanup.yml](03-app-registry-cleanup.yml) | Schedule (weekly), manuel | ~2-3 min | Nettoyage images obsolètes Registry |
| **Portfolio Build**| [03-app-portfolio-build.yml](03-app-portfolio-build.yml) | Push portfolio/*, manuel | ~2-3 min | Build frontend Portfolio |
| **Portfolio Deploy**| [03-app-portfolio-deploy.yml](03-app-portfolio-deploy.yml) | Push master/develop (portfolio/*), manuel | ~4-6 min | Wrapper → 00-core-full-deploy.yml + frontend build |
| **Secret Rotation**| [06-maint-rotate-secrets.yml](06-maint-rotate-secrets.yml) | Schedule (1er du mois), manuel | ~3-5 min | Rotation automatique des secrets |
| **Backup**| [06-maint-backup.yml](06-maint-backup.yml) | Schedule (daily 2AM), manuel | ~5-10 min | Backup bases + certificats → S3/Azure |
| **CodeQL Analysis**| [01-security-codeql.yml](01-security-codeql.yml) | Push, PR, schedule | ~10-15 min | SAST security scanning |
| **Security Score**| [01-security-publish-score.yml](01-security-publish-score.yml) | Après healthcheck | ~2 min | Gitleaks + Trivy → badge publication |
| **✅ Lint** | [01-quality-lint.yml](01-quality-lint.yml) | Push, PR | ~1-2 min | Lint markdown, YAML, code |
| **Healthcheck Prod**| [05-health-prod.yml](05-health-prod.yml) | Schedule (30min) | ~30s | Monitoring production 24/7 |
| **Healthcheck Post-Deploy**| [04-health-postdeploy.yml](04-health-postdeploy.yml) | Après déploiement | ~1 min | Smart cooldown validation |
| **Docs Generate**| [08-support-docs-generate.yml](08-support-docs-generate.yml) | Push docs/*, manuel | ~2-3 min | Génération documentation |
| **Release Automation**| [07-release-automation.yml](07-release-automation.yml) | Push master | ~2-3 min | Semantic versioning + changelog |
| **Release Changelog PR**| [07-release-changelog-pr.yml](07-release-changelog-pr.yml) | Manuel | ~1 min | PR changelog draft |
| **PR Title Automation**| [08-support-pr-title.yml](08-support-pr-title.yml) | Ouverture PR | ~10s | Auto-format titre PR (Conventional Commits) |
| **Core Full Deploy**| [00-core-full-deploy.yml](00-core-full-deploy.yml) | Déclenché par wrappers | ~8-12 min | Orchestrateur déploiement unifié apps |
| **Core Deploy Queue**| [00-core-deploy-queue.yml](00-core-deploy-queue.yml) | Déclenché par wrappers | ~2-3 min | Orchestrateur file d'attente déploiement |

---

<a id="-workflow-1-securevault-deployment"></a>
## Workflow 1: SecureVault Deployment

> **Note** : Depuis 2026, les workflows applicatifs (Portfolio, Registry, SecureVault) utilisent des wrappers qui déclenchent `00-core-full-deploy.yml` pour un pipeline DevSecOps unifié. Voir DEVOPS_PIPELINES.md (document interne non publié) pour l'architecture détaillée.

### Déclencheurs

```yaml
on:
  push:
    branches: [develop, master]
    paths:
      - 'saas/securevault/**'
  workflow_dispatch: # Déploiement manuel
```

**Branches**:
- `develop` → Déploiement automatique **STAGING** (vault-staging.freijstack.com)
- `master` → **AUCUN** déploiement automatique (protection production)
- **workflow_dispatch** → Déploiement manuel avec choix environnement

### Jobs Pipeline (2 étapes)

#### 1 **Test & Build** (~2-3 min)

**Objectif**: Tester backend/frontend, builder images Docker, scanner sécurité

**Actions**:
- `npm install && npm test` (Backend Node.js 18)
- `npm install && npm test` (Frontend React 18)
- `docker build` (Backend et Frontend)
- **Trivy scan** sur les images Docker
- Upload résultats vers GitHub Security

**Sortie**:
- ✅ Tests passés
- ✅ Lint OK
- ✅ Docker images buildées
- ✅ Vulnérabilités scannées

#### 2 **Deploy to VPS** (~1-2 min)

**Objectif**: Déployer sur le VPS via SSH

**Actions**:
1. SSH connexion au VPS (user@host)
2. Git pull/clone du repo
3. `docker-compose up -d --build`
4. Health check API (`/health`)
5. Afficher les logs

**Environnements**:
- `staging`: `/app/securevault-staging`
- `production`: `/app/securevault-prod`

---

<a id="-workflow-2-portfolio-deploy"></a>
## Workflow 2: Portfolio Deploy

> **Nouveau** : Build et déploiement Portfolio sont séparés (`03-app-portfolio-build.yml` et `03-app-portfolio-deploy.yml`).
<a id="-workflow-3-registry-build--deploy"></a>
## Workflow 3: Registry Build & Deploy

### Déclencheurs Build

```yaml
on:
  push:
    branches: [master, develop]
    paths:
      - 'saas/registry/**'
  workflow_dispatch:
```

### Déclencheurs Deploy

```yaml
on:
  push:
    branches: [master]
    paths:
      - 'saas/registry/**'
  workflow_dispatch:
```

### Déclencheur Cleanup

```yaml
on:
  schedule:
    - cron: '0 3 * * 0'  # chaque dimanche 3h UTC
  workflow_dispatch:
```

### Jobs principaux

#### Build Registry
- Build images Docker Registry
- Scan sécurité (Trivy)
- Push images sur registry interne

#### Deploy Registry
- Déploiement via SSH sur VPS
- Healthcheck API

#### Cleanup Registry
- Suppression images obsolètes
- Nettoyage storage Docker

**Secrets requis** :
- `REGISTRY_SSH_KEY`, `REGISTRY_HOST`, `REGISTRY_USER`
<a id="-workflow-4-orchestrateurs-core"></a>
## Workflow 4: Orchestrateurs Core

### 00-core-full-deploy.yml

Orchestre le déploiement complet des applications (Portfolio, Registry, SecureVault) via des jobs parallèles et séquentiels.

**Déclencheurs** :
- Appelé par les wrappers applicatifs (dispatch)

**Étapes principales** :
- Build images
- Tests & lint
- Scans sécurité
- Déploiement sur VPS
- Healthchecks

### 00-core-deploy-queue.yml

Gère la file d'attente de déploiement pour éviter les conflits entre jobs concurrents.

**Déclencheurs** :
- Appelé par les wrappers applicatifs

**Étapes principales** :
- Lock file
- Attente slot libre
- Dispatch déploiement

### Déclencheurs

```yaml
on:
  push:
    branches: [master, develop]
  pull_request:
    branches: [master, develop]
```

**Branches**:
- `master` → Déploiement **production** (portfolio.freijstack.com)
- `develop` → Déploiement **staging** (portfolio-staging.freijstack.com)

### Jobs Pipeline (6 étapes)

#### 1 **Validate & Lint** (~1 min)

**Objectif** : Valider HTML, CSS, JavaScript

**Actions**:
```bash
npm install -g html-validate stylelint eslint
html-validate portfolio/index.html
stylelint portfolio/style.css
eslint portfolio/script.js
```

**Résultats** :
- ✅ HTML5 valid
- ✅ CSS sans erreurs
- ✅ JavaScript lint OK

---

#### 2 **Build & Optimize** (~1 min)

**Objectif** : Minifier CSS/JS, optimiser images

**Actions**:
```bash
npm install -g clean-css-cli terser
cleancss -o portfolio/style.min.css portfolio/style.css
terser portfolio/script.js -o portfolio/script.min.js --compress --mangle
```

**Artefacts**:
- `portfolio/style.min.css` (réduction ~40%)
- `portfolio/script.min.js` (réduction ~30%)

---

#### 3 **Security Scanning** (~2-3 min)

**Objectif** : Détecter secrets, vulnérabilités, failles SAST

**Tools**:

| Tool | Usage | Seuil Blocage |
|------|-------|---------------|
| **Gitleaks** | Détection secrets (API keys, passwords) | 0 erreur |
| **CodeQL** | Analyse statique (JavaScript/HTML) | 0 critique |
| **Trivy** | Scan vulnérabilités (Dockerfile, dependencies) | 0 haute/critique |

**Commandes**:
```bash
# Gitleaks
docker run ghcr.io/gitleaks/gitleaks:latest detect --source . --verbose

# CodeQL
github/codeql-action/analyze@v3

# Trivy
docker run aquasec/trivy:latest fs --severity HIGH,CRITICAL .
```

**Échec si** :
- Secrets détectés (Gitleaks)
- Vulnérabilités critiques (CodeQL, Trivy)

---

#### 4 **Deploy GitHub Pages** (~30s)

**Objectif** : Déployer version statique sur GitHub Pages

**Condition** : Uniquement si `push master`

**Actions**:
```bash
# Copier fichiers portfolio
cp -r portfolio/* docs/

# GitHub Actions automatise le reste
- uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./docs
```

**URL** : https://christophe-freijanes.github.io/freijstack/

---

#### 5 **Deploy VPS Production/Staging** (~1-2 min)

**Objectif** : Déployer sur VPS via SSH + rsync

**Branches**:
- `master` → `/srv/www/portfolio` (production)
- `develop` → `/srv/www/portfolio-staging` (staging)

**Actions**:
```bash
# Configuration SSH
mkdir -p ~/.ssh
echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# Backup avant déploiement
ssh deploy@VPS "cp -r /srv/www/portfolio /home/deploy/backups/portfolio_$(date +%Y%m%d_%H%M%S)"

# Rsync déploiement
rsync -avz --delete \
  --exclude='.git' --exclude='node_modules' \
  portfolio/ deploy@VPS:/srv/www/portfolio/

# Vérification
curl -I https://portfolio.freijstack.com
```

**Secrets Requis**:
- `SSH_PRIVATE_KEY` : Clé privée SSH (ed25519)
- `SSH_HOST` : IP ou hostname VPS
- `SSH_USERNAME` : Utilisateur SSH (ex: deploy)

**Rollback** : Backups disponibles dans `/home/deploy/backups/` (7 jours rétention)

---

#### 6 **Post-Deploy Cleanup** (~10s)

**Objectif** : Nettoyer artefacts temporaires

**Actions**:
```bash
rm -rf portfolio/*.min.css portfolio/*.min.js
rm -rf ~/.ssh/id_rsa
```

---

<a id="-workflow-5-secret-rotation"></a>
## Workflow 5: Secret Rotation

### Déclencheurs

```yaml
on:
  schedule:
    - cron: '0 2 1 * *'  # 1er du mois à 2h UTC
  workflow_dispatch:      # Déclenchement manuel
    inputs:
      environment:
        required: true
        type: choice
        options: ['staging', 'production']
      secret_type:
        required: true
        type: choice
        options: ['db_password', 'all']
```

**Calendrier**:
- **Automatique**: 1er du mois à 2h UTC (DB_PASSWORD seulement)
- **Manuel**: GitHub Actions → Rotate Secrets

### Processus Rotation

1. **Sauvegarde** : Backup du `.env` existant
2. **Génération** : Nouveaux secrets cryptographiquement sécurisés
3. **Mise à jour DB** : Change password PostgreSQL (si DB_PASSWORD)
4. **Redémarrage** : `docker-compose restart`
5. **Vérification** : Health check (API répond ✅)
6. **Rollback** : En cas d'erreur, restaure le backup

### Secrets Affectés

| Secret | Fréquence | Impact | Manuel |
|--------|-----------|--------|--------|
| **DB_PASSWORD** | 6 mois | Aucun (services internes) | ✅ |
| **JWT_SECRET** | Annuel | Tous les users re-login | ✅ |
| **ENCRYPTION_KEY** | Annuel | ⚠️ Perte d'accès aux données | ✅ |

Voir SECRET_ROTATION.md (document interne non publié) pour le guide détaillé.

---

<a id="-configuration-securevault-deployment"></a>
## Configuration SecureVault Deployment

### Secrets GitHub Requis

Créer dans **Settings → Secrets and variables → Actions**:

```yaml
VPS_HOST         # IP ou domaine du VPS
VPS_USER         # Utilisateur SSH (ex: ubuntu)
VPS_SSH_KEY      # Clé privée SSH (ed25519)
VPS_PORT         # Port SSH (optionnel, défaut 22)
```

### Structure VPS

```
/app/
├── securevault-prod/       # Production
│   └── saas/securevault/
│       ├── backend/
│       ├── frontend/
│       ├── docker-compose.yml
│       └── .env            # ⚠️ Créer manuellement
├── securevault-staging/    # Staging
│   └── [même structure]
```

### Configuration .env

**Production** (`/app/securevault-prod/saas/securevault/.env`):
```env
NODE_ENV=production
PORT=8080
DB_HOST=postgres
DB_USER=vault_prod
JWT_SECRET=<CHANGEZ_MOI>
ENCRYPTION_KEY=<CHANGEZ_MOI>
```

**Staging** (`/app/securevault-staging/saas/securevault/.env`):
```env
NODE_ENV=staging
PORT=8081
DB_HOST=postgres
DB_USER=vault_staging
JWT_SECRET=<CHANGEZ_MOI>
ENCRYPTION_KEY=<CHANGEZ_MOI>
```

Voir [SECUREVAULT_DEPLOYMENT.md](../../docs/02-deployment/SECUREVAULT_DEPLOYMENT.md) pour le guide.

---

<a id="-workflow-6-pr-title-automation"></a>
## Workflow 6: PR Title Automation

### Déclencheurs

```yaml
on:
  pull_request:
    types: [opened, reopened]
```

### Fonctionnement

**Étape 1** : Analyse du titre actuel
```javascript
const conventionalTypes = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert):/;
if (conventionalTypes.test(pr.title)) {
  // Déjà conforme → Skip
  return;
}
```

**Étape 2** : Analyse des fichiers modifiés
```javascript
const { data: files } = await github.rest.pulls.listFiles(...);
const filePaths = files.map(f => f.filename);
```

**Étape 3** : Détection intelligente du type

| Fichiers Modifiés | Type | Scope | Exemple Généré |
|-------------------|------|-------|----------------|
| `docs/` | `docs` | `documentation` | `docs(documentation): add monitoring guide` |
| `.github/workflows/` | `ci` | `github-actions` | `ci(github-actions): update pipeline` |
| `Dockerfile`, `docker-compose` | `build` | `docker` | `build(docker): upgrade nginx` |
| `portfolio/` | `feat` | `portfolio` | `feat(portfolio): add dark mode` |
| `saas/` | `feat` | `saas` | `feat(saas): add auth` |
| `*.md` | `docs` | - | `docs: update README` |
| `*.css` | `style` | `ui` | `style(ui): improve responsive` |
| `*.js` | `feat` | - | `feat: add new feature` |

**Étape 4** : Mise à jour du titre
```javascript
const newTitle = `${type}${scopePart}: ${pr.title}`;
await github.rest.pulls.update({
  pull_number: context.issue.number,
  title: newTitle
});
```

**Étape 5** : Commentaire explicatif
```markdown
🤖 **Titre de PR automatisé**

Le titre a été formaté selon Conventional Commits:

**Ancien titre**: `add monitoring guide`
**Nouveau titre**: `docs(documentation): add monitoring guide`

Types détectés:
- **Type**: `docs`
- **Scope**: `documentation`
- **Fichiers analysés**: 3

Vous pouvez modifier le titre manuellement si nécessaire.
```

### Conventional Commits Types

| Type | Usage | Exemple |
|------|-------|---------|
| `feat` | Nouvelle fonctionnalité | feat(portfolio): add contact form |
| `fix` | Correction de bug | fix(auth): resolve token expiration |
| `docs` | Documentation | docs: update deployment guide |
| `style` | CSS/UI (pas de logique) | style(ui): improve button hover |
| `refactor` | Restructuration code | refactor(api): optimize queries |
| `perf` | Performance | perf(portfolio): lazy load images |
| `test` | Tests | test(auth): add unit tests |
| `build` | Build/dépendances | build(docker): upgrade nginx |
| `ci` | CI/CD | ci: add CodeQL scan |
| `chore` | Maintenance | chore: update gitignore |

---

<a id="-monitoring--métriques"></a>
## Monitoring & Métriques

### GitHub Actions Dashboard

**URL** : https://github.com/christophe-freijanes/freijstack/actions

**Métriques** :
- ✅ **Success Rate** : Suivi du taux de réussite des workflows
- **Durée moyenne** : ~5-8 minutes (CI/CD complet)
- **Runs/jour** : Variable selon activité développement

### Badges dans README

```markdown
[![Portfolio Deploy](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/03-app-portfolio-deploy.yml?branch=master&label=Portfolio&style=flat-square)](https://github.com/christophe-freijanes/freijstack/actions)

[![SecureVault Deploy](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/03-app-securevault-deploy.yml?branch=develop&label=SecureVault&style=flat-square)](https://github.com/christophe-freijanes/freijstack/actions)

[![Secret Rotation](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/06-maint-rotate-secrets.yml?label=Secret%20Rotation&style=flat-square)](https://github.com/christophe-freijanes/freijstack/actions)
```

---

<a id="-configuration-locale"></a>
## Configuration Locale

### Tester Workflows Localement

**Act** (exécution locale des GitHub Actions) :

```bash
# Installation
winget install nektos/act

# Exécuter workflow localement
act push -j validate

# Avec secrets
act push -s GITHUB_TOKEN=ghp_xxx -j validate
```

### Linter YAML

```bash
# Installation
npm install -g yaml-lint

# Valider workflow
yaml-lint .github/workflows/*.yml
```

---

<a id="-secrets-configuration"></a>
## Secrets Configuration

### Secrets Requis

| Secret | Usage | Génération |
|--------|-------|------------|
| `SSH_PRIVATE_KEY` | Déploiement VPS | `ssh-keygen -t ed25519 -C "deploy@freijstack"` |
| `SSH_HOST` | IP/Hostname VPS | Fourni par hébergeur |
| `SSH_USERNAME` | User SSH | Créé sur VPS (`useradd deploy`) |
| `GITHUB_TOKEN` | API GitHub | Auto-généré par GitHub Actions |

### Ajouter Secrets

1. **GitHub** → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Name: `SSH_PRIVATE_KEY`
4. Value: Contenu de `~/.ssh/id_rsa`
5. **Add secret**

---

<a id="-troubleshooting"></a>
## Troubleshooting

### Échec Job "Security Scanning"

**Symptôme** : Gitleaks détecte un secret

**Solution** :
```bash
# Vérifier localement
docker run ghcr.io/gitleaks/gitleaks:latest detect --source . -v

# Supprimer secret de l'historique
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch fichier_avec_secret.txt" \
  --prune-empty --tag-name-filter cat -- --all
```

### Échec Déploiement VPS

**Symptôme** : `ssh: permission denied`

**Solution** :
```bash
# Re-copier clé SSH sur VPS
ssh-copy-id -i ~/.ssh/id_rsa.pub deploy@VPS_IP

# Vérifier permissions
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

### Timeout Workflow

**Symptôme** : Job dépasse 10 minutes

**Solution** :
```yaml
jobs:
  deploy:
    timeout-minutes: 15  # Augmenter timeout
```

---

<a id="-ressources"></a>
## Ressources

- **GitHub Actions Docs** : https://docs.github.com/en/actions
- **Conventional Commits** : https://www.conventionalcommits.org/
- **Gitleaks** : https://github.com/gitleaks/gitleaks
- **CodeQL** : https://codeql.github.com/docs/
- **Trivy** : https://aquasecurity.github.io/trivy/

---

<a id="-changelog-workflows"></a>
## Changelog Workflows

<a id="version-200-2026-01-03-"></a>
### Version 2.0.0 (2026-01-03)
- Ajout workflows Docker Registry (deploy + cleanup)
- Ajout workflows Portfolio (build + deploy séparés)
- Ajout workflows Backup automatisé (S3 + Azure)
- Ajout Security Score workflow
- Ajout workflows Health checks (prod + dev + post-deploy)
- Ajout Docs Generate workflow
- Ajout Release workflows (automation + changelog PR)
- Documentation de tous les workflows (21+)
- Mise à jour vers Janvier 2026

### Version 1.2.0 (2025-12-28)
- Ajout workflow PR title automation
- Simplification template PR (10 checks critiques)

### Version 1.1.0 (2025-12-20)
- Ajout CodeQL + Trivy scanning
- Métriques durée jobs
- Déploiement staging automatique

### Version 1.0.0 (2025-12-01)
- Pipeline CI/CD initial
- Déploiement production VPS
- GitHub Pages déploiement

---

**Auteur** : Christophe FREIJANES  
**Dernière mise à jour** : Janvier 2026  
**Version** : 2.0.0

**Statistiques**:
- 21+ workflows actifs
- ~50 jobs au total
- Support production + staging
- Monitoring 24/7 activé
- Security scanning quotidien

**Documentation Complète**:
- [Architecture CI/CD](../../docs/01-architecture/CI_CD_ARCHITECTURE.md) - Diagramme Mermaid + détails
- [Guide Automation](../../docs/03-guides/AUTOMATION_GUIDE.md) - Guide automatisation
- [Deployment Guide](../../docs/02-deployment/DEPLOYMENT.md) - Procédures de déploiement