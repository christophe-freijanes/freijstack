# 📋 Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).


## [1.24.10](https://github.com/christophe-freijanes/freijstack/compare/v1.24.9...v1.24.10) (2026-01-04)

### 🐛 Bug Fixes

* update registry password secret for staging deployment ([5c3a70f](https://github.com/christophe-freijanes/freijstack/commit/5c3a70f8d2223dc6fa0429c16773d4ff1dab70ec))

## [1.24.9](https://github.com/christophe-freijanes/freijstack/compare/v1.24.8...v1.24.9) (2026-01-04)

### 🐛 Bug Fixes

* add Docker login step for production deployment and update secrets in portfolio deploy workflow ([4f82cd1](https://github.com/christophe-freijanes/freijstack/commit/4f82cd1e5e15f13ab41fd86718769610ab4b7ac7))

### 🔧 Chores

* trigger workflows ([#125](https://github.com/christophe-freijanes/freijstack/issues/125)) ([a94d369](https://github.com/christophe-freijanes/freijstack/commit/a94d369befd86b554e65ed0ffcc38d112c737f56))

## [1.24.8](https://github.com/christophe-freijanes/freijstack/compare/v1.24.7...v1.24.8) (2026-01-04)

### 🐛 Bug Fixes

* update path for .htpasswd generation in deploy workflow ([01753e9](https://github.com/christophe-freijanes/freijstack/commit/01753e90761dc1d9c57fd6b1a6fd7a6d0d12179e))

## [1.24.7](https://github.com/christophe-freijanes/freijstack/compare/v1.24.6...v1.24.7) (2026-01-04)

### 🐛 Bug Fixes

* add REGISTRY_USER_STAGING and REGISTRY_USER_PROD secrets to core-full-deploy ([d4dc05b](https://github.com/christophe-freijanes/freijstack/commit/d4dc05b97cb45f3cbcba41fd33d37997531b90c1))

## [1.24.6](https://github.com/christophe-freijanes/freijstack/compare/v1.24.5...v1.24.6) (2026-01-04)

### 🐛 Bug Fixes

* remove trailing spaces ([5507e60](https://github.com/christophe-freijanes/freijstack/commit/5507e60e988f81447b4f78a867c847cecff6368f))

## [1.24.5](https://github.com/christophe-freijanes/freijstack/compare/v1.24.4...v1.24.5) (2026-01-04)

### 🐛 Bug Fixes

* replace heredoc with echo to fix YAML syntax error ([40a8cbb](https://github.com/christophe-freijanes/freijstack/commit/40a8cbba24f5b0e174b5366cd106f13b234394ed))

## [1.24.4](https://github.com/christophe-freijanes/freijstack/compare/v1.24.3...v1.24.4) (2026-01-04)

### ♻️ Code Refactoring

* remove redundant REGISTRY_USERNAME check ([7607dba](https://github.com/christophe-freijanes/freijstack/commit/7607dba210db65e807b716103fbb15f6ca835a82))

## [1.24.3](https://github.com/christophe-freijanes/freijstack/compare/v1.24.2...v1.24.3) (2026-01-04)

### 🐛 Bug Fixes

* create .env file during registry deployment for docker-compose ([8170056](https://github.com/christophe-freijanes/freijstack/commit/81700561af79b785720c1412ad8ebffa6466e856))

### 🔧 Chores

* remove .env.example (usernames now in GitHub Secrets) ([932bf69](https://github.com/christophe-freijanes/freijstack/commit/932bf69632c16834c46cba6a03f00241c4608b70))
* remove unused .env.example file ([94ce785](https://github.com/christophe-freijanes/freijstack/commit/94ce7852fc788449caf82b04d7cdca066755a9ef))

## [1.24.2](https://github.com/christophe-freijanes/freijstack/compare/v1.24.1...v1.24.2) (2026-01-04)

### ♻️ Code Refactoring

* pass registry usernames as GitHub Secrets instead of .env files ([9eb88ad](https://github.com/christophe-freijanes/freijstack/commit/9eb88adb6672305d4a52f7c107f7b1295093cb2d))

### 🔧 Chores

* add .env files to gitignore ([a885535](https://github.com/christophe-freijanes/freijstack/commit/a885535c30105f8020f998d422fb7a535d10252e))
* add example registry usernames to .env.example ([c7c344c](https://github.com/christophe-freijanes/freijstack/commit/c7c344c6a8460fcbc08492b5202c2397de5ba8d9))
* remove credentials from .env.example ([cc34821](https://github.com/christophe-freijanes/freijstack/commit/cc3482122c7b59539be58515b8a3529a953836d2))
* remove sensitive usernames from .env.example ([f40ceb2](https://github.com/christophe-freijanes/freijstack/commit/f40ceb2503ed78bd6b980594676c32eb5874c36d))
* rename .env to .env.example and add to gitignore ([3a200ae](https://github.com/christophe-freijanes/freijstack/commit/3a200ae1fe20d2672f3cf7e09a06413c77c3ad38))

## [1.24.1](https://github.com/christophe-freijanes/freijstack/compare/v1.24.0...v1.24.1) (2026-01-04)

### ♻️ Code Refactoring

* use .env for registry usernames instead of secrets ([2879b9e](https://github.com/christophe-freijanes/freijstack/commit/2879b9e3ea8a631f3b4d3fc837ab9089b81c8f5c))

## [1.24.0](https://github.com/christophe-freijanes/freijstack/compare/v1.23.4...v1.24.0) (2026-01-04)

### 🚀 Features

* update markdownlint configuration and enhance password generation script ([#121](https://github.com/christophe-freijanes/freijstack/issues/121)) ([523df89](https://github.com/christophe-freijanes/freijstack/commit/523df89acb2780ff710dcce427ab50dbd03e712b)), closes [#79](https://github.com/christophe-freijanes/freijstack/issues/79) [#81](https://github.com/christophe-freijanes/freijstack/issues/81) [#82](https://github.com/christophe-freijanes/freijstack/issues/82) [#83](https://github.com/christophe-freijanes/freijstack/issues/83) [#85](https://github.com/christophe-freijanes/freijstack/issues/85) [#87](https://github.com/christophe-freijanes/freijstack/issues/87) [#89](https://github.com/christophe-freijanes/freijstack/issues/89) [#90](https://github.com/christophe-freijanes/freijstack/issues/90) [#91](https://github.com/christophe-freijanes/freijstack/issues/91) [#92](https://github.com/christophe-freijanes/freijstack/issues/92) [#93](https://github.com/christophe-freijanes/freijstack/issues/93) [#94](https://github.com/christophe-freijanes/freijstack/issues/94) [#96](https://github.com/christophe-freijanes/freijstack/issues/96) [#97](https://github.com/christophe-freijanes/freijstack/issues/97) [#98](https://github.com/christophe-freijanes/freijstack/issues/98)

### 🐛 Bug Fixes

* improve registry availability check with HTTP status code handling ([#124](https://github.com/christophe-freijanes/freijstack/issues/124)) ([b0549ff](https://github.com/christophe-freijanes/freijstack/commit/b0549ffaae9873efdce55bc6afb2cf8fb6522e8b))

### 🔧 Chores

* enhance health check workflows with smart cooldown and timeout adjustments ([#122](https://github.com/christophe-freijanes/freijstack/issues/122)) ([762ef4d](https://github.com/christophe-freijanes/freijstack/commit/762ef4dd2326edd0179dd9cc84c5653fca568027)), closes [#81](https://github.com/christophe-freijanes/freijstack/issues/81) [#82](https://github.com/christophe-freijanes/freijstack/issues/82) [#83](https://github.com/christophe-freijanes/freijstack/issues/83) [#85](https://github.com/christophe-freijanes/freijstack/issues/85) [#87](https://github.com/christophe-freijanes/freijstack/issues/87) [#89](https://github.com/christophe-freijanes/freijstack/issues/89) [#90](https://github.com/christophe-freijanes/freijstack/issues/90) [#91](https://github.com/christophe-freijanes/freijstack/issues/91) [#92](https://github.com/christophe-freijanes/freijstack/issues/92) [#93](https://github.com/christophe-freijanes/freijstack/issues/93) [#94](https://github.com/christophe-freijanes/freijstack/issues/94) [#96](https://github.com/christophe-freijanes/freijstack/issues/96) [#97](https://github.com/christophe-freijanes/freijstack/issues/97) [#98](https://github.com/christophe-freijanes/freijstack/issues/98)
* remove pull request triggers from portfolio, registry, and securevault deploy workflows ([e0ac4fa](https://github.com/christophe-freijanes/freijstack/commit/e0ac4fa36556d8e315d1fca4cd4de43199a3f280))
* trigger workflows ([f27d336](https://github.com/christophe-freijanes/freijstack/commit/f27d3364761d1bf53973980d955b90628e4b9935))

## [1.23.4](https://github.com/christophe-freijanes/freijstack/compare/v1.23.3...v1.23.4) (2026-01-04)

### 🐛 Bug Fixes

* improve registry availability check with HTTP status code handling ([d793a6a](https://github.com/christophe-freijanes/freijstack/commit/d793a6abc2270cadc6ea22bdd2cba9ba239be466))

## [1.23.3](https://github.com/christophe-freijanes/freijstack/compare/v1.23.2...v1.23.3) (2026-01-04)

### 🐛 Bug Fixes

* update paths for push events in Docker Registry and SecureVault workflows ([c9d7c61](https://github.com/christophe-freijanes/freijstack/commit/c9d7c619dccc1c172aa5e629e6ec66219784bc92))

## [1.23.2](https://github.com/christophe-freijanes/freijstack/compare/v1.23.1...v1.23.2) (2026-01-04)

### ♻️ Code Refactoring

* move registry login step after availability check in build workflow ([5dcb229](https://github.com/christophe-freijanes/freijstack/commit/5dcb229a68a05991c3b44d6a8a06c43bdd5e89e7))

## [1.23.1](https://github.com/christophe-freijanes/freijstack/compare/v1.23.0...v1.23.1) (2026-01-04)

### 🐛 Bug Fixes

* remove unnecessary blank lines in registry availability checks ([f8ccbfe](https://github.com/christophe-freijanes/freijstack/commit/f8ccbfebc85e59fbc757705f655d9c6431f2e78c))

## [1.23.0](https://github.com/christophe-freijanes/freijstack/compare/v1.22.0...v1.23.0) (2026-01-04)

### 🚀 Features

* update registry links and add availability checks in build workflow ([8e80d3e](https://github.com/christophe-freijanes/freijstack/commit/8e80d3e5386047a4758d7effd83544169453387c))

## [1.22.0](https://github.com/christophe-freijanes/freijstack/compare/v1.21.15...v1.22.0) (2026-01-04)

### 🚀 Features

* add registry authentication inputs and dynamic htpasswd generation script ([a7375b5](https://github.com/christophe-freijanes/freijstack/commit/a7375b5c02937188000fe0619405cbfc1ff69d22))

## [1.21.15](https://github.com/christophe-freijanes/freijstack/compare/v1.21.14...v1.21.15) (2026-01-04)

### 🐛 Bug Fixes

* hardcode registry host URLs in portfolio build workflow ([b6c6ff9](https://github.com/christophe-freijanes/freijstack/commit/b6c6ff96639e3b4d3cfa13a7c41daba4fa5a0c4f))

## [1.21.14](https://github.com/christophe-freijanes/freijstack/compare/v1.21.13...v1.21.14) (2026-01-04)

### 🐛 Bug Fixes

* refactor registry host variables and update docker-compose files for staging and production ([8d49b40](https://github.com/christophe-freijanes/freijstack/commit/8d49b405e60f090866e3b95726a4890359e47866))

## [1.21.13](https://github.com/christophe-freijanes/freijstack/compare/v1.21.12...v1.21.13) (2026-01-04)

### 🐛 Bug Fixes

* hardcode registry host URLs in portfolio build workflow ([d3ff0fd](https://github.com/christophe-freijanes/freijstack/commit/d3ff0fd0954138315908ba7a3c6d176cfdb21cc0))

## [1.21.12](https://github.com/christophe-freijanes/freijstack/compare/v1.21.11...v1.21.12) (2026-01-04)

### 🐛 Bug Fixes

* update deployment scripts to preserve data volumes in staging and refactor registry credentials ([0ade89d](https://github.com/christophe-freijanes/freijstack/commit/0ade89d8fca39e5ca46d50ca11dce48e1501b435))

## [1.21.11](https://github.com/christophe-freijanes/freijstack/compare/v1.21.10...v1.21.11) (2026-01-04)

### 🐛 Bug Fixes

* enhance project description and update tags for Infrastructure as Code section ([7f0daec](https://github.com/christophe-freijanes/freijstack/commit/7f0daec378a28aa2e9c220cf7e30b0306171470c))

## [1.21.10](https://github.com/christophe-freijanes/freijstack/compare/v1.21.9...v1.21.10) (2026-01-04)

### 🐛 Bug Fixes

* update registry credentials to use environment variables in docker-compose files ([6de2cb1](https://github.com/christophe-freijanes/freijstack/commit/6de2cb114d9a64fc81eb46a67655b2ac8600894d))

## [1.21.9](https://github.com/christophe-freijanes/freijstack/compare/v1.21.8...v1.21.9) (2026-01-04)

### 🐛 Bug Fixes

* improve deployment logic for staging and production environments ([8b50cf8](https://github.com/christophe-freijanes/freijstack/commit/8b50cf8eba8374ae1067cc5a115aca037b4bb7a7))

## [1.21.8](https://github.com/christophe-freijanes/freijstack/compare/v1.21.7...v1.21.8) (2026-01-03)

### 🐛 Bug Fixes

* ensure lingering containers are force removed during deployment ([8450e8c](https://github.com/christophe-freijanes/freijstack/commit/8450e8c906ef5af81d4eeae06bbaf5b1f4a75c65))

## [1.21.7](https://github.com/christophe-freijanes/freijstack/compare/v1.21.6...v1.21.7) (2026-01-03)

### 🐛 Bug Fixes

* force remove lingering containers during deployment to prevent conflicts ([e0004ae](https://github.com/christophe-freijanes/freijstack/commit/e0004aea5a96e6b89b123b0d73d1d3725a352c69))

## [1.21.6](https://github.com/christophe-freijanes/freijstack/compare/v1.21.5...v1.21.6) (2026-01-03)

### 🐛 Bug Fixes

* enhance deployment script to handle fixed container names and staging environment safely ([dcc8545](https://github.com/christophe-freijanes/freijstack/commit/dcc8545411a8eefdea395f5cc993b4ec4c5488c5))

## [1.21.5](https://github.com/christophe-freijanes/freijstack/compare/v1.21.4...v1.21.5) (2026-01-03)

### 🐛 Bug Fixes

* update docker compose file paths for staging and production deployments ([1a0d994](https://github.com/christophe-freijanes/freijstack/commit/1a0d994fa0c54bbb4aaf7a424b709e83b40f01d1))

### 🔧 Chores

* remove lint workflow configuration ([eee3be1](https://github.com/christophe-freijanes/freijstack/commit/eee3be125f35a46c0e356a5a3005879f667c871f))

## [1.21.4](https://github.com/christophe-freijanes/freijstack/compare/v1.21.3...v1.21.4) (2026-01-03)

### 🐛 Bug Fixes

* Remove unnecessary newline in markdown lint job ([592657d](https://github.com/christophe-freijanes/freijstack/commit/592657d8c1498960fd2f045d195f88da60e5f275))

## [1.21.3](https://github.com/christophe-freijanes/freijstack/compare/v1.21.2...v1.21.3) (2026-01-03)

### 🐛 Bug Fixes

* Ensure data directory exists for volume bind mounts in deployment workflow ([7122c04](https://github.com/christophe-freijanes/freijstack/commit/7122c04780655fee98811a8e8d5c56cff0d7ecd0))

## [1.21.2](https://github.com/christophe-freijanes/freijstack/compare/v1.21.1...v1.21.2) (2026-01-03)

### ♻️ Code Refactoring

* Remove JSON validation job from lint workflow ([3d99da7](https://github.com/christophe-freijanes/freijstack/commit/3d99da774f5ab56a857026bd38806aab766be90c))

## [1.21.1](https://github.com/christophe-freijanes/freijstack/compare/v1.21.0...v1.21.1) (2026-01-03)

### 🐛 Bug Fixes

* Add SSH_OPTIONS persistence and ensure defaults in deployment workflow ([4dea164](https://github.com/christophe-freijanes/freijstack/commit/4dea164c038fd3af150ed1387121af5780f0c5d4))

### 📚 Documentation

* auto-generate diagrams and index [skip ci] ([8705987](https://github.com/christophe-freijanes/freijstack/commit/8705987771583c02abb63a00e85fa8baf705194f))
* auto-generate diagrams and index [skip ci] ([7914980](https://github.com/christophe-freijanes/freijstack/commit/79149809d8159b825e336ea02067d86cb891db5f))
* auto-generate diagrams and index [skip ci] ([e4811f4](https://github.com/christophe-freijanes/freijstack/commit/e4811f497ea95552983dd03e63afc406d83192b2))
* auto-generate diagrams and index [skip ci] ([6c7de9c](https://github.com/christophe-freijanes/freijstack/commit/6c7de9c7bc05cb7f5682c5628c56a863957f714d))
* auto-generate diagrams and index [skip ci] ([756bb88](https://github.com/christophe-freijanes/freijstack/commit/756bb883918cc1b55661cf998f2d9504c710ffec))
* auto-generate diagrams and index [skip ci] ([cadebf8](https://github.com/christophe-freijanes/freijstack/commit/cadebf8061226af300ad1fd96685f9303dcf496c))
* auto-generate diagrams and index [skip ci] ([881e638](https://github.com/christophe-freijanes/freijstack/commit/881e638286b57853c6f0439f06befd6d07289667))

### 🔧 Chores

* clean up comments and paths in registry deploy workflow ([5b377d7](https://github.com/christophe-freijanes/freijstack/commit/5b377d7d56862ddfef694a5545dd5087240af0ed))
* enhance health check workflows with smart cooldown and timeout adjustments ([019d618](https://github.com/christophe-freijanes/freijstack/commit/019d61864dcb72cdf2760539e7eb6f3515a08078))
* implement smart cooldown for post-deploy health check ([0ce0b32](https://github.com/christophe-freijanes/freijstack/commit/0ce0b3266af3393d124584d1a259bedff56143e7))
* update healthcheck cooldown duration and enhance ops documentation ([66d20fe](https://github.com/christophe-freijanes/freijstack/commit/66d20fe96db0d7a414c20209dbf7e9d7e770a4ca))
* update securevault deploy workflow comments for clarity ([270928c](https://github.com/christophe-freijanes/freijstack/commit/270928ce55e491395f0a512811304ebfeb6b4b78))

## [1.21.0](https://github.com/christophe-freijanes/freijstack/compare/v1.20.1...v1.21.0) (2026-01-03)

### 🚀 Features

* extend Traefik network monitoring to all critical networks  ([#119](https://github.com/christophe-freijanes/freijstack/issues/119)) ([dffb66a](https://github.com/christophe-freijanes/freijstack/commit/dffb66afe7dec593cea4f2429cec025ed7d7c854)), closes [#75](https://github.com/christophe-freijanes/freijstack/issues/75) [#78](https://github.com/christophe-freijanes/freijstack/issues/78) [#79](https://github.com/christophe-freijanes/freijstack/issues/79) [#81](https://github.com/christophe-freijanes/freijstack/issues/81) [#82](https://github.com/christophe-freijanes/freijstack/issues/82) [#83](https://github.com/christophe-freijanes/freijstack/issues/83) [#85](https://github.com/christophe-freijanes/freijstack/issues/85) [#87](https://github.com/christophe-freijanes/freijstack/issues/87) [#89](https://github.com/christophe-freijanes/freijstack/issues/89) [#90](https://github.com/christophe-freijanes/freijstack/issues/90) [#91](https://github.com/christophe-freijanes/freijstack/issues/91) [#92](https://github.com/christophe-freijanes/freijstack/issues/92) [#93](https://github.com/christophe-freijanes/freijstack/issues/93) [#94](https://github.com/christophe-freijanes/freijstack/issues/94) [#96](https://github.com/christophe-freijanes/freijstack/issues/96) [#97](https://github.com/christophe-freijanes/freijstack/issues/97) [#98](https://github.com/christophe-freijanes/freijstack/issues/98)

### 📚 Documentation

* **documentation): chore(healthcheck:** relax timeouts to reduce false 000 ([#120](https://github.com/christophe-freijanes/freijstack/issues/120)) ([ccee5c8](https://github.com/christophe-freijanes/freijstack/commit/ccee5c829bdd9c298de27d3a2efb18c48458d40e)), closes [#75](https://github.com/christophe-freijanes/freijstack/issues/75) [#78](https://github.com/christophe-freijanes/freijstack/issues/78) [#79](https://github.com/christophe-freijanes/freijstack/issues/79) [#81](https://github.com/christophe-freijanes/freijstack/issues/81) [#82](https://github.com/christophe-freijanes/freijstack/issues/82) [#83](https://github.com/christophe-freijanes/freijstack/issues/83) [#85](https://github.com/christophe-freijanes/freijstack/issues/85) [#87](https://github.com/christophe-freijanes/freijstack/issues/87) [#89](https://github.com/christophe-freijanes/freijstack/issues/89) [#90](https://github.com/christophe-freijanes/freijstack/issues/90) [#91](https://github.com/christophe-freijanes/freijstack/issues/91) [#92](https://github.com/christophe-freijanes/freijstack/issues/92) [#93](https://github.com/christophe-freijanes/freijstack/issues/93) [#94](https://github.com/christophe-freijanes/freijstack/issues/94) [#96](https://github.com/christophe-freijanes/freijstack/issues/96) [#97](https://github.com/christophe-freijanes/freijstack/issues/97) [#98](https://github.com/christophe-freijanes/freijstack/issues/98)

## [1.20.1](https://github.com/christophe-freijanes/freijstack/compare/v1.20.0...v1.20.1) (2026-01-03)

### ♻️ Code Refactoring

* clean up comments and remove noqa directives in password generation script ([2cdd46f](https://github.com/christophe-freijanes/freijstack/commit/2cdd46f4df56c5fcf401243be9bf68d0cee2ed26))

## [1.20.0](https://github.com/christophe-freijanes/freijstack/compare/v1.19.0...v1.20.0) (2026-01-03)

### 🚀 Features

* update markdownlint configuration to disable additional rules for improved flexibility ([46b0b0f](https://github.com/christophe-freijanes/freijstack/commit/46b0b0f73c792bfd7f1065681a4e24d9e1858335))

## [1.19.0](https://github.com/christophe-freijanes/freijstack/compare/v1.18.0...v1.19.0) (2026-01-03)

### 🚀 Features

* update markdownlint configuration and enhance password generation script ([9d7f45d](https://github.com/christophe-freijanes/freijstack/commit/9d7f45db8f4641399dac721d8f85f1d148a2d9b2))

## [1.18.0](https://github.com/christophe-freijanes/freijstack/compare/v1.17.0...v1.18.0) (2026-01-03)

### 🚀 Features

* enhance linting configurations for multiple languages and add markdown and JSON validation ([e2b0c7f](https://github.com/christophe-freijanes/freijstack/commit/e2b0c7f575242c929b9fb0a33cbe34604fc5f20d))

## [1.17.0](https://github.com/christophe-freijanes/freijstack/compare/v1.16.1...v1.17.0) (2026-01-03)

### 🚀 Features

* update documentation and workflows for version 2.0.0, adding new Docker Registry and Portfolio workflows, and enhancing existing content ([0eee724](https://github.com/christophe-freijanes/freijstack/commit/0eee7244be47d647515e6230725c611532106f5a))

### 🔧 Chores

* **healthcheck:** relax timeouts to reduce false 000 ([aa1f20e](https://github.com/christophe-freijanes/freijstack/commit/aa1f20e09060ef6a8715f45cdd435af17ba89cd5))

## [1.16.1](https://github.com/christophe-freijanes/freijstack/compare/v1.16.0...v1.16.1) (2026-01-03)

### 🐛 Bug Fixes

* correct formatting of architecture documentation entry in index ([#118](https://github.com/christophe-freijanes/freijstack/issues/118)) ([cbee499](https://github.com/christophe-freijanes/freijstack/commit/cbee499f87411ca28eb74a4140ea941745bf8b96)), closes [#69](https://github.com/christophe-freijanes/freijstack/issues/69) [#73](https://github.com/christophe-freijanes/freijstack/issues/73) [#75](https://github.com/christophe-freijanes/freijstack/issues/75) [#78](https://github.com/christophe-freijanes/freijstack/issues/78) [#79](https://github.com/christophe-freijanes/freijstack/issues/79) [#81](https://github.com/christophe-freijanes/freijstack/issues/81) [#82](https://github.com/christophe-freijanes/freijstack/issues/82) [#83](https://github.com/christophe-freijanes/freijstack/issues/83) [#85](https://github.com/christophe-freijanes/freijstack/issues/85) [#87](https://github.com/christophe-freijanes/freijstack/issues/87) [#89](https://github.com/christophe-freijanes/freijstack/issues/89) [#90](https://github.com/christophe-freijanes/freijstack/issues/90) [#91](https://github.com/christophe-freijanes/freijstack/issues/91) [#92](https://github.com/christophe-freijanes/freijstack/issues/92) [#93](https://github.com/christophe-freijanes/freijstack/issues/93) [#94](https://github.com/christophe-freijanes/freijstack/issues/94) [#96](https://github.com/christophe-freijanes/freijstack/issues/96) [#97](https://github.com/christophe-freijanes/freijstack/issues/97) [#98](https://github.com/christophe-freijanes/freijstack/issues/98)

## [1.16.0](https://github.com/christophe-freijanes/freijstack/compare/v1.15.0...v1.16.0) (2026-01-03)

### 🚀 Features

* extend Traefik network monitoring to all critical networks ([b0fa1a0](https://github.com/christophe-freijanes/freijstack/commit/b0fa1a0f558d244f9661dd3b992120ad0e6938d5))

## [1.15.0](https://github.com/christophe-freijanes/freijstack/compare/v1.14.0...v1.15.0) (2026-01-03)

### 🚀 Features

* **healthcheck-dev:** add portfolio staging monitoring and Traefik auto-healing ([bf0514c](https://github.com/christophe-freijanes/freijstack/commit/bf0514c3224f57c2657975db53a12cdda53a0b13))

## [1.14.0](https://github.com/christophe-freijanes/freijstack/compare/v1.13.0...v1.14.0) (2026-01-03)

### 🚀 Features

* **healthcheck:** add portfolio URLs and Traefik network auto-healing ([24cb545](https://github.com/christophe-freijanes/freijstack/commit/24cb545a9e3784368773e304a4058a811501d134))

## [1.13.0](https://github.com/christophe-freijanes/freijstack/compare/v1.12.2...v1.13.0) (2026-01-03)

### 🚀 Features

* add PowerShell scripts for portfolio destruction and redeployment ([#117](https://github.com/christophe-freijanes/freijstack/issues/117)) ([ce94c14](https://github.com/christophe-freijanes/freijstack/commit/ce94c1413eb0a2655a8f95225f818639d5b0a3a3)), closes [#67](https://github.com/christophe-freijanes/freijstack/issues/67) [#69](https://github.com/christophe-freijanes/freijstack/issues/69) [#73](https://github.com/christophe-freijanes/freijstack/issues/73) [#75](https://github.com/christophe-freijanes/freijstack/issues/75) [#78](https://github.com/christophe-freijanes/freijstack/issues/78) [#79](https://github.com/christophe-freijanes/freijstack/issues/79) [#81](https://github.com/christophe-freijanes/freijstack/issues/81) [#82](https://github.com/christophe-freijanes/freijstack/issues/82) [#83](https://github.com/christophe-freijanes/freijstack/issues/83) [#85](https://github.com/christophe-freijanes/freijstack/issues/85) [#87](https://github.com/christophe-freijanes/freijstack/issues/87) [#89](https://github.com/christophe-freijanes/freijstack/issues/89) [#90](https://github.com/christophe-freijanes/freijstack/issues/90) [#91](https://github.com/christophe-freijanes/freijstack/issues/91) [#92](https://github.com/christophe-freijanes/freijstack/issues/92) [#93](https://github.com/christophe-freijanes/freijstack/issues/93) [#94](https://github.com/christophe-freijanes/freijstack/issues/94) [#96](https://github.com/christophe-freijanes/freijstack/issues/96) [#97](https://github.com/christophe-freijanes/freijstack/issues/97) [#98](https://github.com/christophe-freijanes/freijstack/issues/98)

## [1.12.2](https://github.com/christophe-freijanes/freijstack/compare/v1.12.1...v1.12.2) (2026-01-03)

### 🐛 Bug Fixes

* correct formatting of architecture documentation entry in index ([5380972](https://github.com/christophe-freijanes/freijstack/commit/5380972e1d006d64bee95e3b3d9b14c9933f0d06))

## [1.12.1](https://github.com/christophe-freijanes/freijstack/compare/v1.12.0...v1.12.1) (2026-01-03)

### 🐛 Bug Fixes

* correct VPS portfolio path from /srv/www/securevault/saas/portfolio to /srv/www/saas/portfolio ([#116](https://github.com/christophe-freijanes/freijstack/issues/116)) ([fa16f9f](https://github.com/christophe-freijanes/freijstack/commit/fa16f9f8b008a45bd06ea3d55a270d2eb7df89ef)), closes [#64](https://github.com/christophe-freijanes/freijstack/issues/64) [#66](https://github.com/christophe-freijanes/freijstack/issues/66) [#67](https://github.com/christophe-freijanes/freijstack/issues/67) [#69](https://github.com/christophe-freijanes/freijstack/issues/69) [#73](https://github.com/christophe-freijanes/freijstack/issues/73) [#75](https://github.com/christophe-freijanes/freijstack/issues/75) [#78](https://github.com/christophe-freijanes/freijstack/issues/78) [#79](https://github.com/christophe-freijanes/freijstack/issues/79) [#81](https://github.com/christophe-freijanes/freijstack/issues/81) [#82](https://github.com/christophe-freijanes/freijstack/issues/82) [#83](https://github.com/christophe-freijanes/freijstack/issues/83) [#85](https://github.com/christophe-freijanes/freijstack/issues/85) [#87](https://github.com/christophe-freijanes/freijstack/issues/87) [#89](https://github.com/christophe-freijanes/freijstack/issues/89) [#90](https://github.com/christophe-freijanes/freijstack/issues/90) [#91](https://github.com/christophe-freijanes/freijstack/issues/91) [#92](https://github.com/christophe-freijanes/freijstack/issues/92) [#93](https://github.com/christophe-freijanes/freijstack/issues/93) [#94](https://github.com/christophe-freijanes/freijstack/issues/94) [#96](https://github.com/christophe-freijanes/freijstack/issues/96) [#97](https://github.com/christophe-freijanes/freijstack/issues/97) [#98](https://github.com/christophe-freijanes/freijstack/issues/98)

## [1.12.0](https://github.com/christophe-freijanes/freijstack/compare/v1.11.0...v1.12.0) (2026-01-03)

### 🚀 Features

* add PowerShell scripts for portfolio destruction and redeployment ([5d3e311](https://github.com/christophe-freijanes/freijstack/commit/5d3e311ea205a7b72902ff240668688551fa175e))

## [1.11.0](https://github.com/christophe-freijanes/freijstack/compare/v1.10.14...v1.11.0) (2026-01-03)

### 🚀 Features

* add automatic traefik network check and fix mechanism ([393016d](https://github.com/christophe-freijanes/freijstack/commit/393016d8c04d7d6d4287b51c1b3fd14fa08515a0))
* add automatic traefik network check and prevention mechanism ([a5d31aa](https://github.com/christophe-freijanes/freijstack/commit/a5d31aa6ba2b70eb9882ffbc6cf7968b08c3d2ef))

## [1.10.14](https://github.com/christophe-freijanes/freijstack/compare/v1.10.13...v1.10.14) (2026-01-03)

### 🐛 Bug Fixes

* remove security job dependency to unblock portfolio build ([ac7bec8](https://github.com/christophe-freijanes/freijstack/commit/ac7bec882865fa34886771c03e334c0baafa3915))

## [1.10.13](https://github.com/christophe-freijanes/freijstack/compare/v1.10.12...v1.10.13) (2026-01-03)

### 🐛 Bug Fixes

* correct vps path from /srv/www/saas/portfolio to /srv/www/portfolio ([e352891](https://github.com/christophe-freijanes/freijstack/commit/e352891395a78f67e67adb4529640d4241bd3f66))

### ✅ Tests

* trigger portfolio build via github actions ([95b6abc](https://github.com/christophe-freijanes/freijstack/commit/95b6abc217bbbf0da758b7c6c646fe3349846e47))

## [1.10.12](https://github.com/christophe-freijanes/freijstack/compare/v1.10.11...v1.10.12) (2026-01-03)

### 🐛 Bug Fixes

* connect traefik to freijstack network for portfolio routing ([9ec48f1](https://github.com/christophe-freijanes/freijstack/commit/9ec48f1e2203ac580792c08c56ea6811ff9e121d))

## [1.10.11](https://github.com/christophe-freijanes/freijstack/compare/v1.10.10...v1.10.11) (2026-01-03)

### 🐛 Bug Fixes

* replace wget with curl in healthcheck for alpine compatibility ([ee30562](https://github.com/christophe-freijanes/freijstack/commit/ee30562c3641aa2cf37d7627bf5f3e4b86d1450b))

### ✅ Tests

* trigger portfolio build ([2ec10c3](https://github.com/christophe-freijanes/freijstack/commit/2ec10c32dd51e81a3570c5cd3272156f08d36c24))

## [1.10.10](https://github.com/christophe-freijanes/freijstack/compare/v1.10.9...v1.10.10) (2026-01-03)

### 🐛 Bug Fixes

* use latest-beta tag for staging and latest for production deployments ([ddc0673](https://github.com/christophe-freijanes/freijstack/commit/ddc0673232767592cfad30fa3085c0e7a01a0185))

## [1.10.9](https://github.com/christophe-freijanes/freijstack/compare/v1.10.8...v1.10.9) (2026-01-03)

### 🐛 Bug Fixes

* remove problematic directory slash from nginx try_files directive ([7e5fdc1](https://github.com/christophe-freijanes/freijstack/commit/7e5fdc191805f99674c404bcf4b794a29ec45614))

## [1.10.8](https://github.com/christophe-freijanes/freijstack/compare/v1.10.7...v1.10.8) (2026-01-03)

### 🐛 Bug Fixes

* copy all files then remove docker config files - ensures static assets are included ([ccd0cdc](https://github.com/christophe-freijanes/freijstack/commit/ccd0cdc98559c43e31fafe0ff839102c3b9cd811))

## [1.10.7](https://github.com/christophe-freijanes/freijstack/compare/v1.10.6...v1.10.7) (2026-01-03)

### 🐛 Bug Fixes

* explicitly copy static assets to nginx html directory and add .dockerignore ([ffacd01](https://github.com/christophe-freijanes/freijstack/commit/ffacd01eebb13c167526cb1eabef5f2368b71f3c))

## [1.10.6](https://github.com/christophe-freijanes/freijstack/compare/v1.10.5...v1.10.6) (2026-01-03)

### 🐛 Bug Fixes

* add newline at end of portfolio-deploy.yml (yamllint) ([d257a95](https://github.com/christophe-freijanes/freijstack/commit/d257a959ce201cf90aab24664f3034ebcd180000))

## [1.10.5](https://github.com/christophe-freijanes/freijstack/compare/v1.10.4...v1.10.5) (2026-01-03)

### 🐛 Bug Fixes

* remove trailing blank lines in portfolio-deploy.yml (yamllint) ([ac0698f](https://github.com/christophe-freijanes/freijstack/commit/ac0698f0c84f319856979e4aa3dc5a1ce62a82eb))

## [1.10.4](https://github.com/christophe-freijanes/freijstack/compare/v1.10.3...v1.10.4) (2026-01-03)

### 🐛 Bug Fixes

* clean up workflow structure - remove job dependencies and cycles ([f519272](https://github.com/christophe-freijanes/freijstack/commit/f519272045b290d6764440e4e3898e8196d07e38))

### 🔧 Chores

* reload workflow cache ([4c50b7f](https://github.com/christophe-freijanes/freijstack/commit/4c50b7f0fd09b885aadd5aabeddf1f58f5bec936))

## [1.10.3](https://github.com/christophe-freijanes/freijstack/compare/v1.10.2...v1.10.3) (2026-01-03)

### 🐛 Bug Fixes

* remove remaining security dependency from deploy-VPS-prod job ([a73f25f](https://github.com/christophe-freijanes/freijstack/commit/a73f25ff406fdf42b020ca1b96c5c3e7f8792fb5))

## [1.10.2](https://github.com/christophe-freijanes/freijstack/compare/v1.10.1...v1.10.2) (2026-01-03)

### 🐛 Bug Fixes

* remove security job dependency from deploy workflow (already done in build) ([1fae1a4](https://github.com/christophe-freijanes/freijstack/commit/1fae1a40cd4c6cca5e72cf6f564ee1cfa57f13fd))

## [1.10.1](https://github.com/christophe-freijanes/freijstack/compare/v1.10.0...v1.10.1) (2026-01-03)

### 🐛 Bug Fixes

* correct workflow_run trigger and use proper context variables for branch detection ([c65413c](https://github.com/christophe-freijanes/freijstack/commit/c65413c99b14566608d8d8fc685f75b21c83fcc5))

## [1.10.0](https://github.com/christophe-freijanes/freijstack/compare/v1.9.7...v1.10.0) (2026-01-03)

### 🚀 Features

* add nginx configuration for proper static file serving and SPA routing ([0a3dd89](https://github.com/christophe-freijanes/freijstack/commit/0a3dd895422112c1459ac3c739d1aead82a5d4c2))

## [1.9.7](https://github.com/christophe-freijanes/freijstack/compare/v1.9.6...v1.9.7) (2026-01-03)

### 🐛 Bug Fixes

* correct Traefik labels for staging (portfolio-staging.freijstack.com) and production (portfolio.freijstack.com) ([d7b50cb](https://github.com/christophe-freijanes/freijstack/commit/d7b50cba894900d435e12174862a1ea9e085a408))

## [1.9.6](https://github.com/christophe-freijanes/freijstack/compare/v1.9.5...v1.9.6) (2026-01-02)

### 🐛 Bug Fixes

* remove extra blank lines in docker-compose.yml ([#115](https://github.com/christophe-freijanes/freijstack/issues/115)) ([cd286df](https://github.com/christophe-freijanes/freijstack/commit/cd286df2b37fe256c6ffb96685c495c9702c2937)), closes [#64](https://github.com/christophe-freijanes/freijstack/issues/64) [#66](https://github.com/christophe-freijanes/freijstack/issues/66) [#67](https://github.com/christophe-freijanes/freijstack/issues/67) [#69](https://github.com/christophe-freijanes/freijstack/issues/69) [#73](https://github.com/christophe-freijanes/freijstack/issues/73) [#75](https://github.com/christophe-freijanes/freijstack/issues/75) [#78](https://github.com/christophe-freijanes/freijstack/issues/78) [#79](https://github.com/christophe-freijanes/freijstack/issues/79) [#81](https://github.com/christophe-freijanes/freijstack/issues/81) [#82](https://github.com/christophe-freijanes/freijstack/issues/82) [#83](https://github.com/christophe-freijanes/freijstack/issues/83) [#85](https://github.com/christophe-freijanes/freijstack/issues/85) [#87](https://github.com/christophe-freijanes/freijstack/issues/87) [#89](https://github.com/christophe-freijanes/freijstack/issues/89) [#90](https://github.com/christophe-freijanes/freijstack/issues/90) [#91](https://github.com/christophe-freijanes/freijstack/issues/91) [#92](https://github.com/christophe-freijanes/freijstack/issues/92) [#93](https://github.com/christophe-freijanes/freijstack/issues/93) [#94](https://github.com/christophe-freijanes/freijstack/issues/94) [#96](https://github.com/christophe-freijanes/freijstack/issues/96) [#97](https://github.com/christophe-freijanes/freijstack/issues/97) [#98](https://github.com/christophe-freijanes/freijstack/issues/98)

## [1.9.5](https://github.com/christophe-freijanes/freijstack/compare/v1.9.4...v1.9.5) (2026-01-02)

### 🐛 Bug Fixes

* correct VPS portfolio path from /srv/www/securevault/saas/portfolio to /srv/www/saas/portfolio ([ec91c5b](https://github.com/christophe-freijanes/freijstack/commit/ec91c5b1ab4cfa11d9f4c8429e1da09936f6f7d5))

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
