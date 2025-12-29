# 🤖 GitHub Actions Workflows - FreijStack

Documentation complète des workflows CI/CD et automatisations du projet.

---

## 📋 Liste des Workflows

| Workflow | Fichier | Déclencheur | Durée | Description |
|----------|---------|-------------|-------|-------------|
| **CI/CD Pipeline** | [main.yml](main.yml) | Push master/develop, PR | ~5-8 min | Build, test, security scan, deploy VPS + GitHub Pages |
| **PR Title Automation** | [pr-title-automation.yml](pr-title-automation.yml) | Ouverture PR | ~10s | Auto-format titre PR avec Conventional Commits |

---

## 🚀 Workflow 1: CI/CD Pipeline

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

#### 1️⃣ **Validate & Lint** (~1 min)

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

#### 2️⃣ **Build & Optimize** (~1 min)

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

#### 3️⃣ **Security Scanning** (~2-3 min)

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

#### 4️⃣ **Deploy GitHub Pages** (~30s)

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

#### 5️⃣ **Deploy VPS Production/Staging** (~1-2 min)

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

#### 6️⃣ **Post-Deploy Cleanup** (~10s)

**Objectif** : Nettoyer artefacts temporaires

**Actions**:
```bash
rm -rf portfolio/*.min.css portfolio/*.min.js
rm -rf ~/.ssh/id_rsa
```

---

## 🤖 Workflow 2: PR Title Automation

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

## 📊 Monitoring & Métriques

### GitHub Actions Dashboard

**URL** : https://github.com/christophe-freijanes/freijstack/actions

**Métriques** :
- ✅ **Success Rate** : Suivi du taux de réussite des workflows
- ⏱️ **Durée moyenne** : ~5-8 minutes (CI/CD complet)
- 🔄 **Runs/jour** : Variable selon activité développement

### Badges dans README

```markdown
[![CI/CD Pipeline](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/main.yml?branch=master&label=CI%2FCD&style=flat-square)](https://github.com/christophe-freijanes/freijstack/actions)

[![CodeQL](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/main.yml?branch=master&label=CodeQL&style=flat-square&logo=github)](https://github.com/christophe-freijanes/freijstack/security/code-scanning)
```

---

## 🔧 Configuration Locale

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

## 🔐 Secrets Configuration

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

## 🐛 Troubleshooting

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

## 📚 Ressources

- **GitHub Actions Docs** : https://docs.github.com/en/actions
- **Conventional Commits** : https://www.conventionalcommits.org/
- **Gitleaks** : https://github.com/gitleaks/gitleaks
- **CodeQL** : https://codeql.github.com/docs/
- **Trivy** : https://aquasecurity.github.io/trivy/

---

## 📝 Changelog Workflows

### Version 1.2.0 (2025-12-28)
- ✨ Ajout workflow PR title automation
- 🔧 Simplification template PR (10 checks critiques)

### Version 1.1.0 (2025-12-20)
- 🔐 Ajout CodeQL + Trivy scanning
- 📊 Métriques durée jobs
- 🚀 Déploiement staging automatique

### Version 1.0.0 (2025-12-01)
- 🎉 Pipeline CI/CD initial
- 🔄 Déploiement production VPS
- 📄 GitHub Pages déploiement

---

**Auteur** : Christophe FREIJANES  
**Dernière mise à jour** : Décembre 2025  
**Version** : 1.2.0
