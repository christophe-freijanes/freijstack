# 🚀 SecureVault Pro - Guide de Déploiement

## 📦 Ce qui a été implémenté

### ✅ Features Professionnelles

SecureVault est maintenant un **gestionnaire de mots de passe professionnel** au niveau de :
- ✅ **RoboForm** : Organisation par dossiers hiérarchiques, interface intuitive
- ✅ **KeePass** : Historique de versions, champs personnalisés, types de secrets
- ✅ **HashiCorp Vault** : Rotation automatique, audit complet, collections partagées

---

## 🗂️ Fichiers Créés/Modifiés

### Backend

#### **Migrations SQL**
- `backend/migrations/002_pro_features.sql` ⭐
  - Tables : folders, secret_types, secret_history, password_health, collections
  - 9 types de secrets prédéfinis
  - Triggers pour historique automatique
  - Vues SQL pour analytics

#### **Routes API**
- `backend/src/routes/folders.js` - Gestion des dossiers (CRUD, move, stats)
- `backend/src/routes/secretsEnhanced.js` - Secrets enrichis avec historique
- `backend/src/routes/importExport.js` - Import/Export (CSV, JSON, KeePass)

#### **Configuration**
- `backend/src/server.js` - Routes ajoutées
- `backend/package.json` - Dépendances : `multer`, `csv-parser`

### Frontend

#### **Composants React**
- `frontend/src/components/SecretVault.js` + `.css` - Dashboard principal (3 colonnes)
- `frontend/src/components/FolderTree.js` + `.css` - Arborescence de dossiers
- `frontend/src/components/SecretForm.js` + `.css` - Formulaire dynamique

#### **Fonctionnalités UI**
- Vue liste/grille
- Recherche en temps réel
- Copie au presse-papiers
- Générateur de mots de passe
- Gestion des tags
- Import/Export intégré

### Documentation

- `docs/USER_GUIDE.md` - Guide utilisateur complet (62 KB)
- `docs/AUDIT_SYSTEM.md` - Documentation audit
- `docs/SSO_SAML_CONFIG.md` - Configuration SSO
- `docs/FEATURES_ROADMAP.md` - Roadmap des features

---

## 🔧 Installation et Déploiement

### 1. Prérequis

```bash
# Sur le VPS
Node.js 18+
PostgreSQL 15+
Docker & Docker Compose v2+
```

### 2. Exécuter les Migrations

```bash
# Se connecter au VPS
ssh user@secrets.example.com

# Aller dans le dossier
cd /opt/securevault

# Exécuter les migrations dans l'ordre
docker compose exec postgres psql -U postgres -d securevault < backend/migrations/001_add_features.sql
docker compose exec postgres psql -U postgres -d securevault < backend/migrations/002_pro_features.sql
```

**Vérification** :
```sql
-- Connectez-vous à PostgreSQL
docker compose exec postgres psql -U postgres -d securevault

-- Vérifiez les tables
\dt

-- Devrait afficher :
-- folders, secret_types, secret_history, password_health, collections, etc.

-- Vérifiez les types de secrets
SELECT name, label FROM secret_types;

-- Devrait afficher 9 types : login, secure_note, credit_card, etc.
```

### 3. Installer les Dépendances

```bash
# Backend
cd backend
npm install multer csv-parser
npm install  # Réinstalle toutes les dépendances

# Vérifier
npm list multer csv-parser
```

### 4. Redémarrer les Services

```bash
# Depuis /opt/securevault
docker compose down
docker compose up -d

# Vérifier les logs
docker compose logs -f backend
docker compose logs -f frontend

# Vérifier que tout fonctionne
curl http://localhost:3001/health
```

### 5. Configurer les Variables d'Environnement

Ajoutez dans `backend/.env` :

```env
# Existing vars...

# Email configuration (pour alerts et rotation)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=securevault@example.com
SMTP_PASS=your_smtp_password

# Session secret (pour SSO/SAML)
SESSION_SECRET=your_super_secret_session_key_change_this
```

---

## 🧪 Tests

### Test Backend API

