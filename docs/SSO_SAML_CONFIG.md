# 🔐 Configuration SSO/SAML pour SecureVault

SecureVault supporte désormais l'authentification SSO via SAML 2.0, permettant l'intégration avec des fournisseurs d'identité comme **Okta**, **Azure AD**, **Google Workspace**, **Keycloak**, etc.

---

## 📋 Prérequis

- Accès administrateur à votre fournisseur d'identité (IdP)
- Certificat public du fournisseur d'identité
- URLs publiques pour SecureVault (frontend et backend)

---

## 🚀 Configuration Backend

### 1. Variables d'environnement

Ajoutez ces variables à votre fichier `.env` (production ou staging) :

```bash
# SSO/SAML Configuration
SAML_ENABLED=true
SAML_IDP_NAME="Your Company SSO"

# Identity Provider URLs
SAML_ENTRY_POINT=https://your-idp.com/sso/saml
SAML_ISSUER=securevault

# Callback URL (où l'IdP envoie la réponse)
SAML_CALLBACK_URL=https://vault-api.freijstack.com/api/auth/saml/callback

# Certificat public de l'IdP (en une ligne, avec \n pour les retours à la ligne)
SAML_CERT="-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----"

# OU chemin vers le fichier certificat
SAML_CERT_PATH=./certs/idp-cert.pem

# Mapping des attributs SAML (optionnel, valeurs par défaut ci-dessous)
SAML_ATTR_EMAIL=http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress
SAML_ATTR_USERNAME=http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name
SAML_ATTR_FIRSTNAME=http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname
SAML_ATTR_LASTNAME=http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname

# Session (optionnel)
SESSION_SECRET=your-session-secret-change-me
SAML_SESSION_TIMEOUT=480  # en minutes (8 heures par défaut)
```

### 2. Récupérer les métadonnées du Service Provider

SecureVault génère automatiquement ses métadonnées SAML. Accédez à :

```
https://vault-api.freijstack.com/api/auth/saml/metadata
```

Téléchargez ce fichier XML et uploadez-le dans votre fournisseur d'identité.

---

## 🔧 Configuration par Fournisseur d'Identité

### Okta

1. **Applications** → **Create App Integration**
2. Choisir **SAML 2.0**
3. Configuration :
   - **Single sign on URL** : `https://vault-api.freijstack.com/api/auth/saml/callback`
   - **Audience URI (SP Entity ID)** : `securevault`
   - **Name ID format** : `EmailAddress`
4. **Attribute Statements** :
   - `email` → `user.email`
   - `username` → `user.login`
   - `firstName` → `user.firstName`
   - `lastName` → `user.lastName`
5. Télécharger le **certificat X.509** dans la section **Sign On**
6. Copier l'**Identity Provider Single Sign-On URL** → `SAML_ENTRY_POINT`

### Azure AD (Microsoft Entra ID)

1. **Enterprise Applications** → **New Application** → **Create your own application**
2. Choisir **Integrate any other application (non-gallery)**
3. **Single sign-on** → **SAML**
4. Configuration :
   - **Identifier (Entity ID)** : `securevault`
   - **Reply URL** : `https://vault-api.freijstack.com/api/auth/saml/callback`
5. **User Attributes & Claims** :
   - `email` → `user.mail`
   - `username` → `user.userprincipalname`
   - `givenname` → `user.givenname`
   - `surname` → `user.surname`
6. Télécharger **Certificate (Base64)**
7. Copier **Login URL** → `SAML_ENTRY_POINT`

### Google Workspace

1. **Apps** → **Web and mobile apps** → **Add custom SAML app**
2. **Service provider details** :
   - **ACS URL** : `https://vault-api.freijstack.com/api/auth/saml/callback`
   - **Entity ID** : `securevault`
   - **Name ID format** : `EMAIL`
3. **Attribute mapping** :
   - `email` → `Primary email`
   - `username` → `Primary email`
   - `firstName` → `First name`
   - `lastName` → `Last name`
4. Télécharger **IDP metadata** ou copier :
   - **SSO URL** → `SAML_ENTRY_POINT`
   - **Certificate** → `SAML_CERT`

### Keycloak

1. **Clients** → **Create**
2. **Client Protocol** : `saml`
3. **Client ID** : `securevault`
4. Configuration :
   - **Valid Redirect URIs** : `https://vault-api.freijstack.com/api/auth/saml/callback`
   - **Master SAML Processing URL** : `https://vault-api.freijstack.com/api/auth/saml/callback`
5. **Mappers** : Créer des mappers pour email, username, firstName, lastName
6. **Realm Settings** → **SAML 2.0 Identity Provider Metadata** → Télécharger
7. Extraire le certificat et l'**SSO Service URL**

