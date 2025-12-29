# 🔒 Git Hooks - Sécurité & Qualité

Scripts exécutés automatiquement lors de certaines actions Git pour maintenir la sécurité et la qualité du code.

## Installation

```bash
# Copier les hooks dans .git/hooks
cp .git-hooks/* .git/hooks/

# Rendre exécutables
chmod +x .git/hooks/*

# Vérifier
ls -la .git/hooks/
```

## Hooks Disponibles

### `pre-commit`
**Exécuté**: Avant chaque `git commit`

**Vérifications**:
- ❌ Aucun fichier `.env` non-example
- ❌ Aucune clé privée (`.key`, `.pem`, `id_rsa`, etc.)
- ❌ Aucun fichier `credentials.json`
- ❌ Aucune base de données (`.db`, `.sqlite`)
- ⚠️ Patterns secrets potentiels (password, token, api-key)
- ⚠️ Statements `console.log` en JavaScript/TypeScript

**Si échoue**:
```bash
git commit --no-verify  # Bypass (avec prudence!)
```

## Configuration Automatique (Recommandé)

Pour installer automatiquement les hooks lors du clone:

```bash
# Dans package.json
"scripts": {
  "prepare": "husky install",
  "security-check": "scripts/security-check.sh"
}
```

Ou avec le script:
```bash
# Installation manuelle
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
