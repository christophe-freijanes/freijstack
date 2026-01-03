# 🌐 Portfolio FreijStack

[![Responsive Design](https://img.shields.io/badge/design-Responsive%20HTML5%2FCSS3-blue?style=flat-square&logo=html5)](./index.html)
[![i18n Support](https://img.shields.io/badge/i18n-FR%2FEN-green?style=flat-square&logo=translation)](./script.js)
[![Accessibility](https://img.shields.io/badge/a11y-WCAG%20AA-purple?style=flat-square)](./index.html)
[![Security](https://img.shields.io/badge/security-CSP-red?style=flat-square)](./index.html)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](../../LICENSE)

---

## 📝 Présentation

Portfolio web multilingue et responsive de **Christophe FREIJANES** – Senior Cloud & Security Specialist (DevSecOps).

### 🎯 Contenu

Le portfolio présente :

- **Compétences Techniques**: Cloud (AWS, Azure, GCP), DevSecOps, Infrastructure, Monitoring, Méthodologies
- **Expériences Professionnelles**: 5 positions avec contexte détaillé et réalisations
- **Projets Récents**: 6 réalisations techniques avec cas d'usage
- **Certifications**: Badges Credly avec liens directs
- **Contact & Liens**: Email, formulaire, LinkedIn, GitHub, Twitter

---

## 🌍 Langues Supportées

- 🇫🇷 **Français (FR)** - Langue par défaut
- 🇬🇧 **Anglais (EN)** - Version anglaise complète

La sélection est persistée en localStorage automatiquement.

---

## 🎨 Fonctionnalités Principales

✨ **Design & UX**:
- Responsive Design (desktop, tablette, mobile)
- Thèmes saisonniers automatiques
- Animations fluides (CSS3)
- Dark mode support
- Curseur lumineux avec particules
- Photo profil dynamique

🔐 **Sécurité**:
- Content Security Policy (CSP)
- HTTPS/TLS (Let's Encrypt)
- Pas de tracking externe
- Pas de cookies
- Validation HTML5
- XSS Protection

♿ **Accessibilité**:
- WCAG AA Compliance
- Sémantique HTML5
- Contraste 4.5:1+
- Navigation clavier
- ARIA labels
- Alt text descriptifs

---

## 🏗️ Structure

```
portfolio/
├── index.html              # Page principale
├── style.css               # Styles (CSS variables, responsive)
├── script.js               # Logique JavaScript (i18n, animations)
├── public/                 # Assets statiques
│   ├── images/             # Photos, icônes
│   ├── favicons/           # favicon, manifest
│   └── manifest.json       # PWA manifest
├── README.md               # Ce fichier
└── .gitignore
```

---

## 🚀 Accès Rapides

- **Production**: https://portfolio.freijstack.com/ (master branch)
- **Staging**: https://portfolio-staging.freijstack.com/ (develop branch)
- **Local**: Ouvrir index.html ou serveur local

---

## ⚡ Démarrage Local

### Option 1: Ouvrir Directement
```bash
# Double-cliquez sur index.html
```

### Option 2: Serveur Python
```bash
cd saas/portfolio
python3 -m http.server 8000
# http://localhost:8000
```

### Option 3: Serveur Node.js
```bash
npx http-server .
# http://localhost:8080
```

### Option 4: Live Server VS Code
```bash
# Extension VS Code → Click droit → "Open with Live Server"
```

### Option 5: Docker
```bash
docker build -t portfolio:latest .
docker run -d -p 8000:80 --name portfolio portfolio:latest
# http://localhost:8000
```

---

## 📊 Sections Principales

| Section | Contenu |
|---------|---------|
| Hero | Welcome, avatar, call-to-action |
| About | Bio détaillée, points clés |
| Skills | 9 catégories, 50+ compétences |
| Experience | 5 positions, timeline interactive |
| Projects | 6 réalisations, modals, links |
| Certifications | Badges Credly avec liens |
| Contact | Email, formulaire, social links |

---

## 🔒 Sécurité

### Headers de Sécurité
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection

### HTTPS/TLS
- ✅ Let's Encrypt certificats
- ✅ TLS 1.3 uniquement
- ✅ Redirection HTTP → HTTPS (301)
- ✅ HSTS preload ready

### Privacy
- ✅ Pas de tracking (0 Google Analytics)
- ✅ Pas de cookies tiers
- ✅ Pas d'API keys exposées
- ✅ GDPR compliant

---

## 📝 Customization

### Modifier le Contenu

Tous les textes et données dans `script.js`:

```javascript
// Traductions i18n
const translations = { fr: { ... }, en: { ... } };

// Expériences
const experiences = [ { title, company, dates, ... } ];

// Projets
const projects = [ { title, description, url, ... } ];

// Certifications
const certifications = [ { name, issuer, credlyId, url } ];
```

### Ajouter une Certification

```javascript
const certifications = [
  {
    name: 'AWS Solutions Architect',
    issuer: 'AWS',
    credlyId: '12345',
    url: 'https://credly.com/...'
  }
];
```

### Modifier les Thèmes

```css
/* style.css */
:root {
  --color-primary: #0066cc;
  --color-accent: #ff6600;
}

[data-season="winter"] {
  --color-primary: #0066ff;  /* Bleu */
}
```

---

## 🛠️ Maintenance

### Health Checks

```bash
# Accessibilité
curl -v https://portfolio.freijstack.com/

# Headers de sécurité
curl -I https://portfolio.freijstack.com/

# TLS version
openssl s_client -connect portfolio.freijstack.com:443
```

### Logs Production

```bash
# Logs d'accès nginx
tail -f /var/log/nginx/portfolio.access.log

# Logs d'erreur
tail -f /var/log/nginx/portfolio.error.log
```

---

## 🚀 Déploiement

### CI/CD Workflow

```
Code Push → GitHub
   ↓
GitHub Actions
   ├─> Validate (HTML/CSS/JS)
   ├─> Security (CodeQL, Gitleaks)
   ├─> Build (Minify)
   └─> Deploy (rsync)
      ├─> Staging (develop)
      └─> Production (master)
```

### Mise à Jour

```bash
# Développement
git checkout develop
# Editer les fichiers...
git add .
git commit -m "feat: portfolio update"
git push origin develop
# Auto-déploiement sur staging

# Quand prêt: merger vers master
git checkout master
git merge develop
git push origin master
# Auto-déploiement en production
```

---

## 📚 Documentation

- **Architecture**: [../../docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
- **Déploiement**: [../../docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md)
- **SaaS Apps**: [../README.md](../README.md)
- **Infrastructure**: [../../base-infra/README.md](../../base-infra/README.md)

---

## 📬 Contact

- 📧 **Email**: [portfolio.freijstack.com](https://portfolio.freijstack.com) (formulaire)
- 💼 **LinkedIn**: [christophe-freijanes](https://www.linkedin.com/in/christophe-freijanes)
- 🎓 **Credly**: [Certifications](https://www.credly.com/users/christophe-freijanes)
- 🐙 **GitHub**: [@christophe-freijanes](https://github.com/christophe-freijanes)

---

© 2025 Christophe FREIJANES. Tous droits réservés.

**Créé par**: Christophe FREIJANES  
**Dernière mise à jour**: Janvier 2026  
**Version**: 2.6.0  
**Status**: ✅ Production Ready
