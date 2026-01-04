# 🔐 SecureVault Professional - Guide Utilisateur

**Gestionnaire de mots de passe professionnel** inspiré de RoboForm, KeePass et HashiCorp Vault.

---

## 🎯 Vue d'ensemble

SecureVault est un gestionnaire de secrets professionnel avec :

- ✅ **Organisation par dossiers** (hiérarchie illimitée comme RoboForm)
- ✅ **9 types de secrets** (Login, Note sécurisée, Carte bancaire, etc.)
- ✅ **Champs personnalisés** pour chaque type
- ✅ **Historique de versions** (comme KeePass)
- ✅ **Import/Export** (CSV, JSON, KeePass)
- ✅ **Descriptions riches** et tags
- ✅ **Favoris et accès rapide**
- ✅ **Recherche avancée** en temps réel
- ✅ **Audit complet** des actions
- ✅ **SSO/SAML** pour entreprises
- ✅ **Rotation automatique** des secrets
- ✅ **Collections partagées** pour équipes

---

## 📁 Organisation avec Dossiers

### Créer un dossier

1. Cliquez sur le bouton **➕** en haut de la liste des dossiers
2. Entrez un nom (ex: "Travail", "Banque", "Personnel")
3. Choisissez une icône (📁, 💼, 🏦, 🔐, etc.)
4. Sélectionnez une couleur pour identifier visuellement
5. Cliquez sur **Créer**

### Dossiers spéciaux

- **🏠 All Secrets** : Tous vos secrets
- **⭐ Favorites** : Secrets favoris uniquement
- **🕒 Recent** : 20 secrets les plus récents
- **📄 Unfiled** : Secrets sans dossier

### Sous-dossiers

**Clic droit** sur un dossier → **New subfolder** pour créer une hiérarchie :

```
📁 Travail
  📂 Serveurs
    🖥️ Production
    🖥️ Staging
  📂 Bases de données
  📂 API Keys
```

### Actions sur dossiers

**Clic droit** sur un dossier :
- ✏️ **Rename** : Renommer
- ⭐ **Favorite** : Marquer comme favori
- ➕ **New subfolder** : Créer sous-dossier
- 🗑️ **Delete** : Supprimer (les secrets sont déplacés vers la racine)

---

## 🔑 Types de Secrets

### 1. **Login** (Identifiant + mot de passe)

Champs disponibles :
- Username
- Password (avec générateur)
- Website URL
- 2FA Code (TOTP)

**Idéal pour** : Sites web, applications, comptes en ligne

### 2. **Secure Note** (Note sécurisée)

Champs disponibles :
- Note (texte multiline)

**Idéal pour** : Codes PIN, numéros de série, informations sensibles

### 3. **Credit Card** (Carte bancaire)

Champs disponibles :
- Cardholder Name
- Card Number (masqué)
- Expiry (MM/YY)
- CVV (masqué)
- PIN

**Idéal pour** : Cartes de crédit, cartes de débit

### 4. **Identity** (Identité)

Champs disponibles :
- First Name / Last Name
- Email
- Phone
- Address
- SSN/ID Number (masqué)

**Idéal pour** : Informations personnelles, documents d'identité

### 5. **Server** (Serveur)

Champs disponibles :
- Hostname/IP
- Username
- Password (avec générateur)
- Port
- Protocol (SSH, RDP, VNC, Telnet)

**Idéal pour** : Serveurs, VPS, machines virtuelles

### 6. **Database** (Base de données)

Champs disponibles :
- Host
- Port
- Database Name
- Username
- Password (avec générateur)
- Type (PostgreSQL, MySQL, MongoDB, Redis, SQL Server)

**Idéal pour** : Connexions aux bases de données

### 7. **API Key** (Clé API)

Champs disponibles :
- Service Name
- API Key (masqué)
- API Secret (masqué)
- API Endpoint

**Idéal pour** : Services cloud, APIs tierces

### 8. **SSH Key** (Clé SSH)

Champs disponibles :
- Key Name
- Private Key (masqué, textarea)
- Public Key
- Passphrase

**Idéal pour** : Clés SSH, authentification par certificat

### 9. **Document** (Document sécurisé)

Champs disponibles :
- Content (textarea)
- File URL

**Idéal pour** : Documents texte, notes longues

---

## ✨ Créer un Secret

### Méthode simple

