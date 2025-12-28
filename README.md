# FreijStack

Portfolio et projets cloud & sécurité de **Christophe FREIJANES** - Senior Cloud & Security Specialist (DevSecOps).

## 📋 Structure du Projet

```
freijstack/
├── portfolio/          # Portfolio web professionnel (HTML/CSS/JS)
├── saas/              # Applications SaaS démos (DevSecOps, Microservices)
├── docs/              # Documentation et architecture
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

**Accès**: Ouvrir `portfolio/index.html` dans un navigateur.

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

- `architecture.md` - Vue d'ensemble de l'architecture technique

## 🚀 Démarrage Rapide

### Portfolio

```bash
cd portfolio
# Ouvrir index.html dans un navigateur
# ou servir avec un serveur local:
python3 -m http.server 8000
# Accès: http://localhost:8000
```

### Applications SaaS

```bash
cd saas/app1
docker build -t app1 .
docker run -p 8080:8080 app1

cd saas/app2
docker build -t app2 .
docker run -p 8081:8081 app2
```

## 💻 Technologies

### Portfolio
- HTML5, CSS3 (CSS Variables, Flexbox)
- JavaScript vanilla (pas de frameworks)
- Font Awesome 6.4.0
- Google Fonts
- Responsive Design

### SaaS
- Docker / Containerization
- Node.js / Python (selon l'app)
- Microservices
- CI/CD (GitHub Actions / etc.)
- WebSockets / REST APIs

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
