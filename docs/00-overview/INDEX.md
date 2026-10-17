<a id="-index-documentation---freijstack"></a>
# Index Documentation - FreijStack

Navigation de la documentation FreijStack.

**Dernière mise à jour**: Janvier 2026  
**Total fichiers**: 16 documentations + 3 privées  

---

<a id="-quick-start---par-besoin"></a>
## Quick Start - Par Besoin

<a id="-je-suis-nouveau-sur-le-projet"></a>
### Je suis nouveau sur le projet
1. **[README.md](../README.md)** - Vue d'ensemble générale
2. **[ARCHITECTURE.md](../01-architecture/ARCHITECTURE.md)** - Architecture technique
3. **[QUICK_DEPLOY_GUIDE.md](./QUICK_DEPLOY_GUIDE.md)** - Démarrage rapide

<a id="-je-veux-déployer-lapplication"></a>
### Je veux déployer l'application
1. **[DEPLOYMENT.md](../02-deployment/DEPLOYMENT.md)** - Guide déploiement complet
2. **[SECUREVAULT_DEPLOYMENT.md](../02-deployment/SECUREVAULT_DEPLOYMENT.md)** - SecureVault spécifique
3. **[CI_CD_ARCHITECTURE.md](../01-architecture/CI_CD_ARCHITECTURE.md)** - Workflows automatisés

<a id="-je-veux-comprendre-lautomatisation"></a>
### Je veux comprendre l'automatisation
1. **[AUTOMATION_GUIDE.md](../03-guides/AUTOMATION_GUIDE.md)** - Guide automatisation complet
2. **[CI_CD_ARCHITECTURE.md](../01-architecture/CI_CD_ARCHITECTURE.md)** - Architecture CI/CD avec diagrammes

<a id="-jai-un-problème-à-résoudre"></a>
### J'ai un problème à résoudre
1. **[TROUBLESHOOTING.md](../04-operations/TROUBLESHOOTING.md)** - Guide dépannage complet
   - Problèmes déploiement
   - Erreurs HTTP/SSL
   - SecureVault (CORS, Registration)
   - Docker, DNS, Frontend, CI/CD

<a id="-je-veux-monitorer-lapplication"></a>
### Je veux monitorer l'application
1. **[MONITORING.md](../03-guides/MONITORING.md)** - Setup monitoring Prometheus/Grafana/Loki
2. **[CI_CD_ARCHITECTURE.md](../01-architecture/CI_CD_ARCHITECTURE.md)** - Health checks & alertes

<a id="-je-veux-sécuriser-linfrastructure"></a>
### Je veux sécuriser l'infrastructure
1. **[ARCHITECTURE.md](../01-architecture/ARCHITECTURE.md)** - Sécurité & Conformité
2. **docs-private/SECRET_ROTATION.md (document interne non publié)** - Rotation secrets
3. **docs-private/SSO_SAML_CONFIG.md (document interne non publié)** - Configuration SSO

<a id="-je-veux-développer-pour-le-portfolio"></a>
### Je veux développer pour le Portfolio
1. **[saas/portfolio/README.md](../../saas/portfolio/README.md)** - Portfolio spécifique
2. **[USER_GUIDE.md](./USER_GUIDE.md)** - Guide utilisateur