---

## 🧪 Test de Configuration

### 1. Vérifier l'état SAML

```bash
curl https://vault-api.freijstack.com/api/auth/saml/enabled
```

Réponse attendue :
```json
{
  "enabled": true,
  "provider": "Your Company SSO"
}
```

### 2. Tester le flux d'authentification

1. Aller sur `https://vault.freijstack.com`
2. Cliquer sur **"Se connecter avec SSO"**
3. Vous devriez être redirigé vers votre IdP
4. Après authentification, retour sur SecureVault avec session active

### 3. Vérifier les logs

```bash
docker compose logs backend | grep -i saml
```

---

## 👥 Provisionnement des Utilisateurs

### Auto-Provisionnement

Par défaut, SecureVault crée automatiquement un compte lors de la première connexion SSO :

- ✅ Email récupéré depuis l'assertion SAML
- ✅ Username récupéré depuis l'assertion SAML
- ✅ Pas de mot de passe local (authentification SSO uniquement)
- ✅ Flag `is_sso_user` = true

### Désactiver l'Auto-Provisionnement

Si vous souhaitez créer les comptes manuellement, modifiez `backend/src/routes/saml.js` :

```javascript
// Ligne ~44 : Commenter la création automatique
if (user.rows.length === 0) {
  return done(new Error('User not found. Please contact your administrator.'));
}
```

---

## 🔒 Sécurité

### Certificats

**⚠️ Important** : 
- Stockez le certificat IdP de manière sécurisée
- Utilisez `SAML_CERT_PATH` pour charger depuis un fichier
- Ne commitez JAMAIS le certificat dans Git

### Rotation des Certificats

Lorsque votre IdP renouvelle son certificat :

1. Mettre à jour `SAML_CERT` ou le fichier certificat
2. Redémarrer le backend :
   ```bash
   docker compose restart backend
   ```

### Signature des Requêtes (Optionnel)

Pour signer les requêtes SAML envoyées à l'IdP :

```bash
# Générer une paire de clés
openssl req -x509 -new -newkey rsa:2048 -nodes \
  -keyout saml-private.key \
  -out saml-cert.pem \
  -days 3650

# Ajouter au .env
SAML_PRIVATE_KEY="$(cat saml-private.key)"
SAML_DECRYPTION_KEY="$(cat saml-private.key)"
```

---

## 🐛 Dépannage

### Erreur : "SAML not configured"

- Vérifier que `SAML_ENABLED=true`
- Vérifier que `SAML_ENTRY_POINT` et `SAML_CERT` sont définis
- Consulter les logs : `docker compose logs backend`

### Erreur : "Email not provided by identity provider"

- Vérifier le mapping des attributs dans l'IdP
- Ajuster `SAML_ATTR_EMAIL` dans le `.env`

### Erreur : "Invalid signature"

- Le certificat IdP est incorrect ou expiré
- Télécharger à nouveau le certificat depuis l'IdP

### Redirection infinie

- Vérifier que `SAML_CALLBACK_URL` correspond exactement à l'URL configurée dans l'IdP
- Vérifier que `FRONTEND_URL` est correct

---

## 📊 Audit

Toutes les connexions SSO sont enregistrées dans la table `audit_logs` :

```sql
SELECT * FROM audit_logs 
WHERE action = 'sso_login' 
ORDER BY created_at DESC;
```

---

## 🔄 Migration depuis Authentification Locale

Les utilisateurs existants peuvent continuer à utiliser leur mot de passe local. Pour migrer vers SSO uniquement :

1. Activer SSO
2. Faire se connecter l'utilisateur via SSO au moins une fois
3. (Optionnel) Désactiver l'authentification locale dans le code

---

## 📚 Ressources

- [SAML 2.0 Specification](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
- [Okta SAML Guide](https://developer.okta.com/docs/guides/saml-application-setup/overview/)
- [Azure AD SAML Guide](https://learn.microsoft.com/en-us/entra/identity/saas-apps/tutorial-list)
- [passport-saml Documentation](https://github.com/node-saml/passport-saml)

---

## ✅ Checklist de Déploiement

- [ ] Variables SAML configurées dans `.env`
- [ ] Certificat IdP récupéré et configuré
- [ ] Application créée dans l'IdP
- [ ] Métadonnées SP uploadées dans l'IdP
- [ ] URLs de callback configurées
- [ ] Test de connexion SSO réussi
- [ ] Auto-provisionnement testé
- [ ] Logs d'audit vérifiés
- [ ] Documentation partagée avec l'équipe
