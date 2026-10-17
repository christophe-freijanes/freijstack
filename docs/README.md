<a id="-documentation-freijstack"></a>
# Documentation FreijStack

[![GitHub](https://img.shields.io/badge/repo-github-blue?style=flat-square&logo=github)](https://github.com/christophe-freijanes/freijstack)
[![Status](https://img.shields.io/badge/status-active-success?style=flat-square&logo=checklist)](../README.md)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](../LICENSE)
[![Last Updated](https://img.shields.io/badge/updated-January%202026-blue?style=flat-square&logo=calendar)](../README.md)

Index de la documentation technique du projet FreijStack.

**Dernière mise à jour**: Janvier 2026

---

<a id="-navigation-rapide"></a>
## Navigation Rapide

<a id="-lire-lindex-complet"></a>
### Lire l'Index Complet
**[INDEX.md](00-overview/INDEX.md)** - Navigation par besoin, rôle et mot-clé

<a id="-démarrage-rapide"></a>
### Démarrage Rapide
- **Nouveau sur le projet ?** → [README Principal](../README.md) + [QUICK_DEPLOY_GUIDE.md](00-overview/QUICK_DEPLOY_GUIDE.md)
- **Besoin de déployer ?** → [DEPLOYMENT.md](02-deployment/DEPLOYMENT.md) + [CI_CD_ARCHITECTURE.md](01-architecture/CI_CD_ARCHITECTURE.md)
- **Un problème à résoudre ?** → [TROUBLESHOOTING.md](04-operations/TROUBLESHOOTING.md)

---

<a id="-documents-disponibles-18"></a>
## Documents Disponibles (18+)

| Document | Description | Lien |
|----------|-------------|------|
| **INDEX Navigation** | Guide navigation par besoin/rôle | [INDEX.md](00-overview/INDEX.md) |
| **README Principal** | Vue d'ensemble du projet | [../README.md](../README.md) |
| **Integration Guide** | Guide d'intégration infrastructure + apps | [../base-infra/BASE_INTEGRATION.md](../base-infra/BASE_INTEGRATION.md) |
| **Architecture Technique** | Infrastructure, stack, CI/CD, sécurité | [ARCHITECTURE.md](01-architecture/ARCHITECTURE.md) |
| **CI/CD Architecture** | Diagramme Mermaid + 21+ workflows | [CI_CD_ARCHITECTURE.md](01-architecture/CI_CD_ARCHITECTURE.md) |
| **Automatisation Guide** | Guide automation consolidé | [AUTOMATION_GUIDE.md](03-guides/AUTOMATION_GUIDE.md) |
| **Guide Déploiement** | VPS setup, Docker, Traefik, rollback | [DEPLOYMENT.md](02-deployment/DEPLOYMENT.md) |
| **Structure Docker** | Containers, volumes, réseaux, composition | [DOCKER_STRUCTURE.md](01-architecture/DOCKER_STRUCTURE.md) |
| **Démarrage Rapide** | Démarrage du déploiement | [QUICK_DEPLOY_GUIDE.md](00-overview/QUICK_DEPLOY_GUIDE.md) |
| **SecureVault Deploy** | Pipeline CI/CD dédiée SecureVault | [SECUREVAULT_DEPLOYMENT.md](02-deployment/SECUREVAULT_DEPLOYMENT.md) |
| **Troubleshooting** | Enrichi : dépannage + CORS + Registration | [TROUBLESHOOTING.md](04-operations/TROUBLESHOOTING.md) |
| **Guide Monitoring** | Prometheus, Grafana, Loki, alertes, dashboards | [MONITORING.md](03-guides/MONITORING.md) |
| **Guide Utilisateur** | SecureVault features, utilisation | [USER_GUIDE.md](00-overview/USER_GUIDE.md) |
| **Système d'Audit** | Audit logs, traçabilité, compliance | [AUDIT_SYSTEM.md](05-reference/AUDIT_SYSTEM.md) |
| **Cloud Backup** | Stratégie AWS S3 + Azure Blob, rétention | [CLOUD_BACKUP.md](03-guides/CLOUD_BACKUP.md) |
| **PRO Deployment** | Guide PRO/Enterprise avec SLA | [PRO_DEPLOYMENT.md](02-deployment/PRO_DEPLOYMENT.md) |
| **Features Roadmap** | Roadmap produit, features plannifiées | [FEATURES_ROADMAP.md](05-reference/FEATURES_ROADMAP.md) |
| **Documentation Audit** | Audit + plan d'optimisation | [DOCUMENTATION_AUDIT.md](05-reference/DOCUMENTATION_AUDIT.md) |

---
<a id="-par-thématique"></a>
## Par Thématique

### Infrastructure & DevOps
- [Integration Guide](../base-infra/BASE_INTEGRATION.md) - Guide d'intégration (Traefik + apps)
- [Infrastructure Base](../base-infra/README.md) - Docker Compose, Traefik
- [Structure Docker](01-architecture/DOCKER_STRUCTURE.md) - Organisation containers, volumes, réseaux
- [Architecture Technique Complète](01-architecture/ARCHITECTURE.md) - Infrastructure, CI/CD, sécurité, monitoring
- [Guide Déploiement VPS](02-deployment/DEPLOYMENT.md) - Installation complète (Ubuntu, Docker, Traefik, DNS)
- [SecureVault CI/CD Pipeline](02-deployment/SECUREVAULT_DEPLOYMENT.md) - Déploiement automatisé SecureVault
- [Automatisation Complète](03-guides/AUTOMATION_GUIDE.md) - Staging éphémère et production
- [Guide Monitoring](03-guides/MONITORING.md) - Prometheus, Grafana, Loki, alertes
- [Configuration Docker Compose](01-architecture/ARCHITECTURE.md#34-docker-compose-configuration)
- [Pipeline CI/CD](01-architecture/ARCHITECTURE.md#4-pipeline-cicd)
- [GitHub Actions Workflows](../.github/workflows/README.md) - Documentation des workflows

### Backend & SaaS Applications
- [SecureVault Manager](../saas/securevault/README.md) - Gestionnaire de secrets chiffrés
- [Docker Registry](../saas/registry/README.md) - Registre Docker privé avec UI Joxit
- [Portfolio Web](../saas/portfolio/README.md) - Portfolio multilingue responsive
- [Applications SaaS Overview](../saas/README.md) - Vue d'ensemble toutes les apps
- [SecureVault CI/CD Pipeline](02-deployment/SECUREVAULT_DEPLOYMENT.md) - Déploiement automatisé SecureVault

### Sécurité
- [Mesures de Sécurité](01-architecture/ARCHITECTURE.md#5-sécurité--conformité) - Politiques et conformité
- [Scans Automatiques](01-architecture/ARCHITECTURE.md#job-3-security-scanning-) - CodeQL, Gitleaks, Trivy
- [Conformité RGPD/WCAG](01-architecture/ARCHITECTURE.md#52-conformité--standards) - Standards et réglementations

### Maintenance & Support
- [Procédures de Maintenance](01-architecture/ARCHITECTURE.md#6-maintenance--monitoring) - Maintenance régulière
- [Guide Troubleshooting](04-operations/TROUBLESHOOTING.md) - Diagnostic des problèmes
- [Disaster Recovery](01-architecture/ARCHITECTURE.md#64-disaster-recovery) - Plan de récupération
- [Roadmap Évolutions](01-architecture/ARCHITECTURE.md#7-évolutions-futures) - Futures améliorations

---

<a id="-guides-rapides"></a>
## Guides Rapides

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

**Détails**: Voir [Pipeline CI/CD](01-architecture/ARCHITECTURE.md#4-pipeline-cicd)

---

<a id="-documentation-détaillée"></a>
## Documentation technique

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

<a id="-informations-de-sécurité"></a>
## Informations de Sécurité

⚠️ **IMPORTANT**: Pour les vulnérabilités critiques, consultez le [SECURITY.md](../SECURITY.md)

---

<a id="-support--contact"></a>
## Support & Contact

**Mainteneur**: Christophe FREIJANES

**Canaux de support**:
- GitHub Issues: [Rapporter un bug](https://github.com/christophe-freijanes/freijstack/issues)
- GitHub Discussions: [Poser une question](https://github.com/christophe-freijanes/freijstack/discussions)
- LinkedIn: [Profil Christophe FREIJANES](https://www.linkedin.com/in/christophe-freijanes/)

---