1. Cliquez sur **➕ New Secret** dans la barre d'outils
2. Remplissez les champs obligatoires (marqués d'une étoile ⭐)
3. Cliquez sur **Create Secret**

### Méthode avancée

1. Sélectionnez le **type de secret** approprié
2. Remplissez tous les champs disponibles
3. **Description** : Ajoutez une description courte (optionnel)
4. **Dossier** : Choisissez un dossier (ou laissez "No folder")
5. **Tags** : Ajoutez des tags pour faciliter la recherche (ex: "production", "urgent", "2025")
6. **Notes** : Ajoutez des notes privées (optionnel)
7. **⭐ Mark as favorite** : Cochez pour ajouter aux favoris
8. **Advanced Options** (repliable) :
   - **Expiration Date** : Date d'expiration du secret
   - **Auto-rotation** : Rotation automatique (avec intervalle en jours)

### Générateur de mots de passe

Pour les champs de type "password" :
- Cliquez sur l'icône **🎲** à droite du champ
- Un mot de passe sécurisé est généré automatiquement (16 caractères avec majuscules, minuscules, chiffres et symboles)

---

## 🔍 Recherche et Filtres

### Recherche globale

Utilisez la **barre de recherche** pour chercher dans :
- Noms de secrets
- Descriptions
- Usernames
- URLs
- Notes
- Tags

La recherche est **instantanée** et **insensible à la casse**.

### Filtres

- **Type de secret** : Filtrez par type (Login, Note, Card, etc.)
- **Dossier** : Sélectionnez un dossier dans l'arborescence
- **Favoris** : Cliquez sur "⭐ Favorites" dans les dossiers spéciaux

### Vues

- **☰ Liste** : Vue liste compacte (par défaut)
- **⊞ Grille** : Vue en grille pour visualiser plus de secrets

---

## 📋 Copier et Utiliser les Secrets

### Panneau de détails

1. Cliquez sur un secret dans la liste
2. Le **panneau de détails** s'ouvre à droite
3. Cliquez sur l'icône **📋** à côté de chaque champ pour copier

### Champs sensibles

- Les **mots de passe** sont masqués (••••••••)
- Copiez directement sans les afficher
- Le bouton devient **✓** après copie pendant 2 secondes

### Actions rapides

- **✏️ Edit** : Modifier le secret
- **🗑️ Delete** : Supprimer le secret
- **⭐/☆** : Ajouter/retirer des favoris

---

## 📜 Historique de Versions

Chaque modification d'un secret est **automatiquement sauvegardée**.

### Voir l'historique

1. Ouvrez un secret
2. Cliquez sur **History** (à implémenter dans l'UI)
3. Consultez toutes les versions précédentes avec :
   - Numéro de version
   - Champs modifiés
   - Date de modification

### Restaurer une version

1. Sélectionnez une version dans l'historique
2. Cliquez sur **Restore**
3. Le secret revient à cet état (une nouvelle version est créée)

---

## 📤 Import / Export

### Export

**Menu ⚙️** → **Export** :

- **CSV** : Format standard (compatible Excel, Google Sheets)
- **JSON** : Format complet avec métadonnées
- **KeePass CSV** : Format compatible avec KeePass 2.x

**Sécurité** : Les exports contiennent les mots de passe en clair. **Protégez ces fichiers !**

### Import

**Menu ⚙️** → **Import** :

#### Format CSV générique

Colonnes requises :
```csv
name,password,username,url,notes,type,folder
```

Exemple :
```csv
Gmail,MyP@ssw0rd123,john@gmail.com,https://gmail.com,Mon email perso,login,Personal
```

#### Format JSON

```json
[
  {
    "name": "Gmail",
    "password": "MyP@ssw0rd123",
    "username": "john@gmail.com",
    "url": "https://gmail.com",
    "type": "login",
    "description": "Mon email perso",
    "tags": ["email", "google"]
  }
]
```

#### Depuis KeePass

1. Exportez depuis KeePass au format **XML** ou **CSV**
2. Utilisez **Import from KeePass** dans SecureVault
3. Tous vos secrets sont importés avec leur structure

**Note** : Les imports créent de nouveaux secrets. Les doublons ne sont pas détectés automatiquement.

---

## 🏷️ Tags et Organisation

### Ajouter des tags

1. Lors de la création/édition d'un secret
2. Section "Tags"
3. Tapez un tag et appuyez sur **Entrée** ou cliquez sur **Add**
4. Les tags apparaissent comme des badges bleus

### Utiliser les tags

- Recherchez par tag : tapez le nom du tag dans la recherche
- Les tags sont partagés entre tous vos secrets
- Exemples de tags utiles :
  - `production`, `staging`, `dev`
  - `urgent`, `important`
  - `2025`, `old`
  - `shared`, `personal`

---

## 🔄 Rotation Automatique

Pour les secrets critiques (comme les mots de passe serveur) :

1. Activez **Auto-rotation** dans les options avancées
2. Définissez un intervalle (ex: 90 jours)
3. Le système :
   - Génère un nouveau mot de passe
   - Crée une version dans l'historique
   - Vous notifie par email (si configuré)

**Note** : La rotation automatique ne change pas le mot de passe sur le service distant. C'est un rappel pour le faire manuellement.

---

## 👥 Collections et Partage (Équipes)

### Créer une collection

1. Allez dans **Collections** (menu principal)
2. Cliquez sur **New Collection**
3. Nommez-la (ex: "DevOps Team", "Finance Department")
4. Ajoutez des membres avec leur niveau d'accès :
   - **Owner** : Contrôle total
   - **Editor** : Peut ajouter/modifier
   - **Viewer** : Lecture seule

### Ajouter des secrets à une collection

1. Ouvrez un secret
2. **Share** → **Add to Collection**
3. Sélectionnez une collection
4. Les membres peuvent maintenant voir ce secret

---

## 🔐 Sécurité et Bonnes Pratiques

### Mots de passe forts

- Utilisez le **générateur** intégré
- Minimum **16 caractères**
- Mélangez majuscules, minuscules, chiffres, symboles
- Ne réutilisez **jamais** un mot de passe

### Chiffrement

- Tous les secrets sont **chiffrés** avec AES-256
- Le chiffrement se fait côté serveur
- Seuls les utilisateurs autorisés peuvent déchiffrer

### Audit

- Toutes vos actions sont **auditées**
- Les administrateurs peuvent voir :
  - Qui a consulté quel secret
  - Quand et depuis quelle IP
  - Historique complet

### 2FA / MFA

Activez l'authentification à deux facteurs :
1. **Profile** → **Security**
2. **Enable MFA**
3. Scannez le QR code avec Google Authenticator / Authy
4. Entrez les codes de secours dans un endroit sûr

---

## 🆘 Dépannage

### "Secret not found"

- Vérifiez les filtres actifs
- Le secret est peut-être dans un autre dossier
- Utilisez la recherche globale

### Impossible de copier un mot de passe

- Autorisez l'accès au presse-papiers dans votre navigateur
- Certains navigateurs bloquent `navigator.clipboard` en HTTP (utilisez HTTPS)

### Import échoue

- Vérifiez le format du fichier (CSV UTF-8, JSON valide)
- Les colonnes `name` et `password` sont obligatoires
- Consultez les logs d'erreur après import

### Mot de passe oublié

1. Cliquez sur **Forgot Password** sur la page de login
2. Suivez le lien envoyé par email
3. Créez un nouveau mot de passe

**⚠️ Attention** : Si vous perdez votre mot de passe maître et que vous n'avez pas de code de récupération, **vos secrets sont perdus à jamais**. Le chiffrement est irréversible.

---

## 🔗 Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl + N` | Nouveau secret |
| `Ctrl + F` | Focus sur recherche |
| `Ctrl + K` | Recherche rapide |
| `Esc` | Fermer modal/panneau |
| `↑ ↓` | Naviguer dans la liste |
| `Enter` | Ouvrir secret sélectionné |
| `Ctrl + C` | Copier mot de passe (si secret ouvert) |

---

## 📊 Statistiques et Rapports

### Health Dashboard

Accédez à votre tableau de bord sécurité :
- **Weak passwords** : Mots de passe faibles à changer
- **Reused passwords** : Mots de passe réutilisés
- **Expired secrets** : Secrets expirés
- **Breached passwords** : Mots de passe compromis (via Have I Been Pwned)

### Recommandations

Le système analyse vos secrets et recommande :
- ✅ Activer MFA sur les comptes critiques
- ✅ Changer les mots de passe faibles
- ✅ Mettre à jour les secrets expirés
- ✅ Éliminer les doublons

---

## 🔄 Mises à Jour

SecureVault est mis à jour régulièrement avec :
- Nouveaux types de secrets
- Améliorations de sécurité
- Corrections de bugs
- Nouvelles fonctionnalités

**Changelog** : Consultez [FEATURES_ROADMAP.md](./FEATURES_ROADMAP.md)

---

## 💬 Support

### Documentation

- [Architecture](./ARCHITECTURE.md)
- [Déploiement](./DEPLOYMENT.md)
- [Audit System](./AUDIT_SYSTEM.md)
- [SSO/SAML Configuration](./SSO_SAML_CONFIG.md)

### Contact

- 📧 Email : support@securevault.example.com
- 💬 Discord : [SecureVault Community](#)
- 🐛 Issues : [GitHub Issues](#)

---

**🔐 Gardez vos secrets en sécurité avec SecureVault !**

*Version 2.0 - Décembre 2025*
