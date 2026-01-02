# [1.6.0](https://github.com/christophe-freijanes/freijstack/compare/v1.5.0...v1.6.0) (2026-01-02)


### Features

* enable CHANGELOG.md auto-commit via semantic-release/git plugin ([c6991ed](https://github.com/christophe-freijanes/freijstack/commit/c6991edd42fff42b77a403f9e215bd9c31f1989d))

# 📋 Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [1.5.0](https://github.com/christophe-freijanes/freijstack/releases/tag/v1.5.0) (2026-01-02)

### 🚀 Features
- Release tags créés directement sur develop
- Documentation de sécurité déplacée vers docs-private
- Gitleaks allowlist améliorée

### 🐛 Bug Fixes
- Configuration git credentials pour création de tags automatique
- Fetch des tags avant semantic-release
- Suppression des patterns sensibles dans la documentation

---

## [1.4.0](https://github.com/christophe-freijanes/freijstack/releases/tag/v1.4.0) (2026-01-02)

### 🚀 Features
- Registry cleanup workflow (nettoyage hebdomadaire des images >90 jours)
- Portfolio build workflow avec security scan
- Documentation redaction guidelines

### 🐛 Bug Fixes
- Correction du package markdown linting (markdownlint-cli)
- Healthchecks mis à jour pour staging/production

---

## [1.3.0](https://github.com/christophe-freijanes/freijstack/releases/tag/v1.3.0) (2026-01-02)

### 🚀 Features
- Credentials de production séparés pour Docker Registry
- Workflow registry-deploy mis à jour pour master branch

### 🐛 Bug Fixes
- Gestion des erreurs 404 dans les déploiements
- Résolution des conflits de port 5000

---

## [1.2.0](https://github.com/christophe-freijanes/freijstack/compare/v1.1.11...v1.2.0) (2026-01-01)

### 🚀 Features
- Test semantic-release pipeline

---

*Les versions antérieures à 1.2.0 sont disponibles dans l'historique git.*
