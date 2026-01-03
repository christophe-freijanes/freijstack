# 📚 Documentation FreijStack

[![GitHub](https://img.shields.io/badge/repo-github-blue?style=flat-square&logo=github)](https://github.com/christophe-freijanes/freijstack)
[![Status](https://img.shields.io/badge/status-active-success?style=flat-square&logo=checklist)](../README.md)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](../LICENSE)
[![Last Updated](https://img.shields.io/badge/updated-January%202026-blue?style=flat-square&logo=calendar)](../README.md)

Index de la documentation technique du projet FreijStack.

**Dernière mise à jour**: Janvier 2026

---

## 🎯 Navigation Rapide

### 📖 Lire l'Index Complet
👉 **[INDEX.md](./INDEX.md)** - Guide complet de navigation par besoin, par rôle, par mot-clé

### 🚀 Démarrage Rapide
- **Nouveau sur le projet ?** → [README Principal](../README.md) + [QUICK_DEPLOY_GUIDE.md](./QUICK_DEPLOY_GUIDE.md)
- **Besoin de déployer ?** → [DEPLOYMENT.md](./DEPLOYMENT.md) + [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md)
- **Un problème à résoudre ?** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📖 Documents Disponibles (18+)

| Document | Description | Lien |
|----------|-------------|------|
| 📚 **INDEX Navigation** | 🆕 Guide complet navigation par besoin/rôle | [INDEX.md](INDEX.md) |
| 🏠 **README Principal** | Vue d'ensemble du projet | [../README.md](../README.md) |
| 🔗 **Integration Guide** | Guide d'intégration infrastructure + apps | [../base-infra/BASE_INTEGRATION.md](../base-infra/BASE_INTEGRATION.md) |
| 🏗️ **Architecture Technique** | Infrastructure, stack, CI/CD, sécurité | [ARCHITECTURE.md](ARCHITECTURE.md) |
| 📊 **CI/CD Architecture** | 🆕 Diagramme Mermaid + 21+ workflows | [CI_CD_ARCHITECTURE.md](CI_CD_ARCHITECTURE.md) |
| 🤖 **Automatisation Guide** | 🆕 Guide complet automation consolidé | [AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md) |
| 📌 **Guide Déploiement** | VPS setup, Docker, Traefik, rollback | [DEPLOYMENT.md](DEPLOYMENT.md) |
| 🐳 **Structure Docker** | Containers, volumes, réseaux, composition | [DOCKER_STRUCTURE.md](DOCKER_STRUCTURE.md) |
| 🚀 **Démarrage Rapide** | 5 minutes pour déployer | [QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md) |
| 🔐 **SecureVault Deploy** | Pipeline CI/CD dédiée SecureVault | [SECUREVAULT_DEPLOYMENT.md](SECUREVAULT_DEPLOYMENT.md) |
| 🔍 **Troubleshooting** | ✨ Enrichi : dépannage + CORS + Registration | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| 📊 **Guide Monitoring** | Prometheus, Grafana, Loki, alertes, dashboards | [MONITORING.md](MONITORING.md) |
| 👤 **Guide Utilisateur** | SecureVault features, utilisation | [USER_GUIDE.md](USER_GUIDE.md) |
| 🔍 **Système d'Audit** | Audit logs, traçabilité, compliance | [AUDIT_SYSTEM.md](AUDIT_SYSTEM.md) |
| 💾 **Cloud Backup** | Stratégie AWS S3 + Azure Blob, rétention | [CLOUD_BACKUP.md](CLOUD_BACKUP.md) |
| 🏢 **PRO Deployment** | Guide PRO/Enterprise avec SLA | [PRO_DEPLOYMENT.md](PRO_DEPLOYMENT.md) |
| 🗺️ **Features Roadmap** | Roadmap produit, features plannifiées | [FEATURES_ROADMAP.md](FEATURES_ROADMAP.md) |
| 📋 **Documentation Audit** | 🆕 Audit + plan d'optimisation | [DOCUMENTATION_AUDIT.md](DOCUMENTATION_AUDIT.md) |

---

## 🎯 Par Thématique

### Infrastructure & DevOps
- [Integration Guide](../base-infra/BASE_INTEGRATION.md) - Guide complet d'intégration (Traefik + apps)
- [Infrastructure Base](../base-infra/README.md) - Docker Compose, Traefik
- [Structure Docker](DOCKER_STRUCTURE.md) - Organisation containers, volumes, réseaux
- [Architecture Technique Complète](architecture.md) - Infrastructure, CI/CD, sécurité, monitoring
- [Guide Déploiement VPS](DEPLOYMENT.md) - Installation complète (Ubuntu, Docker, Traefik, DNS)
- [SecureVault CI/CD Pipeline](SECUREVAULT_DEPLOYMENT.md) - Déploiement automatisé SecureVault
- [Automatisation Complète](AUTOMATION.md) - Zéro-intervention, staging éphémère, production 24/7
- [Secret Rotation Automation](SECRET_ROTATION.md) - Rotation automatisée des secrets
- [Guide Monitoring](MONITORING.md) - Prometheus, Grafana, Loki, alertes
- [Configuration Docker Compose](architecture.md#34-docker-compose-configuration)
- [Pipeline CI/CD](architecture.md#4-pipeline-cicd)
- [GitHub Actions Workflows](../.github/workflows/README.md) - Documentation complète des workflows

### Backend & SaaS Applications
- [SecureVault Manager](../saas/securevault/README.md) - Gestionnaire de secrets chiffrés
- [Docker Registry](../saas/registry/README.md) - Registre Docker privé avec UI Joxit
- [Portfolio Web](../saas/portfolio/README.md) - Portfolio multilingue responsive
- [Applications SaaS Overview](../saas/README.md) - Vue d'ensemble toutes les apps
- [SecureVault CI/CD Pipeline](SECUREVAULT_DEPLOYMENT.md) - Déploiement automatisé SecureVault
- [Secret Rotation Automation](SECRET_ROTATION.md) - Rotation automatisée des secrets

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

#### Infrastructure Base (Traefik + n8n + Portfolio)

```bash
# Cloner le repo
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack

# Déployer infrastructure complète
cd base-infra
docker network create web
docker volume create traefik_data
docker volume create n8n_data
cp .env.example .env
nano .env  # Configurer DOMAIN_NAME
docker compose up -d
```

**Voir**: [BASE_INTEGRATION.md](../base-infra/BASE_INTEGRATION.md)

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