<a id="-je-veux-utiliser-securevault"></a>
### Je veux utiliser SecureVault
1. **[USER_GUIDE.md](./USER_GUIDE.md)** - Guide utilisateur complet
2. **[SECUREVAULT_DEPLOYMENT.md](../02-deployment/SECUREVAULT_DEPLOYMENT.md)** - Déploiement
3. **[TROUBLESHOOTING.md](../04-operations/TROUBLESHOOTING.md#securevault---problèmes-enregistrement)** - Dépannage

---

<a id="-documentation-complète"></a>
## Documentation

<a id="-documentation-principale-9-fichiers"></a>
### Documentation Principale (9 fichiers)

#### Architecture & Infrastructure
| Document | Contenu | Public |
|----------|---------|--------|
| **[ARCHITECTURE.md](../01-architecture/ARCHITECTURE.md)** | 📋 Architecture technique, stack, infrastructure | ✅ Public |
| **[DOCKER_STRUCTURE.md](../01-architecture/DOCKER_STRUCTURE.md)** | 🐳 Structure Docker, composition, volumes | ✅ Public |
| **[DEPLOYMENT.md](../02-deployment/DEPLOYMENT.md)** | 🚀 Guide déploiement VPS, setup initial, configuration | ✅ Public |

#### Monitoring & Sécurité
| Document | Contenu | Public |
|----------|---------|--------|
| **[MONITORING.md](../03-guides/MONITORING.md)** | 📊 Setup Prometheus/Grafana/Loki, dashboards, alertes | ✅ Public |
| **[AUDIT_SYSTEM.md](../05-reference/AUDIT_SYSTEM.md)** | 🔍 Système d'audit SecureVault, logs, traçabilité | ✅ Public |
| **[CLOUD_BACKUP.md](../03-guides/CLOUD_BACKUP.md)** | 💾 Stratégie backup AWS S3 + Azure Blob, rétention | ✅ Public |

#### Automatisation & Support
| Document | Contenu | Public |
|----------|---------|--------|
| **[TROUBLESHOOTING.md](../04-operations/TROUBLESHOOTING.md)** | 🔧 Guide dépannage complet, diagnostic, solutions | ✅ Public |
| **[USER_GUIDE.md](./USER_GUIDE.md)** | 👤 Guide utilisateur SecureVault, features | ✅ Public |
| **[FEATURES_ROADMAP.md](../05-reference/FEATURES_ROADMAP.md)** | 🗺️ Roadmap produit, features plannifiées | ✅ Public |

---

<a id="-documentation-nouvelleconsolidée-4-fichiers"></a>
### Documentation Nouvelle/Consolidée (4 fichiers)

| Document | Contenu | Création | Type |
|----------|---------|----------|------|
| **[CI_CD_ARCHITECTURE.md](../01-architecture/CI_CD_ARCHITECTURE.md)** | 📊 Diagramme Mermaid CI/CD, 16 workflows détaillés | ✅ Nouvelle | ✨ Important |
| **[AUTOMATION_GUIDE.md](../03-guides/AUTOMATION_GUIDE.md)** | 🤖 Guide automatisation consolidé (3 fichiers fusionnés) | ✅ Consolidée | ✨ Important |
| **[TROUBLESHOOTING.md](../04-operations/TROUBLESHOOTING.md)** | 🔧 Enrichi : CORS + Registration intégrés | ✅ Enrichie | ✨ Important |
| **[DOCUMENTATION_AUDIT.md](../05-reference/DOCUMENTATION_AUDIT.md)** | 📋 Audit complet, plan d'optimisation, statistiques | ✅ Nouvelle | 📊 Référence |

---

<a id="-documentation-spécialisée-3-fichiers"></a>
### Documentation Spécialisée (3 fichiers)

| Document | Contenu | Audience |
|----------|---------|----------|
| **[PRO_DEPLOYMENT.md](../02-deployment/PRO_DEPLOYMENT.md)** | Guide déploiement PRO/Enterprise avec SLA | DevOps avancé |
| **[SECUREVAULT_DEPLOYMENT.md](../02-deployment/SECUREVAULT_DEPLOYMENT.md)** | Déploiement spécifique SecureVault, backend+frontend+DB | DevOps SecureVault |
| **[QUICK_DEPLOY_GUIDE.md](./QUICK_DEPLOY_GUIDE.md)** | Guide de démarrage rapide | Nouveaux |

---

<a id="-documentation-privée-3-fichiers"></a>
### Documentation Privée (3 fichiers)

**Emplacement**: `docs-private/`

| Document | Contenu | Sensibilité |
|----------|---------|-------------|
| **SECRET_ROTATION.md (document interne non publié)** | 🔄 Stratégie rotation secrets (JWT, DB, API keys) | 🔴 Sensible |
| **SSO_SAML_CONFIG.md (document interne non publié)** | 🔐 Configuration SSO/SAML avec certificats | 🔴 Sensible |
| **README_RESET_PASSWORD.md (document interne non publié)** | 🔑 Procédure réinitialisation PostgreSQL password | 🔴 Sensible |

**⚠️ Note** : Ces documents contiennent des configurations sensibles et des secrets. Accès limité.

---

<a id="-navigation-1-fichier"></a>
### Navigation (1 fichier)

| Document | Contenu |
|----------|---------|
| **[README.md](./README.md)** | Index principal documentation |

---

<a id="-structure-hiérarchique"></a>
## Structure Hiérarchique

```
docs/
├── 📋 Documentation Principale
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── DOCKER_STRUCTURE.md
│   ├── MONITORING.md
│   ├── AUDIT_SYSTEM.md
│   ├── CLOUD_BACKUP.md
│   ├── TROUBLESHOOTING.md
│   ├── USER_GUIDE.md
│   └── FEATURES_ROADMAP.md
│
├── 🆕 Documentation Nouvelle/Consolidée
│   ├── CI_CD_ARCHITECTURE.md ← NOUVEAU (diagramme Mermaid)
│   ├── AUTOMATION_GUIDE.md ← CONSOLIDÉ (3 → 1)
│   ├── TROUBLESHOOTING.md ← ENRICHI (CORS + Registration)
│   └── DOCUMENTATION_AUDIT.md ← NOUVEAU (audit)
│
├── 🎯 Documentation Spécialisée
│   ├── PRO_DEPLOYMENT.md
│   ├── SECUREVAULT_DEPLOYMENT.md
│   └── QUICK_DEPLOY_GUIDE.md
│
├── 📚 Navigation
│   └── README.md
│
└── 🔒 Index (ce fichier)
    └── INDEX.md (vous êtes ici)

docs-private/
├── 🔴 Sensible
│   ├── SECRET_ROTATION.md
│   ├── SSO_SAML_CONFIG.md
│   └── README_RESET_PASSWORD.md
```

---

<a id="-chemins-de-lecture-recommandés"></a>
## Chemins de Lecture Recommandés

### Pour DevOps / SRE

**Niveau 1 - Fondamentaux** (2-3h)
1. ARCHITECTURE.md
2. DEPLOYMENT.md
3. DOCKER_STRUCTURE.md

**Niveau 2 - Avancé** (4-5h)
1. CI_CD_ARCHITECTURE.md
2. MONITORING.md
3. AUTOMATION_GUIDE.md

**Niveau 3 - Expert** (2-3h)
1. PRO_DEPLOYMENT.md
2. docs-private/SECRET_ROTATION.md
3. docs-private/SSO_SAML_CONFIG.md

### Pour Développeurs

**Niveau 1 - Démarrage** (1-2h)
1. README.md (principal)
2. QUICK_DEPLOY_GUIDE.md
3. USER_GUIDE.md

**Niveau 2 - Approfondissement** (2-3h)
1. ARCHITECTURE.md
2. AUTOMATION_GUIDE.md
3. TROUBLESHOOTING.md

### Pour Administrateurs

**Niveau 1 - Setup Initial** (2-3h)
1. DEPLOYMENT.md
2. MONITORING.md
3. QUICK_DEPLOY_GUIDE.md

**Niveau 2 - Maintenance** (1-2h)
1. AUTOMATION_GUIDE.md
2. TROUBLESHOOTING.md
3. CLOUD_BACKUP.md

---

<a id="-recherche-rapide-par-mot-clé"></a>
## Recherche Rapide par Mot-Clé

### Infrastructure
- **Traefik** → ARCHITECTURE.md, DEPLOYMENT.md
- **Docker** → DOCKER_STRUCTURE.md, DEPLOYMENT.md
- **VPS** → DEPLOYMENT.md, ARCHITECTURE.md
- **SSL/TLS** → DEPLOYMENT.md, TROUBLESHOOTING.md

### CI/CD & Automatisation
- **GitHub Actions** → CI_CD_ARCHITECTURE.md, AUTOMATION_GUIDE.md
- **Workflows** → CI_CD_ARCHITECTURE.md, AUTOMATION_GUIDE.md
- **Déploiement automatique** → AUTOMATION_GUIDE.md, DEPLOYMENT.md
- **Releases** → CI_CD_ARCHITECTURE.md

### Monitoring & Sécurité
- **Prometheus/Grafana** → MONITORING.md
- **Health checks** → CI_CD_ARCHITECTURE.md, AUTOMATION_GUIDE.md
- **Audit logs** → AUDIT_SYSTEM.md
- **Backup** → CLOUD_BACKUP.md
- **Secrets** → docs-private/SECRET_ROTATION.md

### SecureVault
- **Déploiement** → SECUREVAULT_DEPLOYMENT.md
- **CORS** → TROUBLESHOOTING.md (SecureVault - Problèmes CORS)
- **Registration** → TROUBLESHOOTING.md (SecureVault - Problèmes Enregistrement)
- **User Guide** → USER_GUIDE.md
- **SSO/SAML** → docs-private/SSO_SAML_CONFIG.md

### Dépannage
- **Erreurs HTTP** → TROUBLESHOOTING.md (Erreurs HTTP)
- **Docker issues** → TROUBLESHOOTING.md (Problèmes Docker)
- **DNS problems** → TROUBLESHOOTING.md (Problèmes DNS)

---

<a id="-statistiques-documentation"></a>
## Statistiques Documentation

| Métrique | Valeur |
|----------|--------|
| **Fichiers publics** | 16 |
| **Fichiers privés** | 3 |
| **Total pages** | 19 |
| **Lignes totales** | ~3500+ |
| **Dernière mise à jour** | Janvier 2026 |
| **Couverture** | 95% ✅ |

### Optimisation Récente (Janvier 2026)

| Action | Détail | Impact |
|--------|--------|--------|
| **Suppressions** | 8 fichiers obsolètes/redondants | -35% fichiers |
| **Consolidations** | 4 fichiers → 1 guide (Automation) | -75% redondance |
| **Enrichissements** | CORS + Registration intégrés | Meilleur dépannage |
| **Créations** | 2 nouveaux (CI/CD, Audit) | +Clarté |
| **Migrations** | 2 docs sensibles vers private | +Sécurité |

---

<a id="-liens-utiles"></a>
## Liens Utiles

### Internes
- [README.md](../README.md) - Page d'accueil projet
- [base-infra/README.md](../../base-infra/README.md) - Infrastructure centralisée
- [saas/portfolio/README.md](../../saas/portfolio/README.md) - Portfolio multilingue
- [saas/securevault/README.md](../../saas/securevault/README.md) - SecureVault app

### Externes
- [GitHub Repo](https://github.com/christophe-freijanes/freijstack)
- [GitHub Actions](https://github.com/christophe-freijanes/freijstack/actions)
- [GitHub Issues](https://github.com/christophe-freijanes/freijstack/issues)
- [Portfolio Public](https://portfolio.freijstack.com)
- [SecureVault Production](https://vault.freijstack.com)

---

<a id="-comment-contribuer-à-la-documentation"></a>
## Comment Contribuer à la Documentation

1. **Créer une branche** : `git checkout -b docs/improvement`
2. **Faire les changements** : Éditer fichiers .md
3. **Tester localement** : Prévisualiser dans GitHub
4. **Commit explicite** : `git commit -m "docs: description du changement"`
5. **Pull Request** : Vers `develop` puis `master`

### Guide de Style
- **Utiliser Markdown** standard
- **Utiliser des titres courts** et une rédaction technique simple
- **Inclure exemples** de code
- **Lier documents** entre eux
- **Mettre à jour INDEX.md** si nouveaux fichiers

---

<a id="-support--questions"></a>
## Support & Questions

- **Issues GitHub** : [github.com/christophe-freijanes/freijstack/issues](https://github.com/christophe-freijanes/freijstack/issues)
- **Email** : christophe.freijanes@freijstack.com
- **Documentation** : Voir sections ci-dessus

---

<a id="-prochaines-étapes-documentaires"></a>
## Prochaines Étapes Documentaires

- [ ] Créer SSO_OVERVIEW.md (version publique non-sensible)
- [ ] Ajouter video tutorials
- [ ] Créer FAQ section
- [ ] Internationalization (FR/EN)

---

**Maintenu par**: Christophe FREIJANES  
**Licence**: All Rights Reserved  
**Version**: 1.0.0  
**Dernière mise à jour**: Janvier 2026
