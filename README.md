# FreijStack 🚀

[![CI/CD Pipeline](https://img.shields.io/github/actions/workflow/status/christophe-freijanes/freijstack/main.yml?branch=master&label=CI%2FCD&style=flat-square)](https://github.com/christophe-freijanes/freijstack/actions)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](LICENSE)
[![Top Language](https://img.shields.io/github/languages/top/christophe-freijanes/freijstack?style=flat-square&color=yellow)](https://github.com/christophe-freijanes/freijstack)
[![Code Size](https://img.shields.io/github/languages/code-size/christophe-freijanes/freijstack?style=flat-square&color=green)](https://github.com/christophe-freijanes/freijstack)
[![Last Commit](https://img.shields.io/github/last-commit/christophe-freijanes/freijstack?label=Derni%C3%A8re%20MAJ&style=flat-square&color=blue)](https://github.com/christophe-freijanes/freijstack/commits)
[![Stars](https://img.shields.io/github/stars/christophe-freijanes/freijstack?style=flat-square&color=orange)](https://github.com/christophe-freijanes/freijstack/stargazers)

Portfolio et projets cloud & sécurité de **Christophe FREIJANES** - Senior Cloud & Security Specialist (DevSecOps).

**Live**: https://portfolio.freijstack.com/ | **Staging**: https://portfolio-staging.freijstack.com/

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| 📘 [Architecture Technique](docs/architecture.md) | Vue d'ensemble de l'infrastructure, déploiement, et CI/CD |
| 📗 [Portfolio README](portfolio/README.md) | Documentation complète du portfolio (features, i18n, sécurité) |
| 📙 [SaaS Apps README](saas/README.md) | Applications SaaS démonstratives (App1, App2) |
| 📕 [App1 - Gestionnaire de Tâches](saas/app1/README.md) | Application CRUD sécurisée avec authentification |
| 📓 [App2 - Service Notifications](saas/app2/README.md) | Microservice temps réel avec WebSockets |
| 🔖 [Pull Request Template](.github/pull_request_template.md) | Checklist de validation pour les PR |

---

## 📋 Structure du Projet

```
freijstack/
├── .github/
│   ├── workflows/           # CI/CD pipelines (GitHub Actions)
│   │   └── main.yml         # Deploy staging + production
│   └── pull_request_template.md  # PR validation checklist
├── portfolio/               # Portfolio web professionnel
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── data.json
│   ├── public/              # Assets publics
│   └── README.md            # Doc portfolio
├── saas/                    # Applications SaaS démos
│   ├── app1/                # Gestionnaire de tâches sécurisé
│   │   ├── Dockerfile
│   │   └── README.md
│   ├── app2/                # Service de notifications temps réel
│   │   ├── Dockerfile
│   │   └── README.md
│   └── README.md            # Vue d'ensemble SaaS
├── docs/
│   ├── architecture.md      # Documentation technique
│   └── README.md
├── package.json             # Scripts et dépendances
└── README.md                # Ce fichier
```

## 🎯 Sections

### Portfolio (`/portfolio`)

Portfolio web multilingue (FR/EN) avec:
- **Design responsif** HTML5/CSS3 vanilla
- **Thèmes saisonniers** automatiques (Hiver/Printemps/Été/Automne)
- **Système i18n complet** (150+ clés de traduction)
- **Animations fluides** (profil photo, curseur lumineux, hover effects)
- **Certifications** avec lien vers Credly
- **Skills** 9 catégories (Cloud & Security, DevSecOps, Backup, Automation, Monitoring, OS, Virtualization, Storage, Methodologies)
- **Expériences** 5 positions (HARDIS, DIGIMIND, ECONOCOM, SQUAD, ACENSI)
- **Projets** 6 réalisations avec détails techniques
- **Sécurité**: Content Security Policy, WCAG AA compliance

**Accès**: 
- 📍 **Production**: https://portfolio.freijstack.com/
- 📍 **Staging**: https://portfolio-staging.freijstack.com/
- 📍 **Local**: Ouvrir `portfolio/index.html` dans un navigateur

### SaaS Démos (`/saas`)

Exemples d'applications SaaS conteneurisées démontrant les compétences DevSecOps:

#### App1: Gestionnaire de Tâches Sécurisé
- API RESTful sécurisée avec authentification
- Base de données persistante
- Interface utilisateur interactive
- Conteneurisation Docker
- CI/CD ready

#### App2: Service de Notification en Temps Réel
- WebSockets pour communication en direct
- Architecture microservices
- Intégration NoSQL
- Sécurité par conception
- Déploiement automatisé

Voir [saas/README.md](saas/README.md) pour plus de détails.

### Documentation (`/docs`)

- `architecture.md` - Vue d'ensemble de l'architecture technique et déploiement

## 🚀 CI/CD Pipeline

Le projet utilise **GitHub Actions** avec un pipeline de déploiement automatique complet.

### Branches & Déploiement

| Branche | Environnement | URL | Déclenché sur |
|---------|--------------|-----|---------------|
| `develop` | Staging | https://portfolio-staging.freijstack.com | Push sur develop |
| `master` | Production | https://portfolio.freijstack.com | Push sur master |

### Pipeline Jobs

1. ✅ **Validate & Lint**
   - HTML validation (W3C)
   - CSS/JS syntax check

2. 🔨 **Build & Optimize**
   - CSS minification (csso-cli)
   - JS minification (terser)
   - Asset optimization

3. 🔐 **Security Scan**
   - **CodeQL** - Code analysis
   - **Gitleaks** - Secret detection
   - **Trivy** - Vulnerability scanning

4. 🌐 **Deploy to GitHub Pages**
   - Staging uniquement (develop branch)
   - Backup automatique

5. 🚀 **Deploy to VPS**
   - Déploiement via rsync (SSH)
   - Traefik restart pour routing
   - Production + Staging paths

6. 📊 **Post-Deploy**
   - Backup cleanup (garde 7 derniers)
   - Validation des URLs
   - Status notifications

**Voir**: [CI/CD Configuration](.github/workflows/main.yml)

## 🏗️ Infrastructure & Déploiement

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

**Voir**: [Architecture Détaillée](docs/architecture.md)

## 🚀 Démarrage Rapide

### Portfolio (Local)

```bash
cd portfolio

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

```bash
# App1
cd saas/app1
docker build -t app1 .
docker run -p 8080:8080 app1

# App2
cd saas/app2
docker build -t app2 .
docker run -p 8081:8081 app2
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

## 💻 Technologies

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

## 🔐 Sécurité

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

## 🌍 Langues

Portfolio entièrement traduit:
- 🇫🇷 Français (FR)
- 🇬🇧 Anglais (EN)

Sélection de langue automatique avec persistance localStorage.

## 📊 Compétences Clés

- Cloud: AWS, Azure, GCP, Kubernetes, Docker
- Sécurité: DevSecOps, SIEM, WAF, PKI, Hardening
- Infrastructure: IaC (Terraform, Ansible), Proxmox, VMware
- Monitoring: Prometheus, ELK, Grafana, Splunk
- Méthodologies: Agile, ITIL, CI/CD, GitOps

## 📬 Contact

- 🎓 Credly: [Certifications](https://www.credly.com/users/christophe-freijanes)
- 💼 LinkedIn: Disponible dans le portfolio
- 📧 E-mail: Disponible dans le portfolio

## 📝 Licence

Tous droits réservés © 2025 Christophe FREIJANES

---

<div align="center">

[![Last Commit](https://img.shields.io/github/last-commit/christophe-freijanes/freijstack?label=Derni%C3%A8re%20mise%20%C3%A0%20jour&style=for-the-badge&color=blue)](https://github.com/christophe-freijanes/freijstack/commits)
[![Issues](https://img.shields.io/github/issues/christophe-freijanes/freijstack?style=for-the-badge&color=yellow)](https://github.com/christophe-freijanes/freijstack/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/christophe-freijanes/freijstack?style=for-the-badge&color=green)](https://github.com/christophe-freijanes/freijstack/pulls)

</div>
