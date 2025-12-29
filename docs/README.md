# 📚 Documentation FreijStack

[![GitHub](https://img.shields.io/badge/repo-github-blue?style=flat-square&logo=github)](https://github.com/christophe-freijanes/freijstack)
[![Status](https://img.shields.io/badge/status-active-success?style=flat-square&logo=checklist)](../README.md)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](../LICENSE)
[![Last Updated](https://img.shields.io/badge/updated-December%202025-blue?style=flat-square&logo=calendar)](../README.md)

Index de la documentation technique du projet.

---

## 📖 Documents Disponibles

| Document | Description | Lien |
|----------|-------------|------|
| 🏠 **README Principal** | Vue d'ensemble du projet | [../README.md](../README.md) |
| 🔗 **Integration Guide** | Guide d'intégration infrastructure + apps | [../base-infra/BASE_INTEGRATION.md](../base-infra/BASE_INTEGRATION.md) |
| 🏗️ **Infrastructure Base** | Docker Compose, Traefik | [../base-infra/README.md](../base-infra/README.md) |
| 🏗️ **Architecture Technique** | Infrastructure, CI/CD, déploiement | [architecture.md](architecture.md) |
| 📌 **Guide Déploiement** | VPS, Docker, Traefik, rollback | [DEPLOYMENT.md](DEPLOYMENT.md) |
| 🔐 **SecureVault Deployment** | Pipeline CI/CD dédiée, configuration VPS | [SECUREVAULT_DEPLOYMENT.md](SECUREVAULT_DEPLOYMENT.md) |
| 🔄 **Secret Rotation** | Automatisation rotation des secrets | [SECRET_ROTATION.md](SECRET_ROTATION.md) |
| 🔍 **Guide Troubleshooting** | Diagnostic et résolution des problèmes | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| 📊 **Guide Monitoring** | Prometheus, Grafana, Loki, alertes | [MONITORING.md](MONITORING.md) |
| 🌐 **Portfolio** | Documentation du portfolio web | [../saas/portfolio/README.md](../saas/portfolio/README.md) |
| 🚀 **SaaS Apps** | Applications démonstratives (Portfolio, SecureVault, n8n) | [../saas/README.md](../saas/README.md) |
| ✅ **Pull Request Template** | Checklist de validation PR | [../.github/pull_request_template.md](../.github/pull_request_template.md) |

---

## 🎯 Par Thématique

### Infrastructure & DevOps
- [Integration Guide](../base-infra/BASE_INTEGRATION.md) - Guide complet d'intégration (Traefik + apps)
- [Infrastructure Base](../base-infra/README.md) - Docker Compose, Traefik
- [Architecture Technique Complète](architecture.md) - Infrastructure, CI/CD, sécurité, monitoring
- [Guide Déploiement VPS](DEPLOYMENT.md) - Installation complète (Ubuntu, Docker, Traefik, DNS)
- [SecureVault CI/CD Pipeline](SECUREVAULT_DEPLOYMENT.md) - Déploiement automatisé SecureVault
- [Secret Rotation Automation](SECRET_ROTATION.md) - Rotation automatisée des secrets
- [Guide Monitoring](MONITORING.md) - Prometheus, Grafana, Loki, alertes
- [Configuration Docker Compose](architecture.md#34-docker-compose-configuration)
- [Pipeline CI/CD](architecture.md#4-pipeline-cicd)
- [GitHub Actions Workflows](../.github/workflows/README.md) - Documentation complète des workflows

### Frontend & Web
- [Portfolio README](../saas/portfolio/README.md) - Features, i18n, responsive design
- [Thèmes Saisonniers](../saas/portfolio/README.md) - Système de changement automatique
- [Accessibilité WCAG](../saas/portfolio/README.md) - Conformité AA

### Backend & SaaS Applications
- [SaaS Apps Overview](../saas/README.md) - Vue d'ensemble applications SaaS
- [SecureVault Manager](../saas/securevault/README.md) - Gestionnaire de secrets chiffrés
- [n8n Automation](../saas/n8n/README.md) - Plateforme d'automation et workflows

### Sécurité
- [Mesures de Sécurité](architecture.md#5-sécurité--conformité) - Politiques et conformité
- [Scans Automatiques](architecture.md#job-3-security-scanning-) - CodeQL, Gitleaks, Trivy
- [Conformité RGPD/WCAG](architecture.md#52-conformité--standards) - Standards et réglementations

### Maintenance & Support
- [Procédures de Maintenance](architecture.md#6-maintenance--monitoring) - Maintenance régulière
- [Guide Troubleshooting](TROUBLESHOOTING.md) - Diagnostic des problèmes
- [Disaster Recovery](architecture.md#64-disaster-recovery) - Plan de récupération
- [Roadmap Évolutions](architecture.md#7-évolutions-futures) - Futures améliorations

---

## 🔍 Guides Rapides

### Déployer Localement

#### Infrastructure Base (Traefik)

```bash
# Cloner le repo
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack

# Déployer infrastructure (Traefik seulement)
cd base-infra
docker network create web
docker volume create traefik_data
cp .env.example .env
nano .env  # Configurer DOMAIN_NAME
docker-compose up -d
```

#### Applications (Portfolio, n8n, SecureVault)

```bash
# Portfolio
cd saas/portfolio
cp .env.example .env
docker-compose up -d

# n8n
cd ../n8n
cp .env.example .env
docker-compose up -d

# SecureVault
cd ../securevault
./init-db.sh
docker-compose up -d
```

**Voir**: [BASE_INTEGRATION.md](../base-infra/BASE_INTEGRATION.md)
docker-compose up -d
```

#### Portfolio

```bash
# Ouvrir le portfolio
cd saas/portfolio

# Option 1 : Fichier HTML direct
# Double-cliquez sur index.html

# Option 2 : Serveur local Python
python -m http.server 8000
# Accès: http://localhost:8000

# Option 3 : Serveur local Node
npx http-server .
# Accès: http://localhost:8080
```

#### SecureVault

```bash
cd saas/securevault
cp .env.example .env && nano .env
docker-compose up -d --build
./init-db.sh
```

### Contribuer

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/ma-fonctionnalite`)
3. Commit les changements (`git commit -m 'feat: ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request (checklist auto-chargée)

### Déployer en Production

Le déploiement est **automatique** via GitHub Actions :
- Push sur `develop` → déploie vers staging
- Push sur `master` → déploie vers production

**Détails**: Voir [Pipeline CI/CD](architecture.md#4-pipeline-cicd)

---

## 📚 Documentation Détaillée

### Sujets Avancés

- **Traefik Configuration** - Routing, TLS, middleware, health checks
- **Docker Compose** - Services, volumes, networks, secrets management
- **GitHub Actions** - Workflows, artifacts, security scanning, deployment
- **Database Management** - PostgreSQL, migrations, backups
- **Monitoring & Observability** - Prometheus, Grafana, Loki, ELK
- **Security Hardening** - SSL/TLS, CSP, RBAC, input validation

### Checklists & Templates

- [Pull Request Checklist](../.github/pull_request_template.md)
- Deployment Checklist (dans DEPLOYMENT.md)
- Security Review Checklist (dans SECURITY.md)

---

## 🔐 Informations de Sécurité

⚠️ **IMPORTANT**: Pour les vulnérabilités critiques, consultez le [SECURITY.md](../SECURITY.md)

---

## 📞 Support & Contact

**Mainteneur**: Christophe FREIJANES

**Canaux de support**:
- GitHub Issues: [Rapporter un bug](https://github.com/christophe-freijanes/freijstack/issues)
- GitHub Discussions: [Poser une question](https://github.com/christophe-freijanes/freijstack/discussions)
- LinkedIn: [Profil Christophe FREIJANES](https://www.linkedin.com/in/christophe-freijanes/)

---

**Dernière mise à jour**: Décembre 2025

**Status**: ✅ Documentation active et à jour
