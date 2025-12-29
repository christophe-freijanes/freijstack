# Pull Request

## 📝 Description
<!-- Décrivez brièvement les changements apportés -->

## 🎯 Type de changement
- [ ] 🐛 Bug fix
- [ ] ✨ Nouvelle fonctionnalité
- [ ] 🔧 Amélioration technique
- [ ] 📚 Documentation
- [ ] 🔐 Sécurité
- [ ] 🎨 UI/UX
- [ ] ⚙️ Infrastructure/DevOps

---

## ✅ Checklist de Validation avant Merge

### 🔍 Code & Documentation
- [ ] Code review effectuée et approuvée
- [ ] Pas de conflits de merge
- [ ] README.md mis à jour si changements nécessaires
- [ ] Architecture.md mis à jour si impacte l'infrastructure
- [ ] Comments/documentation ajoutés pour code complexe

### 🧪 Tests & Validation
- [ ] Tests unitaires passent (`npm test` ou équivalent)
- [ ] Tests d'intégration validés
- [ ] CI/CD pipeline réussit (CodeQL, Gitleaks, Trivy, etc.)
- [ ] Aucun warning ou erreur dans la build
- [ ] HTML validation OK
- [ ] CSS minification OK
- [ ] JS minification OK

### 🔐 Sécurité
- [ ] Pas de secrets/credentials commitées
- [ ] Gitleaks scan OK (0 erreur)
- [ ] CodeQL analysis OK
- [ ] Trivy vulnerability scan OK
- [ ] CSP meta tag validé et à jour
- [ ] Dépendances sécurisées (npm audit clean si applicable)

### 📱 Frontend (si applicable)
- [ ] Portfolio responsive testé (768px, 480px, 360px)
- [ ] Mobile (iPhone, Pixel, Samsung) visuel OK
- [ ] Thème saisonnier appliqué correctement
- [ ] Langue (FR/EN) basculage OK
- [ ] Formulaire de contact validé

### ⚙️ Infrastructure & Déploiement
- [ ] docker-compose.yml valide
- [ ] Traefik routing configuré correctement
- [ ] Variables d'environnement documentées
- [ ] Subdomains DNS vérifiés (portfolio.freijstack.com, etc.)
- [ ] HTTPS/TLS actif
- [ ] Aucun hardcoding de domaines/IPs

### 📊 Avant Validation Finale
- [ ] Branche develop & master synchronisées si nécessaire
- [ ] Tags de version ajoutés si release
- [ ] CHANGELOG.md mis à jour (si applicable)
- [ ] Slack/notification de déploiement envoyée (si applicable)

### 🚀 Post-Merge
- [ ] Pipeline CI/CD lancé automatiquement
- [ ] Déploiement staging réussi
- [ ] Test en production/staging effectué
- [ ] Logs vérifiés (pas d'erreurs 5xx)
- [ ] Rollback plan en place en cas de problème

---

## 📸 Screenshots (si applicable)
<!-- Ajoutez des captures d'écran si pertinent -->

## 🔗 Issues liées
<!-- Closes #123 -->

---

**Merci pour votre contribution ! 🎉**