```bash
# Variables
TOKEN="your_jwt_token"
API_URL="http://localhost:3001"

# 1. Liste des types de secrets
curl -H "Authorization: Bearer $TOKEN" \
  $API_URL/api/secrets-pro/types

# 2. Créer un dossier
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Folder","icon":"📁","color":"#2196F3"}' \
  $API_URL/api/folders

# 3. Créer un secret
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test Login",
    "value":"MyPassword123",
    "type":"login",
    "username":"test@example.com",
    "url":"https://example.com",
    "description":"Test secret"
  }' \
  $API_URL/api/secrets-pro

# 4. Lister les secrets
curl -H "Authorization: Bearer $TOKEN" \
  $API_URL/api/secrets-pro

# 5. Export CSV
curl -H "Authorization: Bearer $TOKEN" \
  $API_URL/api/import-export/csv \
  -o export.csv
```

### Test Frontend

1. Ouvrez http://localhost:3000
2. Connectez-vous avec votre compte
3. Vérifiez :
   - ✅ Arborescence de dossiers à gauche
   - ✅ Liste des secrets au centre
   - ✅ Panneau de détails à droite
   - ✅ Bouton "New Secret" fonctionne
   - ✅ Recherche fonctionne
   - ✅ Création de dossiers fonctionne
   - ✅ Import/Export menu accessible

---

## 📊 Bases de Données

### Structure Complète

```
Tables créées par 002_pro_features.sql :

📁 folders                    - Dossiers hiérarchiques
📋 secret_types               - 9 types prédéfinis
🔑 secrets (enhanced)         - Champs ajoutés : folder_id, type, description, url, username, notes, custom_fields
📜 secret_history             - Historique de toutes les modifications
🏷️  tags                      - Tags utilisateur
🔗 secret_tags                - Liaison secrets ↔ tags
👥 collections                - Vaults partagés
👤 collection_members         - Membres des collections
🔐 collection_secrets         - Secrets dans collections
🛡️  password_health           - Santé des mots de passe
📤 imports                    - Historique des imports
⚡ quick_access               - Favoris/épinglés

Views :
- folder_tree                 - Arbre complet des dossiers
- most_used_secrets           - Secrets les plus consultés
- password_health_summary     - Résumé santé par utilisateur
```

### Indexes Créés

```sql
-- Performance optimale avec indexes sur :
folders(user_id, parent_id)
secrets(folder_id, type, is_favorite, expires_at)
secret_history(secret_id, created_at)
password_health(secret_id, resolved)
collections(owner_id)
collection_members(user_id)
```

---

## 🔄 Workflows GitHub Actions

### Déploiement Automatique

Les workflows existants fonctionnent toujours :
- `.github/workflows/securevault-deploy.yml`
- `.github/workflows/harbor-deploy.yml`

**Après chaque déploiement**, les migrations doivent être exécutées manuellement :

```yaml
# Ajoutez cette étape dans le workflow (optionnel)
- name: Run Database Migrations
  run: |
    ssh ${{ secrets.VPS_SSH_USER }}@${{ secrets.VPS_SSH_HOST }} << 'ENDSSH'
      cd /opt/securevault
      docker compose exec -T postgres psql -U postgres -d securevault < backend/migrations/002_pro_features.sql
    ENDSSH
```

---

## 🚨 Checklist de Production

### Avant le déploiement

- [ ] Backup de la base de données actuelle
  ```bash
  docker compose exec postgres pg_dump -U postgres securevault > backup_$(date +%Y%m%d).sql
  ```

- [ ] Tester les migrations sur une copie
  ```bash
  # Créer une DB de test
  docker compose exec postgres createdb -U postgres securevault_test
  
  # Importer backup
  docker compose exec postgres psql -U postgres securevault_test < backup.sql
  
  # Tester migrations
  docker compose exec postgres psql -U postgres securevault_test < backend/migrations/002_pro_features.sql
  ```

- [ ] Vérifier les dépendances NPM
  ```bash
  cd backend && npm audit
  cd frontend && npm audit
  ```

- [ ] Tester en environnement staging

### Après le déploiement

