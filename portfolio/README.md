# Portfolio - Christophe FREIJANES

Portfolio web professionnel multilingue (FR/EN) mettant en avant les compétences Cloud & Security / DevSecOps.

## 📌 Caractéristiques

### Design & UX
- **Responsive** - Adapté desktop, tablet, mobile
- **Thèmes saisonniers** - Changement automatique de couleurs selon la saison (Hiver/Printemps/Été/Automne)
- **Animations fluides** - Transitions CSS3 et JavaScript
- **Curseur lumineux** - Effet personnalisé (radial-gradient)
- **Profil photo** - Animation slideIn avec glow effect

### Multilingue (i18n)
- 150+ clés de traduction (FR/EN)
- Sélecteur de langue dans la barre de navigation
- Persistance en localStorage
- Changement de langue sans rechargement de page

### Contenu
- **Hero section** - Présentation avec code block
- **Certifications** - Lien vers profil Credly avec hover surbrillance
- **9 catégories de compétences**:
  - Cloud & Security
  - DevSecOps
  - Backup & Disaster Recovery
  - Automation & IaC
  - Monitoring & Observability
  - Operating Systems (RedHat/Fedora/Amazon Linux, Debian/Ubuntu, Windows Server, ArchLinux)
  - Virtualization & Infrastructure (VMware, RHV, OVirt, KVM, Load Balancing)
  - Storage Solutions
  - Methodologies (Agile, ITIL, CI/CD, GitOps)
- **Expériences** - Timeline avec 5 positions professionnelles
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

## 📁 Fichiers

| Fichier | Description |
|---------|-------------|
| `index.html` | Structure HTML5 complète avec data-i18n |
| `style.css` | Styling avec CSS variables et animations |
| `script.js` | Logique i18n, thèmes saisonniers, interactions |

## 🎨 Thèmes Saisonniers

Changement automatique selon le mois:
- **Hiver** (Déc-Fév): Bleu `#5ec4e8`
- **Printemps** (Mar-Mai): Vert `#5cd685`
- **Été** (Jun-Août): Orange `#f5a142`
- **Automne** (Sep-Nov): Orange rouille `#d97845`

Variables CSS utilisées:
- `--accent`: Couleur principale
- `--accent-rgb`: RGB de l'accent (pour rgba avec opacité)
- `--text-primary`: Texte principal
- `--text-secondary`: Texte secondaire
- `--bg-primary`: Fond principal
- `--border-color`: Couleur des bordures

## 🌐 Langues Supportées

| Code | Langue |
|------|--------|
| `fr` | Français |
| `en` | English |

## ♿ Accessibilité

- WCAG AA compliant (contraste minimum 4.5:1)
- HTML5 sémantique
- Attributs `data-i18n` pour structure claire
- Pas de dépendances externes (sauf Font Awesome)

## 🔧 Technologies

- **HTML5** - Structure sémantique
- **CSS3** - Flexbox, Grid, Variables CSS, Animations
- **JavaScript vanilla** - Aucun framework
- **Font Awesome 6.4.0** - Icônes
- **Google Fonts** - Typographie

## 📊 Performance

- Pas de frameworks lourds
- CSS variables pour optimiser les recalculs
- animations matérielles (transform, opacity)
- Lazy loading des images (portfolio photo)

## 📝 Maintenance

### Ajouter une traduction
1. Ajouter `data-i18n="key"` à l'élément HTML
2. Ajouter la clé dans `script.js` → `translations.fr.key` et `translations.en.key`

### Modifier les couleurs saisonnières
Éditer les variables CSS dans `style.css`:
```css
body.season-winter {
  --accent: #5ec4e8;
  --accent-rgb: 94, 196, 232;
}
```

### Ajouter des animations
Utiliser les animations existantes ou en créer dans `style.css` → section `@keyframes`

---

**Créé par**: Christophe FREIJANES | **Dernière mise à jour**: Décembre 2025
