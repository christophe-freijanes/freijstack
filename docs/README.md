# 📚 Documentation FreijStack

Index de la documentation technique du projet.

## 📖 Documents Disponibles

| Document | Description | Lien |
|----------|-------------|------|
| 🏠 **README Principal** | Vue d'ensemble du projet | [../README.md](../README.md) |
| 🏗️ **Architecture Technique** | Infrastructure, CI/CD, déploiement | [architecture.md](architecture.md) |
| 💼 **Portfolio** | Documentation du portfolio web | [../portfolio/README.md](../portfolio/README.md) |
| 🚀 **SaaS Apps** | Applications démonstratives | [../saas/README.md](../saas/README.md) |
| ✅ **Pull Request Template** | Checklist de validation PR | [../.github/pull_request_template.md](../.github/pull_request_template.md) |

## 🎯 Par Thématique

### Infrastructure & DevOps
- [Architecture Technique Complète](architecture.md) - Infrastructure, CI/CD, sécurité, monitoring
- [Configuration Docker Compose](architecture.md#34-docker-compose-configuration)
- [Pipeline CI/CD](architecture.md#4-pipeline-cicd)

### Frontend
- [Portfolio README](../portfolio/README.md) - Features, i18n, responsive design
- [Thèmes Saisonniers](../portfolio/README.md) - Système de changement automatique
- [Accessibilité WCAG](../portfolio/README.md) - Conformité AA

### Backend & Microservices
- [SaaS Apps Overview](../saas/README.md)
- [App1 - Gestionnaire de Tâches](../saas/app1/README.md)
- [App2 - Service Notifications](../saas/app2/README.md)

### Sécurité
- [Mesures de Sécurité](architecture.md#5-sécurité--conformité)
- [Scans Automatiques](architecture.md#job-3-security-scanning-)
- [Conformité RGPD/WCAG](architecture.md#52-conformité--standards)

### Maintenance
- [Procédures de Maintenance](architecture.md#6-maintenance--monitoring)
- [Disaster Recovery](architecture.md#64-disaster-recovery)
- [Roadmap Évolutions](architecture.md#7-évolutions-futures)

## 🔍 Guides Rapides

### Déployer localement
```bash
# Cloner le repo
git clone https://github.com/christophe-freijanes/freijstack.git
cd freijstack

# Ouvrir le portfolio
cd portfolio
# Ouvrir index.html dans un navigateur
# Ou lancer un serveur local:
python -m http.server 8080
# Accéder à http://localhost:8080
```

### Contribuer
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/ma-fonctionnalite`)
3. Commit les changements (`git commit -m 'feat: ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request (checklist auto-chargée)

### Déployer en production
Le déploiement est **automatique** via GitHub Actions :
- Push sur `develop` → déploie vers staging
- Push sur `master` → déploie vers production

Voir [Pipeline CI/CD](architecture.md#4-pipeline-cicd) pour les détails.

## 📞 Support

**Mainteneur**: Christophe FREIJANES  
**Email**: contact@freijstack.com  
**GitHub**: https://github.com/christophe-freijanes/freijstack

---

**Dernière mise à jour**: Décembre 2025
