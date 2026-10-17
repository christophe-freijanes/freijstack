
<a id="freijstack-"></a>
# FreijStack

[![Infrastructure](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/02-infra-deploy.yml?branch=master&label=Infrastructure&style=flat-square&logo=github-actions)](https://github.com/christophe-freijanes/freijstack/actions/workflows/02-infra-deploy.yml)
[![Production Health Check](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/05-health-prod.yml?branch=develop&label=Prod%20Health&style=flat-square&logo=github-actions)](https://github.com/christophe-freijanes/freijstack/actions/workflows/05-health-prod.yml)
[![Development Health Check](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/05-health-dev.yml?branch=develop&label=Dev%20Health&style=flat-square&logo=github-actions)](https://github.com/christophe-freijanes/freijstack/actions/workflows/05-health-dev.yml)
[![CodeQL](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/01-security-codeql.yml?branch=master&label=CodeQL&style=flat-square&logo=github-actions)](https://github.com/christophe-freijanes/freijstack/actions/workflows/01-security-codeql.yml)
[![Security Check](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/01-security-gitleaks-schedule.yml?branch=develop&label=Security%20Check&style=flat-square&logo=github-actions)](https://github.com/christophe-freijanes/freijstack/actions/workflows/01-security-gitleaks-schedule.yml)
[![Release Automation](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/07-release-automation.yml?branch=master&label=Release%20Automation&style=flat-square&logo=github-actions)](https://github.com/christophe-freijanes/freijstack/actions/workflows/07-release-automation.yml)
[![SecureVault](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/03-app-securevault-deploy.yml?branch=master&label=SecureVault&style=flat-square&logo=github-actions)](https://github.com/christophe-freijanes/freijstack/actions/workflows/03-app-securevault-deploy.yml)
[![Portfolio](https://img.shields.io/website?down_color=red&down_message=offline&label=Portfolio&style=flat-square&up_color=brightgreen&up_message=online&url=https%3A%2F%2Fportfolio.freijstack.com)](https://portfolio.freijstack.com)
[![Last Commit](https://img.shields.io/github/last-commit/christophe-freijanes/freijstack?label=Mise%20%C3%A0%20jour&style=flat-square&color=blue)](https://github.com/christophe-freijanes/freijstack/commits)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square&logo=readme)](LICENSE)

---

<a id="-résumé"></a>
## Résumé

**FreijStack** est une stack DevSecOps pour déployer, monitorer et sécuriser des applications SaaS (Portfolio, SecureVault, Registre Docker, n8n...) sur VPS, avec :

✅ **CI/CD automatisé** - GitHub Actions avec 21+ workflows  
✅ **Infrastructure Docker** - Traefik, nginx, services conteneurisés  
✅ **Sécurité intégrée** - AES-256-GCM, JWT, RBAC, audit logs  
✅ **Monitoring 24/7** - Prometheus, Grafana, Loki, alertes  
✅ **High Availability** - Auto-healing, backups multi-cloud, health checks  
✅ **Staging automatisé** - Environnements éphémères, tests CI/CD  

Projet maintenu par **Christophe FREIJANES** – Senior Cloud & Security Specialist (DevSecOps)

---

<a id="-table-des-matières"></a>
## Table des matières

- [Accès rapides](#accès-rapides)
- [Démarrage rapide](#démarrage-rapide)
- [Documentation](#documentation)
- [Structure du projet](#structure-du-projet)
- [CI/CD Pipeline](#cicd-pipeline)
- [Technologies](#technologies)
- [Sécurité](#sécurité)
- [Compétences clés](#compétences-clés)
- [Contact](#contact)

---

<a id="-accès-rapides"></a>
## Accès rapides

- **Portfolio Production** : https://portfolio.freijstack.com/
- **Portfolio Staging** : https://portfolio-staging.freijstack.com/
- **SecureVault** : https://vault.freijstack.com/
- **API SecureVault** : https://vault-api.freijstack.com/
- **Docker Registry** : https://registry.freijstack.com/
- **Registry UI** : https://registry-ui.freijstack.com/
- **n8n Automation** : https://automation.freijstack.com/

---

<a id="-démarrage-rapide"></a>
## Démarrage rapide

### Infrastructure de Base (Traefik, nginx, n8n)

```bash
cd base-infra
docker volume create traefik_data
docker volume create n8n_data
docker compose up -d
docker compose ps
```

### Portfolio (Local)

```bash
cd saas/portfolio
# Ouvrir index.html ou lancer :
python3 -m http.server 8000
# http://localhost:8000
```

### SecureVault

```bash
cd saas/securevault
cp .env.example .env && nano .env
docker compose up -d --build
./init-db.sh
```

---


<a id="-documentation-complète"></a>
## Documentation

| Document | Description |
|----------|-------------|
| [Index & Navigation](docs/00-overview/INDEX.md) | Navigation de la documentation |
| [Architecture Technique](docs/01-architecture/ARCHITECTURE.md) | Vue d'ensemble infrastructure, CI/CD, déploiement |
| [Infrastructure Base](base-infra/README.md) | Docker Compose, Traefik v2, n8n, intégration |
| [Guide Déploiement](docs/02-deployment/DEPLOYMENT.md) | Déploiement complet sur VPS, étape par étape |
| [SecureVault Pro](docs/02-deployment/PRO_DEPLOYMENT.md) | Déploiement avancé SecureVault production |
| [CI/CD Architecture](docs/01-architecture/CI_CD_ARCHITECTURE.md) | Diagramme Mermaid, 21+ workflows documentés |
| [Guide Automatisation](docs/03-guides/AUTOMATION_GUIDE.md) | CI/CD, staging éphémère, health checks, rollback |
| [SecureVault Manager](saas/securevault/README.md) | Gestionnaire de secrets chiffrés, AES-256-GCM |
| [Applications SaaS](saas/README.md) | Portfolio, SecureVault, Harbor - Vue d'ensemble |
| [Monitoring & Alertes](docs/03-guides/MONITORING.md) | Prometheus, Grafana, Loki, dashboards |
| [Troubleshooting](docs/04-operations/TROUBLESHOOTING.md) | Diagnostic, CORS, Registration, déploiement |
| [Sécurité](SECURITY.md) | Bonnes pratiques, secrets, chiffrement |
| [Audit Documentaire](docs/05-reference/DOCUMENTATION_AUDIT.md) | Audit complet de la documentation |
| [Pull Request Template](.github/pull_request_template.md) | Checklist validation PR |

---

<a id="-structure-du-projet"></a>
## Structure du Projet

```
freijstack/
├── .github/
│   ├── workflows/                    # 21+ GitHub Actions workflows
│   │   ├── 02-infra-deploy.yml    # Traefik + n8n + portfolio
│   │   ├── 03-app-securevault-deploy.yml      # SecureVault prod/staging
│   │   ├── 03-app-registry-deploy.yml         # Docker Registry deployment
│   │   ├── 03-app-registry-cleanup.yml        # Registry image cleanup
│   │   ├── 01-security-codeql.yml                  # SAST security scanning
│   │   ├── 01-security-gitleaks.yml           # Gitleaks + secret detection
│   │   ├── 05-health-prod.yml        # 24/7 monitoring production
│   │   ├── 05-health-dev.yml         # Staging health checks
│   │   ├── 07-release-automation.yml      # Semantic versioning
│   │   ├── 06-maint-backup.yml                  # Automated backups
│   │   ├── 06-maint-rotate-secrets.yml          # Secret rotation
│   │   └── ...autres workflows
│   └── pull_request_template.md
│
├── base-infra/                      # 🏗️ Infrastructure centralisée
│   ├── docker-compose.yml              # Traefik + n8n + portfolio
│   ├── BASE_INTEGRATION.md             # Guide d'intégration services
│   └── README.md                       # Documentation infrastructure
│
├── saas/                            # 🚀 Applications SaaS
│   ├── portfolio/                      # 🌐 Portfolio multilingue
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   ├── public/                     # Images, favicons, assets
│   │   ├── Dockerfile                  # Multi-stage build
│   │   ├── docker-compose.yml          # Development
│   │   ├── docker-compose.prod.yml     # Production
│   │   └── README.md
│   ├── securevault/                    # 🔐 Gestionnaire secrets
│   │   ├── backend/                    # Node.js + Express
│   │   ├── frontend/                   # React 18
│   │   ├── docker-compose.yml          # Production
│   │   ├── init-db.sh                  # Database initialization
│   │   └── README.md
│   ├── registry/                       # 🐳 Container Registry
│   │   ├── docker-compose.yml          # Production
│   │   ├── docker-compose.staging.yml  # Staging
│   │   ├── docker-compose.prod.yml     # Production overrides
│   │   ├── config.yml                  # Registry configuration
│   │   ├── generate-htpasswd.sh        # Auth generation
│   │   └── README.md
│   └── README.md                       # Vue d'ensemble SaaS
│
├── docs/                            # 📚 Documentation
│   ├── INDEX.md                        # Navigation principale
│   ├── ARCHITECTURE.md                 # Architecture technique
│   ├── CI_CD_ARCHITECTURE.md           # CI/CD avec Mermaid
│   ├── AUTOMATION_GUIDE.md             # Guide automatisation
│   ├── DEPLOYMENT.md                   # Déploiement VPS
│   ├── MONITORING.md                   # Prometheus/Grafana/Loki
│   ├── TROUBLESHOOTING.md              # Diagnostic & solutions
│   ├── PRO_DEPLOYMENT.md               # Features avancées
│   ├── FEATURES_ROADMAP.md             # Roadmap produit
│   └── ...autres documentations
│
├── docs-private/                    # 🔒 Documentation sensible
│   ├── SECRET_ROTATION.md              # Rotation des secrets
│   ├── SSO_SAML_CONFIG.md              # Configuration SAML
│   ├── REGISTRY_PROD_SETUP_SUMMARY.md  # Setup Registry production
│   └── SECURITY_AUDIT.md               # Audits sécurité
│
├── scripts/                         # 🛠️ Scripts utilitaires
│   ├── backup-to-cloud.sh              # Backup AWS S3 + Azure
│   ├── generate-secrets.ps1            # Génération secrets
│   ├── rotate-secrets.sh               # Rotation sécurisée
│   ├── run-migrations.sh               # Migrations DB
│   ├── security-check.sh               # Audits sécurité
│   ├── deploy-registry.sh              # Deploy registry
│   ├── cleanup-registry-images.sh      # Cleanup images
│   ├── docs-generate.ps1/.sh           # Documentation generation
│   └── ...autres scripts
│
├── .gitignore
├── .gitleaks.toml                   # Config Gitleaks
├── .releaserc                       # Config semantic-release
├── CHANGELOG.md                     # Historique releases
├── SECURITY.md                      # Politique sécurité
├── LICENSE                          # All Rights Reserved
├── package.json                     # Config sémantic-release
└── README.md                        # Ce fichier
```

<a id="-sections"></a>
## Sections

### Infrastructure (`/base-infra`)

Infrastructure centralisée gérée par Docker Compose:
- **Traefik v2.10**: Reverse proxy + TLS automatique (Let's Encrypt)
- **n8n**: Plateforme d'automation no-code (automation.freijstack.com)
- **Portfolio**: Site web statique nginx (production + staging)

Tous les services partagent le réseau Docker `web` pour la communication avec Traefik.
- **nginx** : serveur web statique pour Portfolio (volumes `/srv/www`).

Voir [base-infra/README.md](base-infra/README.md) pour les détails.

### Portfolio (`/portfolio`)

Portfolio web multilingue (FR/EN) avec:
- **Design responsif** HTML5/CSS3 vanilla
- **Thèmes saisonniers** automatiques (Hiver/Printemps/Été/Automne)
- **Système i18n** (150+ clés de traduction)
- **Animations** (profil photo, curseur lumineux, hover effects)
- **Certifications** avec lien vers Credly
- **Skills** 9 catégories (Cloud & Security, DevSecOps, Backup, Automation, Monitoring, OS, Virtualization, Storage, Methodologies)
- **Expériences** 5 positions (HARDIS, DIGIMIND, ECONOCOM, SQUAD, ACENSI)
- **Projets** 6 réalisations avec détails techniques
- **Sécurité**: Content Security Policy, WCAG AA compliance

**Accès**:
- Docker Registry** — Registre Docker privé
- Docker Registry v2
- Joxit UI pour gestion visuelle
- Authentification htpasswd
- Stockage local/cloud
- Cleanup automatisé des anciennes images

Voir [saas/registry/README.md](saas/registry/README.md).

**3. **Production**: https://portfolio.freijstack.com/
- **Staging**: https://portfolio-staging.freijstack.com/
- **Local**: Ouvrir `saas/portfolio/index.html` dans un navigateur

### SaaS Démos (`/saas`)

Applications SaaS conteneurisées de démonstration :

**1. SecureVault Manager** — Gestionnaire de secrets chiffrés
- Secrets chiffrés (AES-256-GCM)
- ✅ Authentification JWT + RBAC
- Audit logs détaillés
- Docker + Traefik + TLS
- PostgreSQL

Voir [saas/securevault/README.md](saas/securevault/README.md).

**2. n8n** — Plateforme d'automation & workflows
- Visual workflow builder
- 400+ intégrations natives
- Scheduling & webhooks
- ETL & data sync
- Credential management

ℹ n8n est géré et documenté dans [base-infra/README.md](base-infra/README.md) (voir la section dédiée à l'automation).

**Vue d'ensemble SaaS**: [saas/README.md](saas/README.md)

### Documentation (`/docs`)

- `architecture.md` - Vue d'ensemble de l'architecture technique et déploiement

<a id="-cicd-pipeline"></a>
## CI/CD Pipeline

Le projet utilise **GitHub Actions** avec un pipeline de déploiement automatique.

### Branches & Déploiement

| Branche | Environnement | URL | Déclenché sur |
|---------|--------------|-----|---------------|
| `develop` | Staging | https://portfolio-staging.freijstack.com | Push sur develop |
| `master` | Production | https://portfolio.freijstack.com | Push sur master |

### Pipeline Jobs

1. ✅ **Validate & Lint**
   - HTML validation (W3C)
   - CSS/JS syntax check

2. **Build & Optimize**
   - CSS minification (csso-cli)
   - JS minification (terser)
   - Asset optimization

3. **Security Scan**
   - **CodeQL** - Code analysis
   - **Gitleaks** - Secret detection
   - **Trivy** - Vulnerability scanning

4. **Deploy to GitHub Pages**
   - Staging uniquement (develop branch)
   - Backup automatique

5. **Deploy to VPS**
   - Déploiement via rsync (SSH)
   - Traefik restart pour routing
   - Production + Staging paths

6. **Post-Deploy**
   - Backup cleanup (garde 7 derniers)
   - Validation des URLs
   - Status notifications

**Voir**: Les fichiers dans [.github/workflows/](.github/workflows/) pour la configuration CI/CD détaillée.

<a id="-infrastructure--déploiement"></a>
## Infrastructure & Déploiement

### Stack Technique

| Composant | Technologie | Usage |
|-----------|------------|-------|
| **Serveur** | Ubuntu 22.04 VPS | Hébergement principal |
| **Reverse Proxy** | Traefik v2.10 | Routing + TLS automatique |
| **Web Server** | nginx:alpine | Serveur de fichiers statiques |
| **Containerisation** | Docker Compose v2 | Orchestration services |
| **TLS** | Let's Encrypt (ACME) | Certificats SSL automatiques |
| **DNS** | Subdomain routing | portfolio.freijstack.com |

### Architecture Déploiement

```
Internet
   |
   v
Traefik (Port 80/443)
   ├─> portfolio.freijstack.com -> nginx (Production)
   └─> portfolio-staging.freijstack.com -> nginx (Staging)

Paths sur VPS:
/srv/www/
├── portfolio/           # Production (master branch)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── ...
└── portfolio-staging/   # Staging (develop branch)
    ├── index.html
    ├── style.css
    ├── script.js
    └── ...
```

### Processus de Déploiement

1. **Commit & Push** → GitHub (develop ou master)
2. **GitHub Actions** → Pipeline CI/CD déclenché
3. **Build & Tests** → Validation + Security scans
4. **Deploy** → rsync via SSH vers VPS
5. **Routing** → Traefik restart + health check
6. **Live** → Site accessible via HTTPS

**Voir**: [Architecture Détaillée](docs/01-architecture/ARCHITECTURE.md)

### Démarrage Rapide

#### Infrastructure de Base (Traefik, nginx, n8n)

```bash
cd base-infra

# Créer volumes
docker volume create traefik_data
docker volume create n8n_data

# Démarrer services
docker compose up -d

# Vérifier status
docker compose ps
```

#### Portfolio (Local)

```bash
cd saas/portfolio

# Option 1: Ouvrir directement le fichier
# Double-cliquez sur index.html

# Option 2: Serveur local Python
python3 -m http.server 8000
# Accès: http://localhost:8000

# Option 3: Serveur local Node.js
npx http-server .
# Accès: http://localhost:8080
```

### Applications SaaS

#### SecureVault Manager

```bash
cd saas/securevault
cp .env.example .env && nano .env
docker compose up -d --build
./init-db.sh

# Vérification
curl https://vault-api.freijstack.com/health
```

#### n8n

```bash
# Géré par base-infra/docker compose.yml
# Accessible sur https://n8n.freijstack.com ou http://localhost:5678
```

### En Développement

```bash
# Clone du repo
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack

# Installation
npm install

# Développement sur develop
git checkout develop

# Commit et push pour déclencher CI/CD
git add .
git commit -m "feat: mise à jour portfolio"
git push origin develop

# Vérifier https://portfolio-staging.freijstack.com/
# Puis merger vers master quand prêt
```

<a id="-technologies"></a>
## Technologies

### Portfolio
- HTML5, CSS3 (CSS Variables, Flexbox, Grid)
- JavaScript vanilla (pas de frameworks)
- Font Awesome 6.4.0
- Google Fonts
- Responsive Design, CSP, WCAG AA

### SaaS
- Docker / Containerization
- Node.js / Python (selon l'app)
- Microservices
- CI/CD (GitHub Actions)
- WebSockets / REST APIs

### Infrastructure
- Ubuntu 22.04 LTS
- nginx + Traefik
- Let's Encrypt / ACME
- SSH + rsync
- GitHub Actions

<a id="-sécurité"></a>
## Sécurité

✅ **Portfolio**:
- Content Security Policy (CSP) headers
- No external tracking
- WCAG AA compliance
- HTML validation

✅ **CI/CD**:
- Gitleaks (secrets scanning)
- Trivy (vulnerability scanning)
- CodeQL (SAST)
- GitHub token permissions (minimal)

✅ **Infrastructure**:
- TLS 1.3 (Let's Encrypt)
- Firewall rules
- Path-based routing (no root exposure)
- SSH key-based auth

<a id="-langues"></a>
## Langues

Portfolio entièrement traduit:
- Français (FR)
- Anglais (EN)

Sélection de langue automatique avec persistance localStorage.

<a id="-compétences-clés"></a>
## Compétences Clés

- Cloud: AWS, Azure, GCP, Kubernetes, Docker
- Sécurité: DevSecOps, SIEM, WAF, PKI, Hardening
- Infrastructure: IaC (Terraform, Ansible), Proxmox, VMware
- Monitoring: Prometheus, ELK, Grafana, Splunk
- Méthodologies: Agile, ITIL, CI/CD, GitOps


<a id="-contact"></a>
## Contact

- [Certifications Credly](https://www.credly.com/users/christophe-freijanes)
- [LinkedIn & Email](https://portfolio.freijstack.com/) (voir section contact du portfolio)

<a id="-licence"></a>
## Licence

Tous droits réservés © 2025 Christophe FREIJANES

---

<div align="center">

[![Last Commit](https://img.shields.io/github/last-commit/christophe-freijanes/freijstack?label=Derni%C3%A8re%20mise%20%C3%A0%20jour&style=for-the-badge&color=blue)](https://github.com/christophe-freijanes/freijstack/commits)
[![Issues](https://img.shields.io/github/issues/christophe-freijanes/freijstack?style=for-the-badge&color=yellow)](https://github.com/christophe-freijanes/freijstack/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/christophe-freijanes/freijstack?style=for-the-badge&color=green)](https://github.com/christophe-freijanes/freijstack/pulls)

</div>
