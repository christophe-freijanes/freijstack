# 📋 Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).


## [1.37.18](https://github.com/christophe-freijanes/freijstack/compare/v1.37.17...v1.37.18) (2026-01-07)

### 🐛 Bug Fixes

* update Trivy image scan step to be non-blocking and add controlled gate for production ([34568e4](https://github.com/christophe-freijanes/freijstack/commit/34568e440300b53e0b907fc75554c1ca23e26265))

## [1.37.17](https://github.com/christophe-freijanes/freijstack/compare/v1.37.16...v1.37.17) (2026-01-07)

### 🐛 Bug Fixes

* update default registry host and enhance gitleaks steps with improved logging and error handling ([574a7e8](https://github.com/christophe-freijanes/freijstack/commit/574a7e87aa24b248aee205616ac45be1f7695c0b))

### 🔧 Chores

* **deps:** bump actions/checkout from 4 to 6 ([#180](https://github.com/christophe-freijanes/freijstack/issues/180)) ([c85b7df](https://github.com/christophe-freijanes/freijstack/commit/c85b7dfa9e166066a14639dd4cd5232f964dbadb))
* **deps:** bump github/codeql-action from 3 to 4 ([#178](https://github.com/christophe-freijanes/freijstack/issues/178)) ([35f72f6](https://github.com/christophe-freijanes/freijstack/commit/35f72f606e5d91e3425452291bcf7cd5a2be8408))
* **deps:** bump react-router-dom in /saas/securevault/frontend ([#179](https://github.com/christophe-freijanes/freijstack/issues/179)) ([0379878](https://github.com/christophe-freijanes/freijstack/commit/03798784cdb3e1ad78ed514dc8dc6a56c711b911))

## [1.37.16](https://github.com/christophe-freijanes/freijstack/compare/v1.37.15...v1.37.16) (2026-01-07)

### 🐛 Bug Fixes

* update Trivy action version and enhance SARIF file handling ([6dc1af9](https://github.com/christophe-freijanes/freijstack/commit/6dc1af9e0e21cbc789ba2f5be67cc60344017e99))

## [1.37.15](https://github.com/christophe-freijanes/freijstack/compare/v1.37.14...v1.37.15) (2026-01-07)

### 🐛 Bug Fixes

* update Docker login credentials to use secrets for enhanced security ([de52d43](https://github.com/christophe-freijanes/freijstack/commit/de52d434179e81fcbca2cdc6a9cbfe5b5943babb))

## [1.37.14](https://github.com/christophe-freijanes/freijstack/compare/v1.37.13...v1.37.14) (2026-01-07)

### 🐛 Bug Fixes

* update Docker registry credentials to use secrets for security ([be747a6](https://github.com/christophe-freijanes/freijstack/commit/be747a656c5a2f2966c94d2dc87379f54dd5e710))

### 🔧 Chores

* add security documentation and licensing files ([#170](https://github.com/christophe-freijanes/freijstack/issues/170)) ([642c429](https://github.com/christophe-freijanes/freijstack/commit/642c42926c9ea1d57feb689e4736266c236c8009)), closes [#150](https://github.com/christophe-freijanes/freijstack/issues/150)
* enforce failure on Gitleaks scan if issues are found ([#169](https://github.com/christophe-freijanes/freijstack/issues/169)) ([dcf178d](https://github.com/christophe-freijanes/freijstack/commit/dcf178daa0e918fbfb0bc8ea3e1d7faeda66df47)), closes [#150](https://github.com/christophe-freijanes/freijstack/issues/150)

## [1.37.13](https://github.com/christophe-freijanes/freijstack/compare/v1.37.12...v1.37.13) (2026-01-07)

### ♻️ Code Refactoring

* **gitleaks:** switch to CLI installation and update report handling ([06649db](https://github.com/christophe-freijanes/freijstack/commit/06649dba3ffe35407bbe03f3e6d374a7f86d9a89))

### 🔧 Chores

* add security documentation and licensing files ([8991e35](https://github.com/christophe-freijanes/freijstack/commit/8991e351c54b14700fa383e57bf8a31655550297))
* **deps:** bump actions/download-artifact from 4 to 7 ([#172](https://github.com/christophe-freijanes/freijstack/issues/172)) ([9abdb08](https://github.com/christophe-freijanes/freijstack/commit/9abdb08d312530b509b957dd3302b3df5c44f412))
* **deps:** bump actions/setup-python from 5 to 6 ([#176](https://github.com/christophe-freijanes/freijstack/issues/176)) ([8379f0a](https://github.com/christophe-freijanes/freijstack/commit/8379f0a4ddc24eb9c2975dc8d3e66abcd8b698ce))
* **deps:** bump actions/upload-artifact from 4 to 6 ([#171](https://github.com/christophe-freijanes/freijstack/issues/171)) ([c1ff6c5](https://github.com/christophe-freijanes/freijstack/commit/c1ff6c5ec48998f042ed30bfde5571527df2f022))
* **deps:** bump actions/upload-pages-artifact from 3 to 4 ([#175](https://github.com/christophe-freijanes/freijstack/issues/175)) ([f8cf22a](https://github.com/christophe-freijanes/freijstack/commit/f8cf22a6874f629991c14b151bb4cdd05b80bc9a))
* **deps:** bump express-rate-limit in /saas/securevault/backend ([#173](https://github.com/christophe-freijanes/freijstack/issues/173)) ([d1c9f75](https://github.com/christophe-freijanes/freijstack/commit/d1c9f75888c220ea2a8462291a7de7cda9724c59))
* **deps:** bump joi in /saas/securevault/backend ([#167](https://github.com/christophe-freijanes/freijstack/issues/167)) ([f807419](https://github.com/christophe-freijanes/freijstack/commit/f807419418b87e620b057360e2d991570fb8d407)), closes [#150](https://github.com/christophe-freijanes/freijstack/issues/150)
* **deps:** bump zaproxy/action-baseline from 0.14.0 to 0.15.0 ([#174](https://github.com/christophe-freijanes/freijstack/issues/174)) ([b016e56](https://github.com/christophe-freijanes/freijstack/commit/b016e56688ce22acba0dc09f30eb1b9514cf968e))
* enforce failure on Gitleaks scan if issues are found ([1968d29](https://github.com/christophe-freijanes/freijstack/commit/1968d29e9cc37f9b78dc546c07af0e3b2a76b61b))
* re-enable fail_on_gitleaks option in security scan job ([5b5a75f](https://github.com/christophe-freijanes/freijstack/commit/5b5a75f9508d01210dbdbaf12369aa9696ca1e6f))
* remove fail_on_gitleaks option from security scan job ([ed5be1f](https://github.com/christophe-freijanes/freijstack/commit/ed5be1f95b8cddea995028fb92c785dfe88c93e6))
* update security job to use core security CI workflow ([2a4c8ae](https://github.com/christophe-freijanes/freijstack/commit/2a4c8ae085a2636e3fb8f11516812e3efee380e7))
* update security job to use core security CI workflow ([#168](https://github.com/christophe-freijanes/freijstack/issues/168)) ([b1b8dfd](https://github.com/christophe-freijanes/freijstack/commit/b1b8dfd5bfc837cbaeeaabd1cb993a88343234f6)), closes [#150](https://github.com/christophe-freijanes/freijstack/issues/150)

## [1.37.12](https://github.com/christophe-freijanes/freijstack/compare/v1.37.11...v1.37.12) (2026-01-06)

### ♻️ Code Refactoring

* update workflow names for consistency and clarity ([#147](https://github.com/christophe-freijanes/freijstack/issues/147)) ([0f1f62e](https://github.com/christophe-freijanes/freijstack/commit/0f1f62ed97276359282e372f8c83f0005df097af))

### 📚 Documentation

* correct heading level for centralized security structure in SECURITY.md ([96b5b1c](https://github.com/christophe-freijanes/freijstack/commit/96b5b1cc7bbfe6bb74ea87e111daed1d2672f5cd))
* enhance SECURITY.md with additional best practices and updated guidelines ([7859c06](https://github.com/christophe-freijanes/freijstack/commit/7859c067b133b27c37b51ac0061f0ab50ff0ac32))
* improve formatting and consistency in SECURITY.md ([8a63a5f](https://github.com/christophe-freijanes/freijstack/commit/8a63a5fcbc6fbea16788033d1e22bb5e1a903700))
* improve security practices section for clarity and formatting ([d21fac6](https://github.com/christophe-freijanes/freijstack/commit/d21fac6b8f9acba4be42f0229b59db40a381476b))
* update security policy structure and improve section headings in SECURITY.md ([6cc0f44](https://github.com/christophe-freijanes/freijstack/commit/6cc0f44ce0348b4618d69c14f02e5f64811effe5))
* update security practices and remove outdated START_HERE files ([c21a7ce](https://github.com/christophe-freijanes/freijstack/commit/c21a7ce3200928962236d6cd840bed6970c703ae))
* update security practices and remove outdated START_HERE files ([#148](https://github.com/christophe-freijanes/freijstack/issues/148)) ([51a8aba](https://github.com/christophe-freijanes/freijstack/commit/51a8aba6584042c5cc4382eb1ea81e4ad5144b2c))

### 🔧 Chores

* **deps-dev:** bump jest in /saas/securevault/backend ([#163](https://github.com/christophe-freijanes/freijstack/issues/163)) ([cc0472f](https://github.com/christophe-freijanes/freijstack/commit/cc0472f8848ceb98ad0662640569f9e6a153c90b))
* **deps-dev:** bump typescript in /saas/securevault/frontend ([#156](https://github.com/christophe-freijanes/freijstack/issues/156)) ([60f7f72](https://github.com/christophe-freijanes/freijstack/commit/60f7f727ed017820b4c87e24e2eeeea40d9f6033))
* **deps:** bump actions/configure-pages from 4 to 5 ([#150](https://github.com/christophe-freijanes/freijstack/issues/150)) ([af333c0](https://github.com/christophe-freijanes/freijstack/commit/af333c072aa915de731b49e010e242d654f1a881))
* **deps:** bump actions/github-script from 7 to 8 ([#155](https://github.com/christophe-freijanes/freijstack/issues/155)) ([d290bfc](https://github.com/christophe-freijanes/freijstack/commit/d290bfc50c29c3e1dc621325be4d9434bf063931))
* **deps:** bump actions/setup-node from 4 to 6 ([#153](https://github.com/christophe-freijanes/freijstack/issues/153)) ([d904200](https://github.com/christophe-freijanes/freijstack/commit/d90420093db023196a0f8ad3965fd39a8a05c062))
* **deps:** bump bcrypt in /saas/securevault/backend ([#157](https://github.com/christophe-freijanes/freijstack/issues/157)) ([00079aa](https://github.com/christophe-freijanes/freijstack/commit/00079aad5220672c5cc5bc2637dd3632c412babf))
* **deps:** bump docker/build-push-action from 5 to 6 ([#151](https://github.com/christophe-freijanes/freijstack/issues/151)) ([956975f](https://github.com/christophe-freijanes/freijstack/commit/956975f98577e66c61581402a9f4c096e6bfe28a))
* **deps:** bump dotenv in /saas/securevault/backend ([#160](https://github.com/christophe-freijanes/freijstack/issues/160)) ([d3ecd8e](https://github.com/christophe-freijanes/freijstack/commit/d3ecd8e7094d6ab1cfd747b9d1dc67e4d5f15af2))
* **deps:** bump express in /saas/securevault/backend ([#166](https://github.com/christophe-freijanes/freijstack/issues/166)) ([e4bd459](https://github.com/christophe-freijanes/freijstack/commit/e4bd459bf1efe57325e943e5fc1d148e7cad6896))
* **deps:** bump express-rate-limit in /saas/securevault/backend ([#159](https://github.com/christophe-freijanes/freijstack/issues/159)) ([5ee6267](https://github.com/christophe-freijanes/freijstack/commit/5ee626700900490cc507d6e5cd2a969984d1b111))
* **deps:** bump helmet in /saas/securevault/backend ([#154](https://github.com/christophe-freijanes/freijstack/issues/154)) ([9b8c331](https://github.com/christophe-freijanes/freijstack/commit/9b8c3315896f6521776b68fe60626dd6e47498f5))
* **deps:** bump joi in /saas/securevault/backend ([#152](https://github.com/christophe-freijanes/freijstack/issues/152)) ([c7b7e65](https://github.com/christophe-freijanes/freijstack/commit/c7b7e65a80f4df66bbbd706a07dadcc3652667cc))
* **deps:** bump lucide-react in /saas/securevault/frontend ([#158](https://github.com/christophe-freijanes/freijstack/issues/158)) ([5972cc6](https://github.com/christophe-freijanes/freijstack/commit/5972cc6fee2e374b51fca9859c9a351ac163767b))
* **deps:** bump react in /saas/securevault/frontend ([#165](https://github.com/christophe-freijanes/freijstack/issues/165)) ([7774ddc](https://github.com/christophe-freijanes/freijstack/commit/7774ddcb20ffe16189039dc7834493903dd61677))
* **deps:** bump react-dom in /saas/securevault/frontend ([#161](https://github.com/christophe-freijanes/freijstack/issues/161)) ([fbc4298](https://github.com/christophe-freijanes/freijstack/commit/fbc429877563894ba4d6868fb2fe969518add169))
* **deps:** bump react-router-dom in /saas/securevault/frontend ([#162](https://github.com/christophe-freijanes/freijstack/issues/162)) ([c72993e](https://github.com/christophe-freijanes/freijstack/commit/c72993eff8d08d12bba08e1df40a1366a431f81c))
* **deps:** bump uuid from 9.0.1 to 13.0.0 in /saas/securevault/backend ([#164](https://github.com/christophe-freijanes/freijstack/issues/164)) ([a13ccda](https://github.com/christophe-freijanes/freijstack/commit/a13ccdaa900012d2d3e6cc9ac47384c90204ba8a))
* update Gitleaks action version and clean up Security.md ([cd552a6](https://github.com/christophe-freijanes/freijstack/commit/cd552a6ce07b8b40c84064309d32c8fcf91dcc55))
* update package.json for improved release rules and add devDependencies ([f84f186](https://github.com/christophe-freijanes/freijstack/commit/f84f1862ea3c14fdb9ee9fb39a653eda5b742904))
* update workflow name and improve formatting in SECURITY.md ([859756d](https://github.com/christophe-freijanes/freijstack/commit/859756de919fb2200f7e49d95e26dd947e18a180))

## [1.37.11](https://github.com/christophe-freijanes/freijstack/compare/v1.37.10...v1.37.11) (2026-01-05)

### 🐛 Bug Fixes

* update README workflows for clarity and organization ([#146](https://github.com/christophe-freijanes/freijstack/issues/146)) ([4c82142](https://github.com/christophe-freijanes/freijstack/commit/4c82142ad04b20996707957e7552ad780c385004))

## [1.37.10](https://github.com/christophe-freijanes/freijstack/compare/v1.37.9...v1.37.10) (2026-01-05)

### ♻️ Code Refactoring

* update workflow names for consistency and clarity ([956b953](https://github.com/christophe-freijanes/freijstack/commit/956b95365db3af1eb543c6641c161272721133a6))

## [1.37.9](https://github.com/christophe-freijanes/freijstack/compare/v1.37.8...v1.37.9) (2026-01-05)

### 🐛 Bug Fixes

* update SecureVault API URLs in post-deploy health check workflow ([c045951](https://github.com/christophe-freijanes/freijstack/commit/c0459510e4ca64f7671f662900210704dcc0adef))

## [1.37.8](https://github.com/christophe-freijanes/freijstack/compare/v1.37.7...v1.37.8) (2026-01-05)

### 🐛 Bug Fixes

* remove outdated Full Deploy badge from pull request template ([6174d0f](https://github.com/christophe-freijanes/freijstack/commit/6174d0fe6ed88a466c393f3a0c874e1b34c1f42f))
* update healthcheck URL description and improve post-deploy check logic ([#145](https://github.com/christophe-freijanes/freijstack/issues/145)) ([e0800c2](https://github.com/christophe-freijanes/freijstack/commit/e0800c2b1021075ad3fcedd07bc6d18bd7830bfd))

## [1.37.7](https://github.com/christophe-freijanes/freijstack/compare/v1.37.6...v1.37.7) (2026-01-05)

### 🐛 Bug Fixes

* update README workflows for clarity and organization ([4562b3f](https://github.com/christophe-freijanes/freijstack/commit/4562b3f9fadf25e6852042bd496c4cfbb7deab26))

## [1.37.6](https://github.com/christophe-freijanes/freijstack/compare/v1.37.5...v1.37.6) (2026-01-05)

### 🐛 Bug Fixes

* update healthcheck URL for SecureVault deployment ([#144](https://github.com/christophe-freijanes/freijstack/issues/144)) ([97a9f03](https://github.com/christophe-freijanes/freijstack/commit/97a9f033d42913e1139afbc3963430fff728995a))

## [1.37.5](https://github.com/christophe-freijanes/freijstack/compare/v1.37.4...v1.37.5) (2026-01-05)

### 🐛 Bug Fixes

* update healthcheck URL description and improve post-deploy check logic ([9a1ebf9](https://github.com/christophe-freijanes/freijstack/commit/9a1ebf9e90feaba7ab3cf829aba3d9a30edfbd5d))

## [1.37.4](https://github.com/christophe-freijanes/freijstack/compare/v1.37.3...v1.37.4) (2026-01-05)

### 🐛 Bug Fixes

* update project links to support internationalization ([#143](https://github.com/christophe-freijanes/freijstack/issues/143)) ([92ae51b](https://github.com/christophe-freijanes/freijstack/commit/92ae51b8d2ed40ff1c4d02e56e69d1fe99e525ac))

## [1.37.3](https://github.com/christophe-freijanes/freijstack/compare/v1.37.2...v1.37.3) (2026-01-05)

### 🐛 Bug Fixes

* update healthcheck URL for SecureVault deployment ([47e2869](https://github.com/christophe-freijanes/freijstack/commit/47e2869154474ab087c6755d15ec1ec82e9118b0))

## [1.37.2](https://github.com/christophe-freijanes/freijstack/compare/v1.37.1...v1.37.2) (2026-01-05)

### 🐛 Bug Fixes

* update API health check URL in production workflow ([#142](https://github.com/christophe-freijanes/freijstack/issues/142)) ([03526dc](https://github.com/christophe-freijanes/freijstack/commit/03526dc83f3ba69ec4295e2f8969db824109b572))

## [1.37.1](https://github.com/christophe-freijanes/freijstack/compare/v1.37.0...v1.37.1) (2026-01-05)

### 🐛 Bug Fixes

* update project links to support internationalization ([b7750b3](https://github.com/christophe-freijanes/freijstack/commit/b7750b37d25c0c8d707763991e7a4b7033e4ea2a))

## [1.37.0](https://github.com/christophe-freijanes/freijstack/compare/v1.36.1...v1.37.0) (2026-01-05)

### 🚀 Features

* update deployment workflow to reorder inputs and enhance custom script support ([#141](https://github.com/christophe-freijanes/freijstack/issues/141)) ([9551fbe](https://github.com/christophe-freijanes/freijstack/commit/9551fbef499937e024010303c8936a06dd796d87))

## [1.36.1](https://github.com/christophe-freijanes/freijstack/compare/v1.36.0...v1.36.1) (2026-01-05)

### 🐛 Bug Fixes

* update API health check URL in production workflow ([3995f78](https://github.com/christophe-freijanes/freijstack/commit/3995f78e12807a560dc4ee10380f7c826f589089))

## [1.36.0](https://github.com/christophe-freijanes/freijstack/compare/v1.35.1...v1.36.0) (2026-01-05)

### 🚀 Features

* update project descriptions and links for Docker and Infrastructure as Code ([e65d63d](https://github.com/christophe-freijanes/freijstack/commit/e65d63d59cf2ed1d58a08c31d68241982b58f98c))

## [1.35.1](https://github.com/christophe-freijanes/freijstack/compare/v1.35.0...v1.35.1) (2026-01-05)

### ♻️ Code Refactoring

* update registry credentials requirements for production deployment ([#140](https://github.com/christophe-freijanes/freijstack/issues/140)) ([fd3d493](https://github.com/christophe-freijanes/freijstack/commit/fd3d4937e7fb7e960e06e203d3aa2d1eeb893266))

## [1.35.0](https://github.com/christophe-freijanes/freijstack/compare/v1.34.0...v1.35.0) (2026-01-05)

### 🚀 Features

* update deployment workflow to reorder inputs and enhance custom script support ([7f78f19](https://github.com/christophe-freijanes/freijstack/commit/7f78f19f38e563084b21193dae2c737e8ce0495a))

## [1.34.0](https://github.com/christophe-freijanes/freijstack/compare/v1.33.6...v1.34.0) (2026-01-05)

### 🚀 Features

* add optional healthcheck URL and migrate service inputs for deployment ([fc89143](https://github.com/christophe-freijanes/freijstack/commit/fc89143d97bf62014cd481bbeb9e346a105bf46f))

## [1.33.6](https://github.com/christophe-freijanes/freijstack/compare/v1.33.5...v1.33.6) (2026-01-05)

### ♻️ Code Refactoring

* remove commented lines for cleaner workflow file ([#138](https://github.com/christophe-freijanes/freijstack/issues/138)) ([#139](https://github.com/christophe-freijanes/freijstack/issues/139)) ([39fa45d](https://github.com/christophe-freijanes/freijstack/commit/39fa45d54a4c32dafd349a520f10388e9797c040))

## [1.33.5](https://github.com/christophe-freijanes/freijstack/compare/v1.33.4...v1.33.5) (2026-01-05)

### ♻️ Code Refactoring

* update registry credentials requirements for production deployment ([b68b205](https://github.com/christophe-freijanes/freijstack/commit/b68b205c2856f58c3d327e747984b65fba638aba))

## [1.33.4](https://github.com/christophe-freijanes/freijstack/compare/v1.33.3...v1.33.4) (2026-01-05)

### ♻️ Code Refactoring

* remove commented lines for cleaner workflow file ([#138](https://github.com/christophe-freijanes/freijstack/issues/138)) ([8c52686](https://github.com/christophe-freijanes/freijstack/commit/8c526861d0e3d75b3fd5101b97566f6b5f4c2dd3))

## [1.33.3](https://github.com/christophe-freijanes/freijstack/compare/v1.33.2...v1.33.3) (2026-01-04)

### ♻️ Code Refactoring

* update registry secret requirements for production deployment ([451e37f](https://github.com/christophe-freijanes/freijstack/commit/451e37f917f5c25ad11e9035a640b83fb767a907))

## [1.33.2](https://github.com/christophe-freijanes/freijstack/compare/v1.33.1...v1.33.2) (2026-01-04)

### ♻️ Code Refactoring

* remove commented lines for cleaner workflow file ([#137](https://github.com/christophe-freijanes/freijstack/issues/137)) ([f7825ca](https://github.com/christophe-freijanes/freijstack/commit/f7825cae50bdfdc01ac6415ec72a126e93c5b33f))

## [1.33.1](https://github.com/christophe-freijanes/freijstack/compare/v1.33.0...v1.33.1) (2026-01-04)

### ♻️ Code Refactoring

* update pull request template and fix registry secrets in deployment workflow ([e93d4d9](https://github.com/christophe-freijanes/freijstack/commit/e93d4d98fcabeb9eb77e31f50584dd8a8d2878fe))

## [1.33.0](https://github.com/christophe-freijanes/freijstack/compare/v1.32.7...v1.33.0) (2026-01-04)

### 🚀 Features

* simplify registry deployment workflow and enhance environment input options ([#136](https://github.com/christophe-freijanes/freijstack/issues/136)) ([cffbc0b](https://github.com/christophe-freijanes/freijstack/commit/cffbc0b6c162ffcc57fbb820ddb84d846ff65f2e))

## [1.32.7](https://github.com/christophe-freijanes/freijstack/compare/v1.32.6...v1.32.7) (2026-01-04)

### 🐛 Bug Fixes

* **frontend:** align lockfile with CRA react-scripts TS4 ([02ec6cf](https://github.com/christophe-freijanes/freijstack/commit/02ec6cf7b463dbeb4340388a6b278a5ef366382b))

### ♻️ Code Refactoring

* remove commented lines for cleaner workflow file ([72242a4](https://github.com/christophe-freijanes/freijstack/commit/72242a4274c35c5d2d46c5f6a242b1c4c5b595f6))

## [1.32.6](https://github.com/christophe-freijanes/freijstack/compare/v1.32.5...v1.32.6) (2026-01-04)

### ♻️ Code Refactoring

* simplify portfolio deployment workflow by removing staging job and inputs ([aaa70c8](https://github.com/christophe-freijanes/freijstack/commit/aaa70c8fcbab99df6a4d54032a20cc9f2739cf68))

### 🔧 Chores

* **securevault:** align package-lock with node 20 for CI build ([ef85684](https://github.com/christophe-freijanes/freijstack/commit/ef856846bdf19731a7ecf6da329249eeb9c92fa6))
* **securevault:** regenerate package-lock for docker build ([c05b096](https://github.com/christophe-freijanes/freijstack/commit/c05b0963ab38c1cc2a22bff128a4d008bb0850d9))

## [1.32.5](https://github.com/christophe-freijanes/freijstack/compare/v1.32.4...v1.32.5) (2026-01-04)

### ♻️ Code Refactoring

* streamline portfolio and securevault build workflows, update Dockerfiles for clarity and efficiency ([dfd69cb](https://github.com/christophe-freijanes/freijstack/commit/dfd69cb9b018699ba9b0518e7b3877698e9d0ca0))

## [1.32.4](https://github.com/christophe-freijanes/freijstack/compare/v1.32.3...v1.32.4) (2026-01-04)

### ♻️ Code Refactoring

* update workflow name for clarity ([45e8034](https://github.com/christophe-freijanes/freijstack/commit/45e8034d93a60df3b2f8cdd53bb109a8afaee67e))

## [1.32.3](https://github.com/christophe-freijanes/freijstack/compare/v1.32.2...v1.32.3) (2026-01-04)

### ♻️ Code Refactoring

* remove unused URLs from health check workflows ([62aa19f](https://github.com/christophe-freijanes/freijstack/commit/62aa19f516e13898dc774401f912421128e7d471))

## [1.32.2](https://github.com/christophe-freijanes/freijstack/compare/v1.32.1...v1.32.2) (2026-01-04)

### ♻️ Code Refactoring

* standardize descriptions and improve registry deployment workflows ([6b99d38](https://github.com/christophe-freijanes/freijstack/commit/6b99d38483870d1f16b8e865916141d1d753c53a))

## [1.32.1](https://github.com/christophe-freijanes/freijstack/compare/v1.32.0...v1.32.1) (2026-01-04)

### ♻️ Code Refactoring

* remove unused permissions and environment variables from registry deploy workflow ([ff5ea8f](https://github.com/christophe-freijanes/freijstack/commit/ff5ea8fb8519eb90895c84b7b09c8bf0f2ef78fe))

## [1.32.0](https://github.com/christophe-freijanes/freijstack/compare/v1.31.0...v1.32.0) (2026-01-04)

### 🚀 Features

* add compatibility flags for security and lint skipping in deployment workflow ([#135](https://github.com/christophe-freijanes/freijstack/issues/135)) ([43326b3](https://github.com/christophe-freijanes/freijstack/commit/43326b33981f908cc6b9974e0d7e1c5dedb250fa))

## [1.31.0](https://github.com/christophe-freijanes/freijstack/compare/v1.30.0...v1.31.0) (2026-01-04)

### 🚀 Features

* simplify registry deployment workflow and enhance environment input options ([79aac09](https://github.com/christophe-freijanes/freijstack/commit/79aac09d1b3604e8f3afa5eeb9ad8681f2aab154))

## [1.30.0](https://github.com/christophe-freijanes/freijstack/compare/v1.29.1...v1.30.0) (2026-01-04)

### 🚀 Features

* update registry link in portfolio, remove .env.example, and enhance .env configurations ([19a073d](https://github.com/christophe-freijanes/freijstack/commit/19a073d4663ff85910d965af7bd6fa6d57c7b1de))

## [1.29.1](https://github.com/christophe-freijanes/freijstack/compare/v1.29.0...v1.29.1) (2026-01-04)

### 🐛 Bug Fixes

* enhance deployment script with improved environment variable handling and error checks ([#134](https://github.com/christophe-freijanes/freijstack/issues/134)) ([e0b37fc](https://github.com/christophe-freijanes/freijstack/commit/e0b37fc810fb7558ed0de6c5e8cd9a081f52d45c))

## [1.29.0](https://github.com/christophe-freijanes/freijstack/compare/v1.28.0...v1.29.0) (2026-01-04)

### 🚀 Features

* add compatibility flags for security and lint skipping in deployment workflow ([87726ed](https://github.com/christophe-freijanes/freijstack/commit/87726ed1393c087b0e7a124ce2936433ee250c8f))

## [1.28.0](https://github.com/christophe-freijanes/freijstack/compare/v1.27.0...v1.28.0) (2026-01-04)

### 🚀 Features

* enhance deployment workflows with improved error handling and registry configurations ([8c50e60](https://github.com/christophe-freijanes/freijstack/commit/8c50e60ff631ee3fadd0b3a2c0f751f8d8456b11))

## [1.27.0](https://github.com/christophe-freijanes/freijstack/compare/v1.26.1...v1.27.0) (2026-01-04)

### 🚀 Features

* enhance registry deployment script with safety checks and improved folder management ([ae4814b](https://github.com/christophe-freijanes/freijstack/commit/ae4814bc4786f0046ce81f9d2c5148bc83d8c28c))

## [1.26.1](https://github.com/christophe-freijanes/freijstack/compare/v1.26.0...v1.26.1) (2026-01-04)

### 🐛 Bug Fixes

* update volume device paths for production and staging registry configurations ([facb09f](https://github.com/christophe-freijanes/freijstack/commit/facb09f0a7a3de3d350504284936800d1c8ebf65))

## [1.26.0](https://github.com/christophe-freijanes/freijstack/compare/v1.25.24...v1.26.0) (2026-01-04)

### 🚀 Features

* enhance registry deployment workflow with preflight checks and improved environment handling ([6d8f0f5](https://github.com/christophe-freijanes/freijstack/commit/6d8f0f51024bae462444101f34faf6867418ba89))

## [1.25.24](https://github.com/christophe-freijanes/freijstack/compare/v1.25.23...v1.25.24) (2026-01-04)

### 🐛 Bug Fixes

* enhance Traefik configuration with logging and network settings; update n8n timezone ([5f30e40](https://github.com/christophe-freijanes/freijstack/commit/5f30e40fea1597b316ffb301cd6e866d9a7fcc7f))

## [1.25.23](https://github.com/christophe-freijanes/freijstack/compare/v1.25.22...v1.25.23) (2026-01-04)

### 🐛 Bug Fixes

* update Docker Compose configurations for production and staging environments with new Traefik routing rules ([8e3d7f1](https://github.com/christophe-freijanes/freijstack/commit/8e3d7f1e74b3319e8d2c8356765fcb58c3db0c05))

## [1.25.22](https://github.com/christophe-freijanes/freijstack/compare/v1.25.21...v1.25.22) (2026-01-04)

### 🐛 Bug Fixes

* update Docker Compose configuration for registry and registry-ui with Traefik routing enhancements ([3203a43](https://github.com/christophe-freijanes/freijstack/commit/3203a43bd2ce9f5258a8795e2bea47757c63eba5))

## [1.25.21](https://github.com/christophe-freijanes/freijstack/compare/v1.25.20...v1.25.21) (2026-01-04)

### 🐛 Bug Fixes

* remove unnecessary skip_security and skip_lint parameters from staging deployment ([#133](https://github.com/christophe-freijanes/freijstack/issues/133)) ([4dddd4d](https://github.com/christophe-freijanes/freijstack/commit/4dddd4d922561304eeec2730b3d7fcf90d5a90ce))

## [1.25.20](https://github.com/christophe-freijanes/freijstack/compare/v1.25.19...v1.25.20) (2026-01-04)

### 🐛 Bug Fixes

* enhance deployment script with improved environment variable handling and error checks ([7311ad9](https://github.com/christophe-freijanes/freijstack/commit/7311ad972e1ec20a7ef1c577cb797deb2dc80ef0))

## [1.25.19](https://github.com/christophe-freijanes/freijstack/compare/v1.25.18...v1.25.19) (2026-01-04)

### 🐛 Bug Fixes

* improve deployment logic for registry environments to prevent conflicts ([#132](https://github.com/christophe-freijanes/freijstack/issues/132)) ([ae1fffd](https://github.com/christophe-freijanes/freijstack/commit/ae1fffd1ac3dc9615d683fb951886473fe97cbf6))

## [1.25.18](https://github.com/christophe-freijanes/freijstack/compare/v1.25.17...v1.25.18) (2026-01-04)

### 🐛 Bug Fixes

* remove unnecessary skip_security and skip_lint parameters from staging deployment ([6dde991](https://github.com/christophe-freijanes/freijstack/commit/6dde9913012e7632f31bc15c60d764b5398b6c5e))

## [1.25.17](https://github.com/christophe-freijanes/freijstack/compare/v1.25.16...v1.25.17) (2026-01-04)

### 🐛 Bug Fixes

* remove unnecessary newline in deployment summary logging ([82b0cb6](https://github.com/christophe-freijanes/freijstack/commit/82b0cb605c2b79f4d8116922ade79a5fff669e7b))

## [1.25.16](https://github.com/christophe-freijanes/freijstack/compare/v1.25.15...v1.25.16) (2026-01-04)

### 🐛 Bug Fixes

* ensure line-length rule is set to warning level in yamllint configuration ([80a581b](https://github.com/christophe-freijanes/freijstack/commit/80a581b1db6cf11598081aef9b94d4b8db8fb5f7))

## [1.25.15](https://github.com/christophe-freijanes/freijstack/compare/v1.25.14...v1.25.15) (2026-01-04)

### ♻️ Code Refactoring

* streamline deployment workflow by removing unused inputs and enhancing logging ([053a9b8](https://github.com/christophe-freijanes/freijstack/commit/053a9b8d192a5042a5f4ea10b2da66fd2a51d3b3))

## [1.25.14](https://github.com/christophe-freijanes/freijstack/compare/v1.25.13...v1.25.14) (2026-01-04)

### 🐛 Bug Fixes

* enhance deployment workflow with improved logging, safety checks, and concurrency management ([73652a8](https://github.com/christophe-freijanes/freijstack/commit/73652a82b0a0975ef1146d7276df5f17a897037d))

## [1.25.13](https://github.com/christophe-freijanes/freijstack/compare/v1.25.12...v1.25.13) (2026-01-04)

### 🐛 Bug Fixes

* streamline deployment process by removing redundant SSH validation and enhancing registry handling ([c9f83bb](https://github.com/christophe-freijanes/freijstack/commit/c9f83bb9687bbee4633f6980fb16305cd458a3a0))

## [1.25.12](https://github.com/christophe-freijanes/freijstack/compare/v1.25.11...v1.25.12) (2026-01-04)

### 🐛 Bug Fixes

* enhance production deployment process with image pulling and registry readiness check ([4574971](https://github.com/christophe-freijanes/freijstack/commit/45749716f4bd9bbd815496f854f8c8f221975961))

## [1.25.11](https://github.com/christophe-freijanes/freijstack/compare/v1.25.10...v1.25.11) (2026-01-04)

### 🐛 Bug Fixes

* update port mapping and labels for staging registry and UI services ([#131](https://github.com/christophe-freijanes/freijstack/issues/131)) ([d13054f](https://github.com/christophe-freijanes/freijstack/commit/d13054f0d04cee861187cf27afa6fb4c99205ce2))

## [1.25.10](https://github.com/christophe-freijanes/freijstack/compare/v1.25.9...v1.25.10) (2026-01-04)

### 🐛 Bug Fixes

* improve deployment logic for registry environments to prevent conflicts ([9df8338](https://github.com/christophe-freijanes/freijstack/commit/9df8338d173a71efb336f1b3638b3af61ab9f847))

## [1.25.9](https://github.com/christophe-freijanes/freijstack/compare/v1.25.8...v1.25.9) (2026-01-04)

### 🐛 Bug Fixes

* update registry credentials for staging environment ([#130](https://github.com/christophe-freijanes/freijstack/issues/130)) ([486f363](https://github.com/christophe-freijanes/freijstack/commit/486f3636da51f298db1d8697fb2c349115e9c755))

## [1.25.8](https://github.com/christophe-freijanes/freijstack/compare/v1.25.7...v1.25.8) (2026-01-04)

### 🐛 Bug Fixes

* update port mapping and labels for staging registry and UI services ([c240d40](https://github.com/christophe-freijanes/freijstack/commit/c240d403d63fc2e4f3b3697cf4f11f4f8361d4c7))

## [1.25.7](https://github.com/christophe-freijanes/freijstack/compare/v1.25.6...v1.25.7) (2026-01-04)

### 🐛 Bug Fixes

* update registry password secrets for staging and production environments ([#129](https://github.com/christophe-freijanes/freijstack/issues/129)) ([39f947b](https://github.com/christophe-freijanes/freijstack/commit/39f947bf7570ea4cc1fad6086823199e542bb682))

## [1.25.6](https://github.com/christophe-freijanes/freijstack/compare/v1.25.5...v1.25.6) (2026-01-04)

### 🐛 Bug Fixes

* update registry credentials for staging environment ([500b6c2](https://github.com/christophe-freijanes/freijstack/commit/500b6c27a6739c762cc2435f34d98ac66fce7f50))

## [1.25.5](https://github.com/christophe-freijanes/freijstack/compare/v1.25.4...v1.25.5) (2026-01-04)

### 🐛 Bug Fixes

* refine condition for staging deployment in workflow ([3818827](https://github.com/christophe-freijanes/freijstack/commit/38188279fd4db54cca46d5486186e8ce00c84b6e))

## [1.25.4](https://github.com/christophe-freijanes/freijstack/compare/v1.25.3...v1.25.4) (2026-01-04)

### 🐛 Bug Fixes

* update registry password secrets for staging and production environments ([15f0b7b](https://github.com/christophe-freijanes/freijstack/commit/15f0b7b148a92f2120618ccdf7221e44a557c992))

## [1.25.3](https://github.com/christophe-freijanes/freijstack/compare/v1.25.2...v1.25.3) (2026-01-04)

### 🐛 Bug Fixes

* rename registry password secret to REGISTRY_PASSWORD_STAGING for clarity ([125ef60](https://github.com/christophe-freijanes/freijstack/commit/125ef604f1ca7be48ea4f0d7e0392324e81ce08a))

## [1.25.2](https://github.com/christophe-freijanes/freijstack/compare/v1.25.1...v1.25.2) (2026-01-04)

### 🐛 Bug Fixes

* update registry password secret for staging environment ([f2453ef](https://github.com/christophe-freijanes/freijstack/commit/f2453ef581e525da787ec4c1b373f640957e0ed7))

## [1.25.1](https://github.com/christophe-freijanes/freijstack/compare/v1.25.0...v1.25.1) (2026-01-04)

### 🐛 Bug Fixes

* update registry credentials for staging and production environments ([2712363](https://github.com/christophe-freijanes/freijstack/commit/27123639cab0e35443b5d431f725606ee0f81058))

## [1.25.0](https://github.com/christophe-freijanes/freijstack/compare/v1.24.14...v1.25.0) (2026-01-04)

### 🚀 Features

* add REGISTRY_PASSWORD_PROD input for deployment workflows ([dcbba5f](https://github.com/christophe-freijanes/freijstack/commit/dcbba5f010dc7364ac1fba3d3f237bf854069aba))

## [1.24.14](https://github.com/christophe-freijanes/freijstack/compare/v1.24.13...v1.24.14) (2026-01-04)

### 🐛 Bug Fixes

* update registry password secret for staging deployment ([#127](https://github.com/christophe-freijanes/freijstack/issues/127)) ([a277c72](https://github.com/christophe-freijanes/freijstack/commit/a277c72f2f8d7b5fc6f036e9e10ed0558b1ca1b2))

## [1.24.13](https://github.com/christophe-freijanes/freijstack/compare/v1.24.12...v1.24.13) (2026-01-04)

### 🐛 Bug Fixes

* unify registry password secret for staging and production deployments ([9328503](https://github.com/christophe-freijanes/freijstack/commit/932850357450a7ea151bdc9c271e1f7fc265fd0c))

## [1.24.12](https://github.com/christophe-freijanes/freijstack/compare/v1.24.11...v1.24.12) (2026-01-04)

### 🐛 Bug Fixes

* update path for .htpasswd generation in deploy workflow ([#126](https://github.com/christophe-freijanes/freijstack/issues/126)) ([f99beac](https://github.com/christophe-freijanes/freijstack/commit/f99beacd888b290cbfd21ed3b8a108c30d17dd90))

## [1.24.11](https://github.com/christophe-freijanes/freijstack/compare/v1.24.10...v1.24.11) (2026-01-04)

### 🐛 Bug Fixes

* update registry password secret for staging deployment ([954664e](https://github.com/christophe-freijanes/freijstack/commit/954664ebbfa1ce85bb120d4bba9bf72d9fed73f2))

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
