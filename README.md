# FreijStack

Portfolio et projets cloud & sécurité de **Christophe FREIJANES** - Senior Cloud & Security Specialist (DevSecOps).

**Live**: https://portfolio.freijstack.com/

## 📋 Structure du Projet

```
freijstack/
├── portfolio/          # Portfolio web professionnel (HTML/CSS/JS)
├── saas/              # Applications SaaS démos (DevSecOps, Microservices)
├── docs/              # Documentation et architecture
├── .github/workflows/ # CI/CD pipelines (GitHub Actions)
├── package.json       # Dépendances du projet
└── README.md          # Ce fichier
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

Le projet utilise **GitHub Actions** avec un pipeline complet:

### Branches
- `develop` - Staging (déploié vers `/portfolio-staging` + GitHub Pages)
- `master` - Production (déploié vers `/portfolio` sur VPS)

### Jobs
1. **Validate & Lint** - HTML/CSS/JS linting
2. **Build & Optimize** - Minification CSS/JS
3. **Security Scan** - Trivy, Gitleaks, CodeQL
4. **Deploy to GitHub Pages** (staging uniquement)
5. **Deploy to Hostinger** (staging + production)
6. **Notifications** - Status reports

**Détails**: Voir `.github/workflows/main.yml`

## 🏗️ Déploiement

### Infrastructure
- **VPS**: Hostinger (Ubuntu 22.04)
- **Web Server**: nginx + Traefik (reverse proxy)
- **TLS**: Let's Encrypt via ACME
- **DNS**: Traefik path-based routing

### Paths
```
/srv/www/
├── portfolio/           # Production (master branch)
└── portfolio-staging/   # Staging (develop branch)
```

### Déploiement Automatique
- Chaque commit sur `develop` déploie vers `portfolio-staging.freijstack.com`
- Chaque commit sur `master` déploie vers `portfolio.freijstack.com`
- Utilise SSH + rsync pour transfert sécurisé

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

## 🛡️ Gouvernance & Sécurité du Dépôt

- Visibilité: recommandé en mode Private (GitHub Settings → Danger Zone).
- Branch protection: exiger revues des PR et statuts CI (CodeQL, Gitleaks, Trivy, README consistency).
- Propriété de code: voir [CODEOWNERS](.github/CODEOWNERS) — les dossiers clés nécessitent approbation.
- Signalement sécurité: lire [SECURITY.md](.github/SECURITY.md) pour divulgation responsable.
- README consistency: le workflow [readme-consistency.yml](.github/workflows/readme-consistency.yml) exige la mise à jour des README quand des dossiers changent.
- Secrets: ne jamais committer `.env`, clés et certificats (cf. `.gitignore`).
- Assets minifiés: production charge `style.min.css` et `script.min.js` générés par CI.
 - PR checklist: utiliser le modèle [.github/pull_request_template.md](.github/pull_request_template.md) pour valider README, sécurité, CI et accessibilité.

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

**Dernière mise à jour**: Décembre 2025
