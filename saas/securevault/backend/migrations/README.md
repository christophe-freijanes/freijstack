# 🗄️ SecureVault Database Migrations

Ce dossier contient les migrations de base de données pour SecureVault.

---

## 📋 Liste des Migrations

### **001_add_features.sql** (Version 1.5)
**Fonctionnalités de base avancées**

Tables créées :
- `roles` - Rôles RBAC (Admin, Manager, User, Viewer)
- `user_roles` - Association utilisateurs ↔ rôles
- `role_permissions` - Permissions granulaires
- `tags` - Tags pour organisation
- `secret_tags` - Association secrets ↔ tags
- `secret_shares` - Partage de secrets
- `secret_versions` - Versioning des secrets
- `api_tokens` - Tokens API pour automatisation
- `security_alerts` - Alertes sécurité

Colonnes ajoutées à `users` :
- `mfa_enabled`, `mfa_secret`, `backup_codes` - Authentification multi-facteurs

Vues créées :
- `recent_activity` - Activité récente
- `secrets_per_user` - Secrets par utilisateur
- `shared_secrets_summary` - Résumé des partages

---

### **002_pro_features.sql** (Version 2.0 - Professional)
**Fonctionnalités professionnelles inspirées de RoboForm + KeePass + Vault**

Tables créées :
- `folders` - Organisation hiérarchique (comme RoboForm)
- `secret_types` - 9 types de secrets avec templates
- `secret_history` - Historique complet (comme KeePass)
- `custom_field_templates` - Templates de champs réutilisables
- `imports` - Tracking des imports
- `quick_access` - Accès rapide (pinned items)
- `password_health` - Monitoring qualité mots de passe
- `collections` - Vaults partagés (comme HashiCorp Vault)
- `collection_members` - Membres des collections
- `collection_secrets` - Secrets dans collections

Colonnes ajoutées à `secrets` :
- `folder_id` - Dossier parent
- `type` - Type de secret (login, card, server, etc.)
- `description` - Description riche
- `url`, `username` - Champs communs
- `notes` - Notes privées
- `custom_fields` - Champs personnalisés (JSONB)
- `is_favorite` - Favoris
- `last_accessed_at`, `access_count` - Statistiques
- `strength_score` - Score de force (0-100)
- `expires_at` - Date d'expiration
- `auto_rotate`, `rotation_interval_days` - Rotation auto

9 Types de secrets prédéfinis :
1. **Login** - Identifiant + mot de passe + 2FA
2. **Secure Note** - Note sécurisée
3. **Credit Card** - Carte bancaire
4. **Identity** - Identité (nom, email, adresse, SSN)
5. **Server** - Serveur SSH/RDP/VNC
6. **Database** - Connexion DB (PostgreSQL, MySQL, MongoDB, etc.)
7. **API Key** - Clé API + secret
8. **SSH Key** - Clé SSH privée/publique
9. **Document** - Document texte sécurisé

Vues créées :
- `most_used_secrets` - Secrets les plus consultés
- `password_health_summary` - Résumé santé des mots de passe
- `folder_tree` - Arborescence complète des dossiers

Triggers créés :
- `track_secret_changes()` - Historique automatique des modifications
- `update_folder_timestamp()` - MAJ timestamp dossiers

---

## 🚀 Exécution Automatique (GitHub Actions)

Les migrations sont **automatiquement exécutées** à chaque déploiement via le workflow `.github/workflows/securevault-deploy.yml`.

Le workflow :
1. ✅ Vérifie que PostgreSQL est prêt
2. 🔍 Détecte les migrations déjà appliquées (via tables indicatrices)
3. ▶️ Applique uniquement les nouvelles migrations
4. 📊 Affiche un résumé du schéma
5. 🔄 Redémarre le backend

**Sécurité** : Les migrations sont idempotentes (peuvent être exécutées plusieurs fois sans erreur).

---

## 🖥️ Exécution Manuelle

### Sur le VPS directement

```bash
# Copier le script sur le VPS
scp scripts/run-migrations.sh user@vps:/tmp/

# Se connecter au VPS
ssh user@vps

# Exécuter les migrations pour staging
chmod +x /tmp/run-migrations.sh
/tmp/run-migrations.sh staging

# Ou pour production
/tmp/run-migrations.sh production
```

### Via Docker Compose (sur le VPS)

```bash
# Se placer dans le répertoire de déploiement
cd /srv/www/securevault/saas/securevault

# Exécuter migration 002
docker compose exec -T postgres psql -U postgres -d securevault < backend/migrations/002_pro_features.sql

# Vérifier le résultat
docker compose exec postgres psql -U postgres -d securevault -c "\dt"

# Redémarrer le backend
docker compose restart backend
```

---

## 📝 Créer une Nouvelle Migration

### 1. Créer le fichier

```bash
# Numéro séquentiel (003, 004, etc.)
touch backend/migrations/003_feature_name.sql
```

### 2. Structure recommandée

