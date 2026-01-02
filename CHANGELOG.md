# 📋 Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).


## [1.9.4](https://github.com/christophe-freijanes/freijstack/compare/v1.9.3...v1.9.4) (2026-01-02)

### 🐛 Bug Fixes

* add docker login before image verification and remove duplicate checkouts ([d894022](https://github.com/christophe-freijanes/freijstack/commit/d894022d2cd54fcd392a7a073746863e4afc6b26))

### 📚 Documentation

* auto-generate diagrams and index ([#114](https://github.com/christophe-freijanes/freijstack/issues/114)) ([7c57eb0](https://github.com/christophe-freijanes/freijstack/commit/7c57eb090bd2ae2904e09414a4d1234c61d7d931)), closes [#64](https://github.com/christophe-freijanes/freijstack/issues/64) [#66](https://github.com/christophe-freijanes/freijstack/issues/66) [#67](https://github.com/christophe-freijanes/freijstack/issues/67) [#69](https://github.com/christophe-freijanes/freijstack/issues/69) [#73](https://github.com/christophe-freijanes/freijstack/issues/73) [#75](https://github.com/christophe-freijanes/freijstack/issues/75) [#78](https://github.com/christophe-freijanes/freijstack/issues/78) [#79](https://github.com/christophe-freijanes/freijstack/issues/79) [#81](https://github.com/christophe-freijanes/freijstack/issues/81) [#82](https://github.com/christophe-freijanes/freijstack/issues/82) [#83](https://github.com/christophe-freijanes/freijstack/issues/83) [#85](https://github.com/christophe-freijanes/freijstack/issues/85) [#87](https://github.com/christophe-freijanes/freijstack/issues/87) [#89](https://github.com/christophe-freijanes/freijstack/issues/89) [#90](https://github.com/christophe-freijanes/freijstack/issues/90) [#91](https://github.com/christophe-freijanes/freijstack/issues/91) [#92](https://github.com/christophe-freijanes/freijstack/issues/92) [#93](https://github.com/christophe-freijanes/freijstack/issues/93) [#94](https://github.com/christophe-freijanes/freijstack/issues/94) [#96](https://github.com/christophe-freijanes/freijstack/issues/96) [#97](https://github.com/christophe-freijanes/freijstack/issues/97) [#98](https://github.com/christophe-freijanes/freijstack/issues/98)

## [1.9.3](https://github.com/christophe-freijanes/freijstack/compare/v1.9.2...v1.9.3) (2026-01-02)

### 🐛 Bug Fixes

* remove extra blank lines in docker-compose.yml (yamllint) ([a844e2e](https://github.com/christophe-freijanes/freijstack/commit/a844e2eb98e4fb1fe579074aa42b5fade193fd2f))

## [1.9.2](https://github.com/christophe-freijanes/freijstack/compare/v1.9.1...v1.9.2) (2026-01-02)

### 🐛 Bug Fixes

* break long if condition in portfolio-deploy.yml to comply with yamllint ([c6d7b5e](https://github.com/christophe-freijanes/freijstack/commit/c6d7b5e55ac67ff6515ca6936803d211b0f44cd9))

## [1.9.1](https://github.com/christophe-freijanes/freijstack/compare/v1.9.0...v1.9.1) (2026-01-02)

### ♻️ Code Refactoring

* remove portfolio services managed by separate docker-compose ([4a6ac9a](https://github.com/christophe-freijanes/freijstack/commit/4a6ac9a82221630f813745745687adc5dba69b0f))

## [1.9.0](https://github.com/christophe-freijanes/freijstack/compare/v1.8.0...v1.9.0) (2026-01-02)

### 🚀 Features

* add security scanning to portfolio deployment workflow ([2342c0f](https://github.com/christophe-freijanes/freijstack/commit/2342c0f8f0a1a0667c5721aa0e383688f3231d9c))

## [1.8.0](https://github.com/christophe-freijanes/freijstack/compare/v1.7.0...v1.8.0) (2026-01-02)

### 🚀 Features

* migrate portfolio deployment from rsync to Docker Compose ([1dbe23a](https://github.com/christophe-freijanes/freijstack/commit/1dbe23a792b258c95ebb9298499db09587029e98))

## [1.7.0](https://github.com/christophe-freijanes/freijstack/compare/v1.6.0...v1.7.0) (2026-01-02)

### 🚀 Features

* create release tags directly on develop branch ([#112](https://github.com/christophe-freijanes/freijstack/issues/112)) ([d85c56c](https://github.com/christophe-freijanes/freijstack/commit/d85c56c3b20a7245bbf959154a66d94f059ab794)), closes [#64](https://github.com/christophe-freijanes/freijstack/issues/64) [#66](https://github.com/christophe-freijanes/freijstack/issues/66) [#67](https://github.com/christophe-freijanes/freijstack/issues/67) [#69](https://github.com/christophe-freijanes/freijstack/issues/69) [#73](https://github.com/christophe-freijanes/freijstack/issues/73) [#75](https://github.com/christophe-freijanes/freijstack/issues/75) [#78](https://github.com/christophe-freijanes/freijstack/issues/78) [#79](https://github.com/christophe-freijanes/freijstack/issues/79) [#81](https://github.com/christophe-freijanes/freijstack/issues/81) [#82](https://github.com/christophe-freijanes/freijstack/issues/82) [#83](https://github.com/christophe-freijanes/freijstack/issues/83) [#85](https://github.com/christophe-freijanes/freijstack/issues/85) [#87](https://github.com/christophe-freijanes/freijstack/issues/87) [#89](https://github.com/christophe-freijanes/freijstack/issues/89) [#90](https://github.com/christophe-freijanes/freijstack/issues/90) [#91](https://github.com/christophe-freijanes/freijstack/issues/91) [#92](https://github.com/christophe-freijanes/freijstack/issues/92) [#93](https://github.com/christophe-freijanes/freijstack/issues/93) [#94](https://github.com/christophe-freijanes/freijstack/issues/94) [#96](https://github.com/christophe-freijanes/freijstack/issues/96) [#97](https://github.com/christophe-freijanes/freijstack/issues/97) [#98](https://github.com/christophe-freijanes/freijstack/issues/98)
* create release tags directly on develop branch ([#112](https://github.com/christophe-freijanes/freijstack/issues/112)) ([#113](https://github.com/christophe-freijanes/freijstack/issues/113)) ([8777af2](https://github.com/christophe-freijanes/freijstack/commit/8777af2e76219c12ab7498aee74a55dc4c0333e9)), closes [#64](https://github.com/christophe-freijanes/freijstack/issues/64) [#66](https://github.com/christophe-freijanes/freijstack/issues/66) [#67](https://github.com/christophe-freijanes/freijstack/issues/67) [#69](https://github.com/christophe-freijanes/freijstack/issues/69) [#73](https://github.com/christophe-freijanes/freijstack/issues/73) [#75](https://github.com/christophe-freijanes/freijstack/issues/75) [#78](https://github.com/christophe-freijanes/freijstack/issues/78) [#79](https://github.com/christophe-freijanes/freijstack/issues/79) [#81](https://github.com/christophe-freijanes/freijstack/issues/81) [#82](https://github.com/christophe-freijanes/freijstack/issues/82) [#83](https://github.com/christophe-freijanes/freijstack/issues/83) [#85](https://github.com/christophe-freijanes/freijstack/issues/85) [#87](https://github.com/christophe-freijanes/freijstack/issues/87) [#89](https://github.com/christophe-freijanes/freijstack/issues/89) [#90](https://github.com/christophe-freijanes/freijstack/issues/90) [#91](https://github.com/christophe-freijanes/freijstack/issues/91) [#92](https://github.com/christophe-freijanes/freijstack/issues/92) [#93](https://github.com/christophe-freijanes/freijstack/issues/93) [#94](https://github.com/christophe-freijanes/freijstack/issues/94) [#96](https://github.com/christophe-freijanes/freijstack/issues/96) [#97](https://github.com/christophe-freijanes/freijstack/issues/97) [#98](https://github.com/christophe-freijanes/freijstack/issues/98)
* enhance CHANGELOG formatting with emojis and better grouping ([96cec20](https://github.com/christophe-freijanes/freijstack/commit/96cec2014f1065b3fd27a9870f6160f378e481e3))

### 🐛 Bug Fixes

* add conventional-changelog-conventionalcommits dependency for enhanced CHANGELOG ([f562622](https://github.com/christophe-freijanes/freijstack/commit/f5626227709a3b1f943d9601d2c0144d8332ea20))

### 📚 Documentation

* auto-generate diagrams and index [skip ci] ([8fcd8df](https://github.com/christophe-freijanes/freijstack/commit/8fcd8dfadc97ef0e6fd9bf116c12871080ec1c60))

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
