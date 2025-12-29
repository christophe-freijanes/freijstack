# Portfolio - Christophe FREIJANES

[![Live](https://img.shields.io/badge/live-portfolio.freijstack.com-success?style=flat-square&logo=globe)](https://portfolio.freijstack.com/)
[![Staging](https://img.shields.io/badge/staging-portfolio--staging.freijstack.com-blue?style=flat-square&logo=globe)](https://portfolio-staging.freijstack.com/)
[![Multilingue](https://img.shields.io/badge/languages-FR%2FEN-orange?style=flat-square&logo=language)](./index.html)
[![Responsive](https://img.shields.io/badge/responsive-mobile--first-green?style=flat-square&logo=device)](./style.css)
[![WCAG AA](https://img.shields.io/badge/accessibility-WCAG%20AA-blue?style=flat-square&logo=ada)](./index.html)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](../LICENSE)

Portfolio web professionnel multilingue (FR/EN) mettant en avant les compétences Cloud & Security / DevSecOps.

## 📌 Caractéristiques

### Design & UX
- **Responsive** - Adapté desktop, tablet, mobile
- **Thèmes saisonniers** - Changement automatique de couleurs selon la saison (Hiver/Printemps/Été/Automne)
- **Animations fluides** - Transitions CSS3 et JavaScript
- **Curseur lumineux** - Effet personnalisé (radial-gradient)
- **Profil photo** - Animation slideIn avec glow effect
- **Accessibilité WCAG AA** - Contraste 4.5:1, sémantique HTML5

### Multilingue (i18n)
- 150+ clés de traduction (FR/EN)
- Sélecteur de langue dans la barre de navigation
- Persistance en localStorage
- Changement de langue sans rechargement de page

### Sécurité
- **Content Security Policy (CSP)** - Headers restrictifs
- **No external trackers** - Vie privée complète
- **HTML validation** - W3C compliance
- **WCAG AA** - Accessibilité

### Contenu
- **Hero section** - Présentation avec code block
- **Certifications** - Lien vers profil Credly avec hover surbrillance
- **9 catégories de compétences**:
  - Cloud & Security
  - DevSecOps & CI/CD
  - Backup & Disaster Recovery
  - Automation & Development (Python, Bash, PowerShell, YAML, n8n)
  - Monitoring & Observability
  - Operating Systems (RedHat/Fedora/Amazon Linux, Debian/Ubuntu, Windows Server, ArchLinux)
  - Virtualization & Infrastructure (VMware, RHV, OVirt, KVM, Load Balancing)
  - Storage Solutions (SAN, NAS, S3, Data Replication)
  - Methodologies (DevSecOps, Agile SAFe, ITIL v4)
- **Expériences** - Timeline avec 5 positions professionnelles:
  - ACENSI (2023 - Aujourd'hui): DevSecOps, Cloud Security, Backup-as-Code
  - SQUAD (2022-2023): System Engineering, Hardening, Containers
  - ECONOCOM (2020-2022): Infrastructure, Automation, Storage
  - DIGIMIND (2020): R&D, Monitoring, Big Data
  - HARDIS (2019-2020): CloudOps, Backup, Compliance
- **Projets** - 6 réalisations avec détails techniques
- **Footer** - Navigation et informations de contact

## 🚀 Utilisation

### Ouvrir localement
```bash
# Option 1: Ouvrir directement
# Double-cliquez sur index.html

# Option 2: Serveur local (Python)
cd portfolio
python3 -m http.server 8000
# Accès: http://localhost:8000

# Option 3: Serveur local (Node.js)
npx http-server .
# Accès: http://localhost:8080
```

### En Développement
```bash
# Créer une branche feature
git checkout -b feat/ma-modification

# Editer portfolio/index.html, style.css, script.js
# Tester localement

# Commit et push vers develop
git add portfolio/
git commit -m "feat: description de la modification"
git push origin feat/ma-modification

# Créer une PR sur develop
# Vérifier https://freijstack.com/portfolio-staging/
# Merger dans develop quand OK
# CI/CD déploie automatiquement vers staging

# Quand prêt pour production:
git checkout develop
git pull
git checkout master
git merge develop
git push origin master
# CI/CD déploie automatiquement vers production
```

## 📊 Performance

- **Pas de frameworks lourds** - HTML5/CSS3/JavaScript vanilla
- **CSS variables** - Optimise les recalculs
- **Animations GPU** - Transform et opacity uniquement
- **Lazy loading** - Images optimisées
- **Minification** - CSS/JS minifiés en production (via CI/CD)

**Lighthouse** (local):
- Performance: 95+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

# Accès: http://localhost:8080
```

## 📁 Fichiers

| Fichier | Description |
|---------|-------------|
| `index.html` | Structure HTML5 sémantique avec data-i18n, CSP headers |
| `style.css` | Styling avec CSS variables, animations, responsive design |
| `script.js` | Logique i18n, thèmes saisonniers, interactions, email handling |
| `public/` | Assets statiques (si nécessaire) |

## 🎨 Thèmes Saisonniers

Changement automatique selon le mois:
- **Hiver** (Déc-Fév): Bleu `#5ec4e8`
- **Printemps** (Mar-Mai): Vert `#5cd685`
- **Été** (Jun-Août): Orange `#f5a142`
- **Automne** (Sep-Nov): Orange rouille `#d97845`

Variables CSS utilisées:
```css
--accent              /* Couleur principale */
--accent-rgb          /* RGB pour rgba() */
--text-primary        /* Texte principal */
--text-secondary      /* Texte secondaire */
--bg-primary          /* Fond principal */
--border-color        /* Couleur des bordures */
```

## 🌐 Langues Supportées

| Code | Langue |
|------|--------|
| `fr` | Français |
| `en` | English |

## ♿ Accessibilité & Sécurité

✅ **WCAG AA Compliance**
- Contraste minimum 4.5:1 pour tous les textes
- HTML5 sémantique (header, nav, main, footer, section)
- Attributs aria-label pour landmarks
- Pas de contenu masqué aux lecteurs d'écran

✅ **Content Security Policy**
```
default-src 'self'
script-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com
style-src 'self' https://fonts.googleapis.com https://cdnjs.cloudflare.com
img-src 'self' data: https:
font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:
```

✅ **Pas de trackers externes**
- Google Fonts et Font Awesome sont autorisés
- Aucun analytics (Google, Facebook, etc.)
- Aucun cookie tiers

## 🔧 Technologies

- **HTML5** - Structure sémantique
- **CSS3** - Flexbox, Grid, Variables CSS, Animations
- **JavaScript vanilla** - Aucun framework ou dépendance externe
- **Font Awesome 6.4.0** - Icônes
- **Google Fonts** - Typographie (Inter, Fira Code)

## 📊 Performance

- Pas de frameworks lourds
- CSS variables pour optimiser les recalculs
- Animations matérielles (transform, opacity)
- Lazy loading des images (portfolio photo LinkedIn)
- Bundle taille: < 50KB (HTML+CSS+JS minifiés)

## 🔄 CI/CD & Déploiement

Le portfolio est déployé automatiquement via GitHub Actions:

### Workflow
1. **Validate** - Linting HTML/CSS/JS
2. **Build** - Minification CSS/JS
3. **Security Scan** - Gitleaks, Trivy, CodeQL
4. **Deploy**:
   - `develop` branch → `portfolio-staging.freijstack.com`
   - `master` branch → `portfolio.freijstack.com`

### Branches
- `develop` - Staging (test avant production)
- `master` - Production (live)

### Déploiement Manuel
```bash
# Sur develop
git checkout develop
git add portfolio/
git commit -m "feat: modification"
git push origin develop
# Vérifier https://freijstack.com/portfolio-staging/

# Merger vers master quand OK
git checkout master
git merge develop
git push origin master
# https://portfolio.freijstack.com/ mis à jour automatiquement
```

## 📝 Maintenance

### Ajouter une traduction
1. Ajouter `data-i18n="key"` à l'élément HTML
2. Ajouter la clé dans `script.js`:
```javascript
translations.fr.key = "Texte français";
translations.en.key = "English text";
```

### Modifier les couleurs saisonnières
Éditer dans `style.css`:
```css
body.season-winter {
  --accent: #5ec4e8;
  --accent-rgb: 94, 196, 232;
}
```

### Ajouter des animations
Utiliser les animations existantes ou créer dans `style.css` → `@keyframes`

## 🐛 Dépannage

### Problème: Images ne chargent pas
```
CSP bloque les images externes
Solution: Ajouter le domaine à img-src dans le CSP header
```

### Problème: Police ne s'applique pas
```
Google Fonts peut être bloqué
Solution: Vérifier la connexion réseau et CSP
```

### Problème: Langue ne persiste pas
```
localStorage désactivé ou site en mode anonyme
Solution: Vérifier les paramètres du navigateur
```

---

**Créé par**: Christophe FREIJANES  
**Dernière mise à jour**: Décembre 2025  
**Version**: 2.1  
**Status**: ✅ Production
