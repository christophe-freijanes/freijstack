# Architecture Technique - FreijStack

Documentation technique complète de l'infrastructure, du déploiement et de l'architecture du portfolio professionnel de Christophe FREIJANES.

**Dernière mise à jour**: Janvier 2026  
**Domaine principal**: https://portfolio.freijstack.com  
**Environnement staging**: https://portfolio-staging.freijstack.com

---

## Table des Matières

1. [Vue d'ensemble du Projet](#1-vue-densemble-du-projet)
2. [Composants Principaux](#2-composants-principaux)
3. [Infrastructure & Hébergement](#3-infrastructure--hébergement)
4. [Pipeline CI/CD](#4-pipeline-cicd)
5. [Sécurité & Conformité](#5-sécurité--conformité)
6. [Maintenance & Monitoring](#6-maintenance--monitoring)

---

## 1. Vue d'ensemble du Projet

Le dépôt `freijstack` héberge un **portfolio professionnel moderne** avec des démonstrations d'applications SaaS, mettant en avant les compétences DevSecOps de Christophe FREIJANES.

### 1.1. Structure Actuelle


```
freijstack/
├── .github/
│   ├── workflows/                  # CI/CD pipelines (GitHub Actions)
│   │   ├── infrastructure-deploy.yml
│   │   ├── securevault-deploy.yml
│   │   ├── production-healthcheck.yml
│   │   ├── release.yml
│   │   └── ...
│   └── pull_request_template.md    # Checklist validation PR
├── base-infra/                     # 🏗️ Infrastructure centralisée (Traefik, n8n, etc.)
│   ├── docker-compose.yml          # Traefik + n8n + portfolio (prod + staging)
│   ├── BASE_INTEGRATION.md         # Guide d'intégration
│   └── README.md                   # Documentation infrastructure
├── saas/
│   ├── portfolio/                  # 🌐 Portfolio web multilingue
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   ├── public/
│   │   └── README.md
│   ├── securevault/                # 🔐 SecureVault Manager (secrets chiffrés)
│   │   ├── backend/
│   │   ├── frontend/
│   │   ├── docker-compose.yml
│   │   ├── init-db.sh
│   │   └── README.md
│   └── README.md                   # Vue d'ensemble SaaS
├── docs/
│   ├── architecture.md             # Ce document
│   ├── DEPLOYMENT.md
│   ├── MONITORING.md
│   ├── PRO_DEPLOYMENT.md
│   ├── AUTOMATION.md
│   ├── README.md                   # Index documentation
│   └── ...
├── scripts/                        # Scripts d'automatisation et de maintenance
│   ├── generate-secrets.ps1
│   ├── rotate-secrets.sh
│   └── ...
├── package.json                    # Dépendances Node.js (pour outils, CI/CD)
├── .releaserc                      # Config semantic-release
├── CHANGELOG.md                    # Changelog généré automatiquement
└── README.md                       # Documentation principale
```


### 1.2. Objectifs Techniques

- ✅ **Portfolio Responsive** – Desktop, tablette, mobile (breakpoints 768px, 480px, 360px)
- ✅ **Multilingue** – FR/EN avec 150+ clés de traduction
- ✅ **Sécurisé** – CSP, WCAG AA, scans automatiques (CodeQL, Gitleaks, Trivy)
- ✅ **Déploiement Automatisé** – CI/CD complet via GitHub Actions
- ✅ **High Availability** – Traefik + nginx avec TLS automatique
- ✅ **SaaS Demo** – SecureVault Manager (secrets chiffrés, audit logs, PostgreSQL)

---

## 2. Composants Principaux


### 2.1. Portfolio (`/saas/portfolio`)

**Description**: Portfolio web professionnel multilingue présentant compétences, expériences, projets et certifications.

**Technologies**:
- HTML5 (sémantique, WCAG AA)
- CSS3 (responsive, animations, thèmes saisonniers)
- JavaScript Vanilla (i18n, interactions, validations)

**Caractéristiques Clés**:
- 📱 **Responsive Design** - Breakpoints: 768px (tablet), 480px (mobile), 360px (small phones)
- 🌍 **Multilingue (i18n)** - FR/EN avec localStorage persistence
- 🎨 **Thèmes Saisonniers** - Changement automatique basé sur la date (Hiver/Printemps/Été/Automne)
- 🔐 **Sécurité** - Content Security Policy (CSP), input sanitization, no external trackers
- ♿ **Accessibilité** - WCAG AA compliance, contraste 4.5:1, semantic HTML
- ✨ **Animations** - Smooth scrolling, fade-in effects, hover states
- 📊 **Contenu**:
  - Hero section avec code block
  - 9 catégories de compétences (Cloud, DevSecOps, Backup, Automation, Monitoring, OS, Virtualization, Storage, Methodologies)
  - Timeline de 5 expériences professionnelles (ACENSI, SQUAD, ECONOCOM, DIGIMIND, HARDIS)
  - 6 projets avec détails techniques
  - Formulaire de contact avec captcha anti-spam

**Déploiement**:
- **Production**: https://portfolio.freijstack.com (branch master)
- **Staging**: https://portfolio-staging.freijstack.com (branch develop)

**Documentation**: [saas/portfolio/README.md](../saas/portfolio/README.md)

---


### 2.2. Applications SaaS (`/saas`)

**Description**: Exemple d'application conteneurisée démontrant architecture sécurisée et DevSecOps.


#### SecureVault Manager: Gestionnaire de Secrets Chiffrés
- **Stack**: Node.js 18 + Express + React 18 + PostgreSQL 15 + Traefik
- **Features** :
  - Chiffrement AES-256-GCM des secrets
  - Authentification JWT + RBAC (admin, user)
  - Audit logs détaillés
  - Intégration Traefik avec TLS/ACME
- **Architecture** : Backend API + Frontend SPA + Database + Docker Compose
- **Status** : ✅ Production-ready

**Documentation** :
- [Vue d'ensemble SaaS](../saas/README.md)
- [SecureVault Manager](../saas/securevault/README.md)

---


### 2.3. Documentation (`/docs`)

- **architecture.md** (ce fichier) – Architecture technique complète
- **DEPLOYMENT.md** – Guide de déploiement
- **PRO_DEPLOYMENT.md** – Déploiement avancé SecureVault
- **AUTOMATION.md** – Automatisation CI/CD
- **MONITORING.md** – Monitoring & observabilité
- **README.md** – Index de la documentation

---

## 3. Infrastructure & Hébergement

### 3.1. Stack Technique

| Composant | Technologie | Version | Rôle |
|-----------|-------------|---------|------|
| **OS** | Ubuntu Server | 22.04 LTS | Système d'exploitation VPS |
| **Reverse Proxy** | Traefik | v2.10+ | Routing, Load Balancing, TLS automatique |
| **Web Server** | nginx | alpine | Serveur de fichiers statiques |
| **Containerisation** | Docker | 24.0+ | Isolation des services |
| **Orchestration** | Docker Compose | v2 | Gestion multi-conteneurs |
| **TLS/SSL** | Let's Encrypt | ACME | Certificats SSL automatiques |
| **DNS** | Cloudflare/Provider | - | Gestion sous-domaines |

### 3.2. Architecture Réseau

```
Internet (HTTPS)
     │
     │ Port 443 (TLS)
     ▼
┌────────────────────────────────┐
│   Traefik (Reverse Proxy)      │
│   - TLS termination            │
│   - Host-based routing         │
│   - Auto ACME certificates     │
└────────┬──────────────┬────────┘
         │              │
         │              │
    Host: portfolio.   Host: portfolio-staging.
    freijstack.com     freijstack.com
         │              │
         ▼              ▼
┌─────────────┐  ┌─────────────┐
│  nginx:prod │  │ nginx:stage │
│  Port 8080  │  │  Port 8081  │
└──────┬──────┘  └──────┬──────┘
       │                │
       ▼                ▼
 /srv/www/portfolio  /srv/www/portfolio-staging
```

### 3.3. Configuration Serveur

**VPS Specs** (minimum recommandé):
- **CPU**: 2 vCPU
- **RAM**: 2 GB
- **Storage**: 20 GB SSD
- **Bandwidth**: Illimité ou 1 TB/mois

**Ports Exposés**:
- `80` (HTTP) → Redirection automatique vers 443
- `443` (HTTPS) → Traefik entry point
- `22` (SSH) → Administration et déploiement CI/CD


**Paths Système** :
```
/srv/www/
├── portfolio/              # Production (master branch)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── ...
├── portfolio-staging/      # Staging (develop branch)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── ...
├── securevault/            # SecureVault (prod)
│   ├── backend/
│   ├── frontend/
│   └── ...
└── ...

/home/deploy/
└── backups/
  ├── portfolio-2025-12-28-143022.tar.gz
  ├── portfolio-2025-12-27-120015.tar.gz
  └── ... (garde 7 derniers backups)
```

### 3.4. Docker Compose Configuration

**Fichier**: `docker-compose.yml` (sur VPS)

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik/acme.json:/acme.json
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=contact@freijstack.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/acme.json"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"

  portfolio-prod:
    image: nginx:alpine
    container_name: portfolio-prod
    restart: unless-stopped
    volumes:
      - /srv/www/portfolio:/usr/share/nginx/html:ro
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portfolio.rule=Host(`portfolio.freijstack.com`)"
      - "traefik.http.routers.portfolio.entrypoints=websecure"
      - "traefik.http.routers.portfolio.tls.certresolver=letsencrypt"
      - "traefik.http.services.portfolio.loadbalancer.server.port=80"

  portfolio-staging:
    image: nginx:alpine
    container_name: portfolio-staging
    restart: unless-stopped
    volumes:
      - /srv/www/portfolio-staging:/usr/share/nginx/html:ro
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portfolio-staging.rule=Host(`portfolio-staging.freijstack.com`)"
      - "traefik.http.routers.portfolio-staging.entrypoints=websecure"
      - "traefik.http.routers.portfolio-staging.tls.certresolver=letsencrypt"
      - "traefik.http.services.portfolio-staging.loadbalancer.server.port=80"
```

---

## 4. Pipeline CI/CD

### 📚 Documentation CI/CD Complète

Pour une documentation exhaustive des workflows CI/CD avec diagramme Mermaid interactif et détails de tous les workflows, consultez :

📋 **[CI/CD Architecture](./CI_CD_ARCHITECTURE.md)** - Architecture complète avec schémas et documentation de tous les workflows

**Ce document contient** :
- 🎨 Diagramme Mermaid interactif de l'architecture CI/CD
- 📊 Documentation des 16 workflows GitHub Actions
- ⚙️ Triggers, schedules et conditions détaillés
- 🔒 Configuration secrets et variables
- 📈 Métriques et monitoring des workflows

### 4.1. Vue d'ensemble rapide

**Workflows principaux** :
- **Déploiement** : Infrastructure, Portfolio, SecureVault, Docker Registry
- **Sécurité** : CodeQL, Security Check (Trivy + Gitleaks), Security Score
- **Monitoring** : Health checks Production (30min), Staging (1h), Post-Deploy (master only)
- **Releases** : Semantic versioning automatique avec changelog
- **Maintenance** : Backups quotidiens (AWS S3 + Azure), Rotation secrets mensuelle

**Environnements** :
- `develop` → Staging (éphémère, tests)
- `master` → Production (24/7, monitoring continu)

[→ Voir le diagramme complet et la documentation détaillée](./CI_CD_ARCHITECTURE.md)

---

### 4.2. Workflow GitHub Actions (Legacy)

**Fichier**: `.github/workflows/main.yml`

**Déclencheurs**:
- Push sur `master` (production)
- Push sur `develop` (staging)
- Pull requests (validation uniquement, pas de déploiement)

### 4.2. Jobs du Pipeline

#### Job 1: Validation & Lint ✅
```yaml
Steps:
- Checkout code
- HTML Validation (W3C validator)
- CSS Syntax Check
- JavaScript Linting (optionnel: ESLint)
Duration: ~30s
```

#### Job 2: Build & Optimize 🔨
```yaml
Steps:
- Install dependencies (npm)
- CSS Minification (csso-cli --no-restructure)
- JavaScript Minification (terser)
- Upload artifacts (style.min.css, script.min.js)
Duration: ~45s
```

#### Job 3: Security Scanning 🔐
```yaml
Steps:
- CodeQL Analysis (SAST - Static Application Security Testing)
- Gitleaks (Secret Scanning - détection credentials/tokens)
- Trivy (Vulnerability Scanning - dépendances, containers)
Duration: ~2-3min
Critical: Oui (bloque le déploiement si échec)
```

#### Job 4: Deploy to GitHub Pages 🌐
```yaml
Branch: develop uniquement
Action: peaceiris/actions-gh-pages@v3
Target: gh-pages branch
URL: https://christophe-freijanes.github.io/freijstack
Duration: ~30s
```

#### Job 5: Deploy to VPS 🚀
```yaml
Steps:
- Create backup:
  tar -czf /home/deploy/backups/portfolio-$(date +%Y%m%d-%H%M%S).tar.gz /srv/www/portfolio
  
- Deploy via rsync (SSH):
  rsync -avz --delete portfolio/ user@vps:/srv/www/portfolio/
  rsync -avz --delete portfolio/ user@vps:/srv/www/portfolio-staging/
  
- Set permissions:
  chmod 644 /srv/www/portfolio/*.{html,css,js,json}
  chmod 755 /srv/www/portfolio/
  
- Restart services:
  docker-compose restart traefik
  
Duration: ~1min
```

#### Job 6: Post-Deploy 🧹
```yaml
Steps:
- Cleanup old backups (garde 7 derniers):
  ls -t /home/deploy/backups/portfolio-*.tar.gz | tail -n +8 | xargs rm -f
  
- Health Check:
  curl -f https://portfolio.freijstack.com || exit 1
  curl -f https://portfolio-staging.freijstack.com || exit 1
  
- Status Notification (optionnel: Slack/Discord/Email)

Duration: ~20s
```

### 4.3. Secrets GitHub

| Secret | Description | Exemple |
|--------|-------------|---------|
| `SSH_PRIVATE_KEY` | Clé SSH pour auth VPS | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SSH_HOST` | IP ou hostname VPS | `123.45.67.89` ou `vps.freijstack.com` |
| `SSH_USERNAME` | User SSH (non-root recommandé) | `deploy` |
| `SSH_PORT` | Port SSH custom (optionnel) | `22` (défaut) |

**Configuration dans GitHub**:
```
Repository → Settings → Secrets and variables → Actions → New repository secret
```

### 4.4. Stratégie de Branching

```
master (production) ━━━━━━━━━━━━━━━━━━━━━━━> portfolio.freijstack.com
  │
  │ Merge (après validation)
  │
develop (staging) ━━━━━━━━━━━━━━━━━━━━━━━> portfolio-staging.freijstack.com
  │                                          + GitHub Pages
  │ PR (Pull Request)
  │
feature/* (dev) ━━━━━━━━━━━━━━━━━━━━━━━━> Validation only (no deploy)
```

**Workflow de développement**:
1. Créer une branche `feature/nom-fonctionnalite` depuis `develop`
2. Développer et commit les changements
3. Ouvrir une PR vers `develop` (checklist auto-chargée)
4. Pipeline CI/CD valide (lint, security, build)
5. Review code + merge → Déploie vers staging
6. Tests en staging → si OK, merge `develop` → `master`
7. Déploiement automatique en production

### 4.5. Temps d'Exécution Pipeline

| Job | Durée | Critique | Bloquant |
|-----|-------|----------|----------|
| Validation & Lint | ~30s | Non | Non |
| Build & Optimize | ~45s | Non | Non |
| Security Scan | ~2-3min | **Oui** | **Oui** |
| Deploy GitHub Pages | ~30s | Non | Non |
| Deploy VPS | ~1min | **Oui** | **Oui** |
| Post-Deploy | ~20s | Non | Non |
| **Total** | **~5-6min** | - | - |

---

## 5. Sécurité & Conformité

### 5.1. Mesures de Sécurité Implémentées

#### Frontend
- ✅ **Content Security Policy (CSP)** - Headers restrictifs
- ✅ **Input Sanitization** - Validation formulaire contact
- ✅ **No External Trackers** - Vie privée complète
- ✅ **HTTPS Only** - TLS 1.2+ via Let's Encrypt
- ✅ **CORS Configuré** - Si API externe nécessaire

#### Backend & Infrastructure
- ✅ **SSH Key Auth** - Pas de mot de passe
- ✅ **Firewall UFW** - Ports 22/80/443 uniquement
- ✅ **Docker Rootless** - Containers non-root quand possible
- ✅ **Secrets Management** - GitHub Secrets (encrypted at rest)
- ✅ **Backup Encryption** - tar.gz avec permissions restrictives

#### CI/CD Pipeline
- ✅ **CodeQL** - SAST (Static Application Security Testing)
- ✅ **Gitleaks** - Secret scanning (API keys, tokens, passwords)
- ✅ **Trivy** - Vulnerability scanning (CVE detection)
- ✅ **Branch Protection** - master requiert PR + reviews

### 5.2. Conformité & Standards

| Standard | Statut | Notes |
|----------|--------|-------|
| **WCAG 2.1 AA** | ✅ Conforme | Accessibilité web |
| **W3C HTML5** | ✅ Validé | Markup sémantique |
| **RGPD** | ✅ Conforme | Pas de tracking, formulaire consent |
| **OWASP Top 10** | ✅ Mitigé | XSS, injection, CSRF préventions |

### 5.3. Procédures de Sécurité

**Mises à jour**:
```bash
# Sur VPS (tous les mois)
sudo apt update && sudo apt upgrade -y
docker-compose pull  # Update images
docker-compose up -d --force-recreate
```

**Rotation des secrets** (tous les 6 mois):
- Générer nouvelle paire SSH keys
- Mettre à jour GitHub Secrets
- Tester déploiement staging

**Audit logs**:
```bash
# Vérifier les accès SSH
sudo tail -f /var/log/auth.log

# Vérifier logs nginx
docker logs portfolio-prod
docker logs portfolio-staging
```

---

## 6. Maintenance & Monitoring

### 6.1. Tâches de Maintenance Régulières

**Quotidien** (automatique via CI/CD):
- ✅ Déploiement des commits
- ✅ Security scans
- ✅ Backups automatiques

**Hebdomadaire**:
- 📊 Vérifier logs Traefik/nginx
- 🔍 Analyser traffic (si analytics activé)
- 🧹 Vérifier espace disque VPS

**Mensuel**:
- 🔄 Mises à jour système (apt upgrade)
- 🐳 Mettre à jour images Docker
- 🔐 Vérifier certificats SSL (auto-renew Let's Encrypt)
- 💾 Tester restauration backup

**Trimestriel**:
- 🔍 Audit sécurité complet
- 📝 Review architecture et optimisations
- 🔑 Rotation secrets (optionnel, recommandé semestriel)

### 6.2. Monitoring (Optionnel - Futur)

**Stack de monitoring recommandée**:
```yaml
services:
  prometheus:
    image: prom/prometheus
    # Scrape nginx metrics, Traefik metrics
    
  grafana:
    image: grafana/grafana
    # Dashboards visualisation
    
  loki:
    image: grafana/loki
    # Log aggregation
    
  node-exporter:
    image: prom/node-exporter
    # Métriques système (CPU, RAM, disk)
```

**Métriques clés**:
- 📊 Uptime (SLA target: 99.9%)
- 🚀 Response time (target: <500ms)
- 📈 Traffic (requests/min)
- 💾 Disk usage (alert si >80%)
- 🔐 Failed auth attempts (SSH, si exposition)

### 6.3. Alerting (Configuration future)

**Canaux d'alerte** (via Grafana/Prometheus Alertmanager):
-  Discord/Slack webhook
- 📱 SMS (critical only)

**Alertes critiques**:
- 🔴 Site down (>2min)
- 🔴 Certificate SSL expire (<7 jours)
- 🔴 Disk usage >90%
- 🟡 Response time >1s
- 🟡 High error rate (5xx >1%)

### 6.4. Disaster Recovery

**Plan de récupération**:

1. **Backup restauration** (si corruption fichiers):
   ```bash
   cd /home/deploy/backups
   tar -xzf portfolio-YYYYMMDD-HHMMSS.tar.gz -C /srv/www/
   docker-compose restart portfolio-prod portfolio-staging
   ```

2. **Rollback Git** (si bug en production):
   ```bash
   git reset --hard <commit-stable>
   git push --force origin master
   # CI/CD redéploie automatiquement
   ```

3. **Recréation infrastructure** (si perte VPS):
   - Provisionner nouveau VPS Ubuntu 22.04
   - Installer Docker + Docker Compose
   - Cloner repo + configurer docker-compose.yml
   - Restaurer backup depuis copie locale/cloud
   - Pointer DNS vers nouvelle IP
   - Durée estimée: 2-4h

**RTO** (Recovery Time Objective): 4h  
**RPO** (Recovery Point Objective): 24h (1 backup/jour)

---

## 7. Évolutions Futures

### Roadmap Technique

**Court terme** (Q1 2025):
- [x] SecureVault Manager (gestionnaire secrets chiffrés)
- [x] Intégration Traefik + TLS/ACME
- [x] Audit logs et RBAC
- [ ] Ajouter monitoring (Prometheus + Grafana)
- [ ] Implémenter analytics (privacy-first, e.g., Plausible)

**Moyen terme** (Q2-Q3 2025):
- [ ] Kubernetes migration (si charge augmente)
- [ ] CDN integration (CloudFlare/Fastly)
- [ ] API backend pour portfolio (CMS headless)
- [ ] Blog intégration (Astro/Hugo)

**Long terme** (Q4 2025+):
- [ ] Multi-région deployment (HA)
- [ ] CI/CD tests E2E (Playwright/Cypress)
- [ ] Infrastructure as Code (Terraform)
- [ ] Automatisation scaling (HPA - Horizontal Pod Autoscaler)

---

## 8. Contacts & Support

**Mainteneur**: Christophe FREIJANES  
**GitHub**: https://github.com/christophe-freijanes/freijstack  
**LinkedIn**: https://www.linkedin.com/in/christophe-freijanes

**Documentation**:
- [README Principal](../README.md)
- [Portfolio README](../saas/portfolio/README.md)
- [SaaS Apps README](../saas/README.md)

---

**Version**: 2.0  
**Date**: Décembre 2025  
**Révision**: Post-reset commit 62a563e
