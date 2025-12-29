# 🔄 Secret Rotation - SecureVault

Guide d'automatisation de la rotation des secrets (JWT_SECRET, ENCRYPTION_KEY, DB_PASSWORD).

---

## 🎯 Stratégie de Rotation

| Secret | Fréquence | Impact | Automatisé |
|--------|-----------|--------|-----------|
| **DB_PASSWORD** | 6 mois | Modéré | ✅ Oui |
| **JWT_SECRET** | Annuellement | Élevé (re-login) | ✅ Oui |
| **ENCRYPTION_KEY** | Annuellement | Élevé (perte accès) | ⚠️ Manuel |

---

## 🤖 GitHub Actions - Automatisation

### 1️⃣ Rotation Automatique Mensuelle (DB_PASSWORD)

**Déclenché automatiquement**: 1er du mois à 2 AM UTC

Fichier: `.github/workflows/rotate-secrets.yml`

```yaml
on:
  schedule:
    - cron: '0 2 1 * *'  # 1st of month, 2 AM UTC
```

### 2️⃣ Rotation Manuelle (Tous les secrets)

Allez à **Actions → Rotate Secrets → Run workflow**:
- Choisir l'environnement (staging/production)
- Choisir le type de secret (db_password/all)

---

## 📋 Processus de Rotation

### Étape 1: Sauvegarde
```bash
/srv/www/securevault/backups/.env.backup.20250129_020000
```

### Étape 2: Génération de nouveaux secrets
- DB_PASSWORD: 24 caractères aléatoires
- JWT_SECRET: 44 caractères Base64
- ENCRYPTION_KEY: 64 caractères hexadécimaux

### Étape 3: Mise à jour .env

Fichier .env mis à jour sur le VPS avec nouveaux secrets

### Étape 4: Redémarrage
```bash
docker-compose restart backend
```

### Étape 5: Vérification
Vérifier que les conteneurs démarrent correctement

---

## ⚠️ Impacts par Secret

### DB_PASSWORD
- ✅ **Impact faible**: Changeable sans impact utilisateur
- ✅ **Fréquence**: Tous les 6 mois (recommandé)
- ✅ **Utilisateurs affectés**: Aucun

### JWT_SECRET
- ⚠️ **Impact élevé**: Invalide tous les tokens existants
- 🚨 **Conséquence**: Les utilisateurs doivent se reconnecter
- ✅ **Fréquence**: Annuellement ou si compromis
- 📅 **Timing**: Planifier en heures creuses

### ENCRYPTION_KEY
- 🚨 **Impact très élevé**: Perte accès aux secrets chiffrés
- ❌ **Changement difficile**: Requiert re-chiffrement de tous les secrets
- ✅ **Fréquence**: Annuellement ou si compromis
- ⚠️ **Approche**: Requiert logique de re-chiffrement dans le code

---

## 🚀 Utilisation

### Rotation Automatique (Défaut)

**Rien à faire** - la pipeline s'exécute automatiquement le 1er du mois:

```
1er janvier → Rotation DB_PASSWORD
1er février → Rotation DB_PASSWORD
...
```

### Rotation Manuelle

#### Via GitHub UI

1. Aller à **Actions → Rotate Secrets**
2. Cliquer **Run workflow**
3. Configurer:
   - Environment: `staging` ou `production`
   - Secret type: `db_password` ou `all`
4. Cliquer **Run workflow**

#### Via CLI

```bash
# Trigger workflow via GitHub CLI
gh workflow run rotate-secrets.yml \
  -f environment=production \
  -f secret_type=db_password
```

#### Via Script Local

```bash
# SSH vers le VPS
ssh user@vps

# Exécuter le script
bash /srv/www/securevault/scripts/rotate-secrets.sh production
```

---

## 🛡️ Sécurité

### Avant la Rotation
- ✅ Backup automatique créé
- ✅ Notification des changements
- ✅ Logs d'audit

### Après la Rotation
- ✅ Vérification que les conteneurs démarrent
- ✅ Backup conservé 30 jours
- ✅ Possibilité de rollback

### En Cas de Problème
```bash
# Restaurer depuis backup
cp /srv/www/securevault/backups/.env.backup.XXXXX \
   /srv/www/securevault/saas/securevault/.env

# Redémarrer
docker-compose restart backend
```

---

## 📊 Exemple: Rotation DB_PASSWORD

### Avant
```env
DB_PASSWORD=OnLndE6D2vTunnl*S$&PIuPN
```

### Workflow Trigger
```
GitHub Actions → rotate-secrets.yml
Environment: staging
Type: db_password
```

### Pendant
```
1. Backup created
2. New password: g8K#pL2@mN9xQ$rT5vW
3. .env updated
4. Docker restart
5. Verification OK
```

### Après
```env
DB_PASSWORD=g8K#pL2@mN9xQ$rT5vW
```

✅ **Utilisateurs affectés**: Aucun (password PostgreSQL changé)

---

## 🔐 Calendrier Recommandé

```
Jan 1   → DB_PASSWORD rotation (auto)
Feb 1   → DB_PASSWORD rotation (auto)
...
Dec 1   → DB_PASSWORD rotation (auto)
Dec 15  → JWT_SECRET rotation (manual)
Dec 20  → ENCRYPTION_KEY rotation (manual) - ⚠️ Complex
```

---

## 🚨 Incident Response

### Si DB_PASSWORD Leaked
```bash
# Rotation immédiate
Trigger: github.com/actions → rotate-secrets
Type: db_password
Environment: production
```

### Si JWT_SECRET Leaked
```bash
# 1. Rotation immédiate
Trigger: github.com/actions → rotate-secrets
Type: all (ou jwt_secret seul si possible)
Environment: production

# 2. Notification utilisateurs
# Les utilisateurs doivent se reconnecter
```

### Si ENCRYPTION_KEY Leaked
```bash
# 🚨 URGENT - Très complexe
# 1. Arrêter l'application
# 2. Re-chiffrer tous les secrets existants
# 3. Déployer la nouvelle clé
# 4. Redémarrer

# Contactez un administrateur système!
```

---

## 📈 Monitoring

### Logs de Rotation

Vérifier les logs GitHub Actions:
```
GitHub → Actions → Rotate Secrets → [Run ID]
```

### Vérification Manuelle

```bash
# SSH vers le VPS
ssh user@vps

# Vérifier le backup
ls -lh /srv/www/securevault/backups/

# Vérifier les logs
docker-compose logs backend | tail -20
```

### Alertes

La pipeline envoie une notification en cas d'échec:
- ❌ Containers ne démarrent pas
- ❌ Rotation échouée
- ❌ Backup corrompu

---

## ✅ Checklist Post-Rotation

- [ ] Workflow exécuté avec succès
- [ ] Backup créé et vérifié
- [ ] Containers redémarrés (`docker ps`)
- [ ] Application accessible
- [ ] Logs vérifiés (aucune erreur)
- [ ] Secrets mis à jour dans `.env`

---

## 📞 Support

Si la rotation échoue:

1. **Vérifier les logs** GitHub Actions
2. **SSH sur le VPS** et vérifier manuellement
3. **Restaurer depuis backup** si nécessaire
4. **Signaler l'incident** en priorité

---

**Créé par**: Christophe FREIJANES  
**Date**: Décembre 2025  
**Status**: ✅ Automatisée
