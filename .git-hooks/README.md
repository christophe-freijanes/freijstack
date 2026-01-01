# � Git Hooks

Git hooks personnalisés pour automatiser et valider les commits et pushes.

---

## 📋 Contenu

```
.git-hooks/
├── pre-commit              # Valide avant commit
├── commit-msg              # Valide message commit
├── pre-push                # Valide avant push
├── post-merge              # Actions après merge
└── README.md               # Ce fichier
```

---

## 🚀 Installation

### Automatique (Recommandé)

```bash
# Lors du clone
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack

# Installer les hooks
git config core.hooksPath .git-hooks
chmod +x .git-hooks/*
```

### Manuel

```bash
# Configuration Git
git config core.hooksPath .git-hooks

# Rendre exécutables
chmod +x .git-hooks/pre-commit
chmod +x .git-hooks/commit-msg
chmod +x .git-hooks/pre-push
chmod +x .git-hooks/post-merge
```

---

## 🔍 Hooks Disponibles

### 1. **pre-commit** - Validation avant Commit

Exécuté avant chaque `git commit`.

**Vérifie**:
- ✅ Pas de fichiers sensibles (.env, *.pem, *.key)
- ✅ Pas de secrets en plaintext (gitleaks)
- ✅ Syntax check (JS, YAML, JSON)
- ✅ Code formatting (prettier, eslint)
- ✅ Fichiers trop gros (> 50MB)
- ✅ LFS files si applicable

**Commande**:
```bash
git commit -m "feat: add new feature"
# → pre-commit hook runs automatically
# → If check fails: commit is aborted
```

**Bypass (si besoin, avec prudence)**:
```bash
git commit --no-verify
# ⚠️ À utiliser UNIQUEMENT en cas d'urgence
```

---

### 2. **commit-msg** - Validation Message Commit

Valide le format du message commit.

**Format Requis** (Conventional Commits):
```
type(scope): description

[optional body]
[optional footer]
```