- [ ] Vérifier les logs (pas d'erreurs)
  ```bash
  docker compose logs backend | grep -i error
  docker compose logs frontend | grep -i error
  docker compose logs postgres | grep -i error
  ```

- [ ] Tester les endpoints API
  ```bash
  # Health check
  curl https://api.secrets.example.com/health
  
  # Types de secrets
  curl -H "Authorization: Bearer $TOKEN" \
    https://api.secrets.example.com/api/secrets-pro/types
  ```

- [ ] Créer un dossier de test
- [ ] Créer un secret de test
- [ ] Tester l'export CSV
- [ ] Vérifier l'audit log
  ```sql
  SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;
  ```

- [ ] Monitorer les performances
  ```bash
  docker stats
  ```

---

## 📈 Monitoring

### Métriques à surveiller

```sql
-- Nombre total de secrets par utilisateur
SELECT u.username, COUNT(s.id) as total_secrets
FROM users u
LEFT JOIN secrets s ON u.id = s.user_id
GROUP BY u.id, u.username
ORDER BY total_secrets DESC;

-- Santé des mots de passe
SELECT * FROM password_health_summary;

-- Activité récente
SELECT 
  action, 
  COUNT(*) as count, 
  DATE(created_at) as date
FROM audit_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY action, DATE(created_at)
ORDER BY date DESC, count DESC;

-- Dossiers les plus utilisés
SELECT 
  f.name, 
  COUNT(s.id) as secret_count
FROM folders f
LEFT JOIN secrets s ON f.id = s.folder_id
GROUP BY f.id, f.name
ORDER BY secret_count DESC
LIMIT 10;
```

### Alertes à configurer

- ⚠️ Tentatives de connexion échouées > 5
- ⚠️ Base de données > 80% pleine
- ⚠️ CPU > 80% pendant > 5 min
- ⚠️ Secrets expirés non renouvelés
- ⚠️ Imports avec erreurs

---

## 🔐 Sécurité Post-Déploiement

### 1. Rotation des Secrets VPS

```bash
# Régénérer JWT_SECRET
openssl rand -hex 32

# Régénérer SESSION_SECRET
openssl rand -hex 32

# Mettre à jour dans .env et redémarrer
docker compose restart backend
```

### 2. Configurer SMTP

Pour recevoir les alertes et notifications :

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxx
```

### 3. Activer SSL/TLS

Vérifiez que Traefik gère bien les certificats Let's Encrypt :

```bash
docker compose logs traefik | grep -i certificate
```

### 4. Audit Initial

Exécutez un audit de sécurité :

```bash
# Vérifier les permissions
docker compose exec postgres psql -U postgres -d securevault -c "\du"

# Vérifier l'encryption
docker compose exec postgres psql -U postgres -d securevault -c "SELECT COUNT(*) FROM secrets WHERE value IS NOT NULL;"

# Vérifier les logs d'audit
docker compose exec postgres psql -U postgres -d securevault -c "SELECT COUNT(*) FROM audit_logs;"
```

---

## 🎉 Félicitations !

SecureVault est maintenant un **gestionnaire de secrets professionnel** avec toutes les fonctionnalités des leaders du marché.

### Prochaines Étapes

1. ✅ **Tester** toutes les fonctionnalités
2. ✅ **Former** les utilisateurs (envoyez-leur [USER_GUIDE.md](USER_GUIDE.md))
3. ✅ **Monitorer** les performances et logs
4. ✅ **Collecter** les feedbacks
5. ✅ **Itérer** sur les améliorations

### Fonctionnalités Futures (Optionnel)

- 📱 Application mobile (React Native)
- 🔌 Extension navigateur pour auto-fill
- 🤖 Intégration Slack/Teams pour alertes
- 📊 Dashboard analytics avancé
- 🌐 Support multi-langue
- 🔗 Intégration avec 1Password/LastPass (import amélioré)
- 🛡️ Integration Have I Been Pwned API
- 📲 Push notifications

---

## 📞 Support

En cas de problème :
1. Consultez les logs : `docker compose logs -f`
2. Vérifiez [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Créez une issue GitHub avec les détails

**Bonne chance ! 🚀**