```sql
-- Migration 003: Description de la feature
-- Date: 2025-XX-XX

-- ============================================================================
-- 1. TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS my_new_table (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_my_table_user ON my_new_table(user_id);

-- ============================================================================
-- 2. COLUMNS (ALTER TABLE)
-- ============================================================================

ALTER TABLE secrets 
    ADD COLUMN IF NOT EXISTS my_new_field TEXT;

-- ============================================================================
-- 3. VIEWS
-- ============================================================================

CREATE OR REPLACE VIEW my_view AS
SELECT ... FROM ...;

-- ============================================================================
-- 4. TRIGGERS/FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION my_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Logic here
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. DATA (INSERT/UPDATE)
-- ============================================================================

INSERT INTO my_table (field) VALUES ('value')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE my_new_table IS 'Description de la table';
```

### 3. Tester localement

```bash
# Avec Docker Compose local
docker compose exec -T postgres psql -U postgres -d securevault < backend/migrations/003_feature_name.sql

# Vérifier
docker compose exec postgres psql -U postgres -d securevault -c "\dt"
```

### 4. Ajouter au script de migration

Éditer `scripts/run-migrations.sh` :

```bash
# Migration 003: Ma nouvelle feature
run_migration "backend/migrations/003_feature_name.sql" "my_new_table"
```

### 5. Mettre à jour le workflow

Le workflow détecte automatiquement les nouveaux fichiers, mais vous pouvez ajouter une vérification explicite dans `.github/workflows/securevault-deploy.yml` si besoin.

---

## 🔍 Vérifier l'État des Migrations

### Lister toutes les tables

```bash
docker compose exec postgres psql -U postgres -d securevault -c "\dt"
```

### Lister toutes les vues

```bash
docker compose exec postgres psql -U postgres -d securevault -c "\dv"
```

### Vérifier une table spécifique

```bash
docker compose exec postgres psql -U postgres -d securevault -c "\d folders"
```

### Compter les données

```bash
docker compose exec postgres psql -U postgres -d securevault -c "
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

---

## 🔄 Rollback (Annuler une Migration)

**⚠️ Attention** : Les rollbacks doivent être testés avant production !

### Créer un fichier de rollback

```sql
-- Rollback 002_pro_features.sql
-- DESTRUCTIF : Supprime toutes les données des tables créées

-- Supprimer les triggers
DROP TRIGGER IF EXISTS secret_changes_history ON secrets;
DROP TRIGGER IF EXISTS folders_updated_at ON folders;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS track_secret_changes();
DROP FUNCTION IF EXISTS update_folder_timestamp();

-- Supprimer les vues
DROP VIEW IF EXISTS most_used_secrets;
DROP VIEW IF EXISTS password_health_summary;
DROP VIEW IF EXISTS folder_tree;

-- Supprimer les tables (ordre inverse des dépendances)
DROP TABLE IF EXISTS collection_secrets;
DROP TABLE IF EXISTS collection_members;
DROP TABLE IF EXISTS collections;
DROP TABLE IF EXISTS password_health;
DROP TABLE IF EXISTS quick_access;
DROP TABLE IF EXISTS imports;
DROP TABLE IF EXISTS custom_field_templates;
DROP TABLE IF EXISTS secret_history;
DROP TABLE IF EXISTS secret_types;
DROP TABLE IF EXISTS folders;

-- Supprimer les colonnes ajoutées
ALTER TABLE secrets 
    DROP COLUMN IF EXISTS folder_id,
    DROP COLUMN IF EXISTS type,
    DROP COLUMN IF EXISTS description,
    -- etc.
```

### Exécuter le rollback

```bash
docker compose exec -T postgres psql -U postgres -d securevault < backend/migrations/rollback_002.sql
```

---

## 🆘 Dépannage

### Migration échoue avec "relation already exists"

✅ **Normal** : La migration utilise `CREATE TABLE IF NOT EXISTS`, elle est idempotente.

### "ERROR: column already exists"

✅ **Normal** : La migration utilise `ADD COLUMN IF NOT EXISTS`, elle est idempotente.

### "FATAL: database does not exist"

```bash
# Créer la base de données
docker compose exec postgres psql -U postgres -c "CREATE DATABASE securevault;"
```

### PostgreSQL ne répond pas

```bash
# Vérifier les logs
docker compose logs postgres

# Redémarrer
docker compose restart postgres

# Attendre qu'il soit prêt
docker compose exec postgres pg_isready -U postgres
```

### Migration bloquée/timeout

```bash
# Vérifier les connexions actives
docker compose exec postgres psql -U postgres -d securevault -c "
SELECT pid, usename, application_name, state, query 
FROM pg_stat_activity 
WHERE datname = 'securevault';
"

# Tuer une connexion bloquante (si nécessaire)
docker compose exec postgres psql -U postgres -c "SELECT pg_terminate_backend(PID);"
```

---

## 📚 Ressources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Migrations Best Practices](https://www.postgresql.org/docs/current/ddl-schemas.html)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

**🗄️ Gardez vos migrations versionnées et testées !**