**Types valides**:
- `feat:` - Nouvelle feature
- `fix:` - Bug fix
- `docs:` - Documentation uniquement
- `style:` - Formatting (sans logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Tests ajoutés/modifiés
- `chore:` - Build, CI/CD, dependencies

**Scope** (optionnel):
- `securevault` - Pour SecureVault app
- `portfolio` - Pour Portfolio app
- `infra` - Pour Infrastructure
- `docs` - Pour Documentation
- `ci` - Pour CI/CD
- etc.

**Examples** ✅:
```
feat(securevault): add 2FA support
fix(portfolio): correct responsive design
docs: update deployment guide
refactor(infra): improve docker compose
test(securevault): add unit tests for crypto
chore: update dependencies
```

**Examples** ❌:
```
update stuff             # No type
FEAT: add feature        # Wrong case
Add new feature          # No type
feat add feature         # Missing colon
feat(): add feature      # Empty scope
```

**Bypass** (si vraiment nécessaire):
```bash
git commit --no-verify
```

---

### 3. **pre-push** - Validation avant Push

Exécuté avant `git push`.

**Vérifie**:
- ✅ Branche existe sur remote
- ✅ Pas de commits unpushed
- ✅ Tests locaux passent (quick check)
- ✅ Aucun secret en review
- ✅ Branche n'est pas "en retard" de develop

**Commande**:
```bash
git push origin feature-branch
# → pre-push hook runs
# → If check fails: push is aborted
```

**Bypass**:
```bash
git push --no-verify
```

---

### 4. **post-merge** - Actions après Merge

Exécuté après merge d'une autre branche.

**Actions automatiques**:
- ✅ Installe dépendances si package.json a changé
- ✅ Exécute migrations DB si applicable
- ✅ Met à jour hooks Git
- ✅ Affiche changelog depuis merge

**Usage Automatique**:
```bash
git merge develop
# → post-merge hook runs automatically
# → Dependencies installed if needed
# → You're ready to continue!
```

---

## 📋 Configuration Hooks

### Personnaliser un Hook

Éditer le fichier du hook:

```bash
nano .git-hooks/pre-commit
```

### Désactiver Temporairement

```bash
# Disable all hooks
git config core.hooksPath ""

# Re-enable
git config core.hooksPath .git-hooks
```

### Logs & Debugging

```bash
# Voir sortie d'un hook
GIT_TRACE=1 git commit -m "test"

# Voir tous les hooks executed
bash -x .git-hooks/pre-commit
```

---

## 🚀 Workflow Typique

### Feature Development

```bash
# 1. Créer branche
git checkout -b feature/my-feature

# 2. Faire changements
# ... edit files ...

# 3. Stage changes
git add .

# 4. Commit (hook vérifie)
git commit -m "feat(securevault): add new feature"
# → pre-commit hook runs
# → commit-msg hook validates message
# → Commit succeeds or fails

# 5. Push (hook vérifie)
git push origin feature/my-feature
# → pre-push hook runs
# → Push succeeds or fails

# 6. Create PR on GitHub
# → GitHub Actions CI/CD runs

# 7. Merge to develop (post-merge)
git checkout develop
git pull origin develop
git merge feature/my-feature
# → post-merge hook runs
# → Dependencies auto-installed if needed
```

---

## 🔐 Security Hooks

### Gitleaks Integration

Le hook `pre-commit` utilise gitleaks pour détecter secrets:

```bash
# Vérifier manuellement
gitleaks detect --source . --verbose
```

### Fichiers Ignorés

`.git-hooks/pre-commit` refuse les patterns:
- `*.pem`, `*.key` - Private keys
- `.env`, `.env.*` - Secrets
- `*.p12`, `*.pkcs12` - Certificates
- `credentials.json` - Cloud credentials
- `secrets.yaml` - Kubernetes secrets

---

## 🛠️ Troubleshooting

### Hook ne s'exécute pas

**Cause**: Hooks pas configurés

**Solution**:
```bash
git config core.hooksPath .git-hooks
chmod +x .git-hooks/*
```

### "Permission denied" error

**Cause**: Hooks ne sont pas exécutables

**Solution**:
```bash
chmod +x .git-hooks/pre-commit
chmod +x .git-hooks/commit-msg
chmod +x .git-hooks/pre-push
chmod +x .git-hooks/post-merge
```

### Hook "fails" mais je veux continuer

**Solution**:
```bash
# Bypass avec caution
git commit --no-verify
git push --no-verify

# ⚠️ À utiliser UNIQUEMENT pour urgences
```

### Hook output is confusing

**Solution**:
```bash
# Run hook manually to see details
bash -x .git-hooks/pre-commit

# Or with verbose output
GIT_TRACE=1 git commit -m "test"
```

---

## 📊 Hook Performance

### Temps d'exécution typiques

| Hook | Durée | Notes |
|------|-------|-------|
| pre-commit | 2-5s | Linting + gitleaks |
| commit-msg | < 1s | Message validation |
| pre-push | 5-10s | Tests locaux |
| post-merge | 10-30s | Install deps |

### Optimisation

```bash
# Skip hooks pour commits rapides
git commit --no-verify

# Paralléliser checks
export GIT_HOOK_PARALLEL=true
```

---

## 🚀 CI/CD Integration

Hooks sont **complémentaires** aux GitHub Actions:

```
Git Hooks (Local Dev)          GitHub Actions (Remote CI/CD)
    ↓                               ↓
pre-commit   ←→  Fast Feedback  ←→  CodeQL, Trivy
commit-msg   ←→  Standardize    ←→  Conventional commits
pre-push     ←→  Pre-flight     ←→  Full test suite
              ↓                       ↓
          Developer catches       Server catches
          early issues            remaining issues
```

---

## 📚 Resources

- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Husky (Node.js Git hooks)](https://husky.typicode.com/)
- [Pre-commit Framework](https://pre-commit.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)

---

## 📝 Développement des Hooks

### Ajouter un nouveau Hook

1. Créer fichier: `.git-hooks/new-hook-name`
2. Rendre exécutable: `chmod +x .git-hooks/new-hook-name`
3. Implémenter logique
4. Tester localement
5. Commit: `git add .git-hooks/new-hook-name`

### Template Hook

```bash
#!/bin/bash

# Git Hook: hook-name
# Purpose: Description of what this hook does

set -e  # Exit on error

echo "🔍 Running hook-name..."

# Votre logique ici
# ...

echo "✅ hook-name passed"
exit 0
```

---

## 🔄 Continuous Improvement

### Feedback sur Hooks

Si un hook est trop strict ou trop lax:

1. Ouvrir une issue: "Hooks: [feedback]"
2. Proposer changement
3. Discuter avec l'équipe
4. Implémenter amélioration
5. Tester et commiter

---

**Créé par**: Christophe FREIJANES  
**Dernière mise à jour**: Janvier 2026  
**Version**: 2.0.0  
**Status**: ✅ Production Ready
bash .git-hooks/install.sh
```

## Contenu des Hooks

### pre-commit
```bash
#!/bin/bash
# Vérifications de sécurité avant commit
# - Pas de .env
# - Pas de clés privées
# - Pas de credentials
# - Pas de bases de données
```

## Logs des Hooks

Les hooks ne sauvegardent pas de logs par défaut. Pour déboguer:

```bash
# Exécuter le hook manuellement
bash .git-hooks/pre-commit

# Ou avec verbose
bash -x .git-hooks/pre-commit
```

## Désactiver Temporairement

```bash
# Bypass un hook (pas recommandé)
git commit --no-verify

# Ou supprimer le hook
rm .git/hooks/pre-commit
```

## Ressources

- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Husky](https://typicode.github.io/husky/) - Framework pour Git Hooks
- [Pre-commit Framework](https://pre-commit.com/)

---

**Créé par**: Christophe FREIJANES  
**Date**: Décembre 2025
