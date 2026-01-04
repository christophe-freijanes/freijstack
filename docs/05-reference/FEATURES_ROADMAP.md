# 🚀 SecureVault - Features Roadmap

Implémentation des 10 fonctionnalités les plus demandées pour SecureVault.

---

## ✅ Statut d'Implémentation

| # | Feature | Status | Priorité | Complexité |
|---|---------|--------|----------|------------|
| 1 | MFA/2FA (TOTP) | 🟡 Base créée | 🔴 Critique | ⭐⭐⭐ |
| 2 | RBAC (Rôles) | 🟡 Base créée | 🔴 Critique | ⭐⭐⭐⭐ |
| 3 | Partage de secrets | 🟡 Base créée | 🟠 Haute | ⭐⭐⭐ |
| 4 | Rotation automatique | 🟡 Base créée | 🟠 Haute | ⭐⭐⭐⭐ |
| 5 | Générateur de passwords | 🟡 Base créée | 🟢 Moyenne | ⭐ |
| 6 | Tags et catégories | 🟡 Base créée | 🟢 Moyenne | ⭐⭐ |
| 7 | Recherche avancée | 🟡 Base créée | 🟢 Moyenne | ⭐⭐ |
| 8 | API Tokens | 🟡 Base créée | 🟠 Haute | ⭐⭐⭐ |
| 9 | Alertes sécurité | 🟡 Base créée | 🟢 Moyenne | ⭐⭐ |
| 10 | Import/Export | 🟡 Base créée | 🟢 Moyenne | ⭐⭐ |

**Légende** :
- 🟢 Complet
- 🟡 Base créée / En cours
- 🔴 À faire

---

## 📦 Dépendances Ajoutées

```json
{
  "speakeasy": "^2.0.0",      // MFA/TOTP
  "qrcode": "^1.5.3",          // QR codes pour MFA
  "nodemailer": "^6.9.8",      // Alertes email
  "uuid": "^9.0.1"             // API tokens
}
```

---

## 🗄️ Migrations Base de Données Requises

### 1. MFA/2FA

```sql
-- Ajouter colonnes MFA aux utilisateurs
ALTER TABLE users ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN mfa_secret VARCHAR(255);
ALTER TABLE users ADD COLUMN backup_codes TEXT[]; -- Codes de récupération
```

### 2. RBAC

```sql
-- Table des rôles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rôles par défaut
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'Administrateur complet', '{"secrets": ["read", "write", "delete", "share"], "users": ["read", "write", "delete"], "settings": ["read", "write"]}'),
('manager', 'Gestionnaire d''équipe', '{"secrets": ["read", "write", "share"], "users": ["read"]}'),
('user', 'Utilisateur standard', '{"secrets": ["read", "write"]}'),
('viewer', 'Lecture seule', '{"secrets": ["read"]}');

-- Assigner rôle aux utilisateurs
ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES roles(id) DEFAULT 3;
```

### 3. Partage de secrets

```sql
CREATE TABLE secret_shares (
  id SERIAL PRIMARY KEY,
  secret_id INTEGER REFERENCES secrets(id) ON DELETE CASCADE,
  shared_by INTEGER REFERENCES users(id),
  shared_with INTEGER REFERENCES users(id),
  permission VARCHAR(20) CHECK (permission IN ('read', 'write')),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_secret_shares_secret ON secret_shares(secret_id);
CREATE INDEX idx_secret_shares_user ON secret_shares(shared_with);
```

### 4. Rotation des secrets

```sql
ALTER TABLE secrets ADD COLUMN rotation_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE secrets ADD COLUMN rotation_interval INTEGER; -- jours
ALTER TABLE secrets ADD COLUMN next_rotation TIMESTAMP;
ALTER TABLE secrets ADD COLUMN last_rotated TIMESTAMP;

-- Historique des rotations
CREATE TABLE secret_versions (
  id SERIAL PRIMARY KEY,
  secret_id INTEGER REFERENCES secrets(id) ON DELETE CASCADE,
  value_encrypted TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  rotated_by INTEGER REFERENCES users(id)
);
```

### 5. Tags

```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7), -- HEX color
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, user_id)
);

CREATE TABLE secret_tags (
  secret_id INTEGER REFERENCES secrets(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (secret_id, tag_id)
);
```

### 6. API Tokens

```sql
CREATE TABLE api_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  scopes JSONB NOT NULL, -- ["secrets:read", "secrets:write"]
  expires_at TIMESTAMP,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_tokens_hash ON api_tokens(token_hash);
CREATE INDEX idx_api_tokens_user ON api_tokens(user_id);
```

### 7. Alertes

```sql
CREATE TABLE alert_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_on_login BOOLEAN DEFAULT TRUE,
  email_on_secret_access BOOLEAN DEFAULT FALSE,
  email_on_failed_login BOOLEAN DEFAULT TRUE,
  unusual_activity_detection BOOLEAN DEFAULT TRUE
);

CREATE TABLE security_alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT,
  metadata JSONB,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 Script de Migration Complet

Exécuter ce script pour créer toutes les tables :

```bash
# Sur le VPS
docker compose exec postgres psql -U postgres -d securevault < migrations/add_features.sql
```

---

## 📁 Structure des Fichiers Créés

```
backend/src/
├── routes/
│   ├── mfa.js          # Routes MFA/2FA
│   ├── roles.js        # Gestion des rôles
│   ├── shares.js       # Partage de secrets
│   ├── rotation.js     # Rotation automatique
│   ├── generator.js    # Générateur de passwords
│   ├── tags.js         # Tags et catégories
│   ├── apiTokens.js    # API tokens
│   └── alerts.js       # Alertes sécurité
├── services/
│   ├── emailService.js # Envoi d'emails
│   ├── mfaService.js   # Logique MFA
│   ├── rbacService.js  # Vérification permissions
│   └── rotationService.js # Cron rotation
└── middleware/
    ├── checkPermission.js # Middleware RBAC
    └── apiTokenAuth.js    # Auth par API token

frontend/src/components/
├── MfaSetup.js
├── PasswordGenerator.js
├── SecretSharing.js
└── TagManager.js
```

---

## 🚀 Prochaines Étapes

1. **Appliquer les migrations** sur la base de données
2. **Installer les nouvelles dépendances** : `npm install` dans backend/
3. **Tester chaque feature** individuellement
4. **Configurer SMTP** pour les alertes email (voir `.env`)
5. **Documenter l'utilisation** de chaque feature

---

## 📖 Documentation Détaillée

- [MFA/2FA Setup](./MFA_SETUP.md)
- [RBAC Guide](./RBAC_GUIDE.md)
- [Secret Sharing](./SHARING_GUIDE.md)
- [API Tokens](./API_TOKENS.md)

---

## ⚠️ Notes Importantes

- Ces features sont des **bases fonctionnelles** à enrichir
- Les tests unitaires sont à ajouter
- L'interface frontend nécessite du design
- La documentation utilisateur est à créer

**Voulez-vous que je développe une feature spécifique en détail ?** 🎯
