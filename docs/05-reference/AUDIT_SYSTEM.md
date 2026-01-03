# 📊 Système d'Audit SecureVault - Guide Administrateur

Le système d'audit de SecureVault enregistre **toutes les actions** effectuées par les utilisateurs et permet aux administrateurs de suivre l'historique complet.

---

## ✅ Actions Auditées

### **Authentification**
- `login` - Connexion réussie
- `login_failed` - Tentative de connexion échouée
- `logout` - Déconnexion
- `sso_login` - Connexion via SSO/SAML
- `register` - Inscription d'un nouveau compte
- `password_change` - Changement de mot de passe
- `mfa_enabled` - Activation MFA
- `mfa_disabled` - Désactivation MFA

### **Gestion des Secrets**
- `secret_created` - Création d'un secret
- `secret_viewed` - Consultation d'un secret
- `secret_updated` - Modification d'un secret
- `secret_deleted` - Suppression d'un secret
- `secret_shared` - Partage d'un secret
- `secret_unshared` - Révocation d'un partage
- `secret_rotated` - Rotation automatique

### **Administration**
- `user_created` - Création d'utilisateur
- `user_updated` - Modification d'utilisateur
- `user_deleted` - Suppression d'utilisateur
- `role_changed` - Changement de rôle
- `settings_changed` - Modification des paramètres

---

## 🔍 APIs Disponibles

### **1. GET /api/audit/admin/logs**

Récupérer les logs d'audit avec filtres avancés

**Paramètres** :
```
?userId=123
&action=login
&resourceType=secret
&dateFrom=2025-01-01
&dateTo=2025-01-31
&riskLevel=high
&ipAddress=192.168.1.1
&search=john
&limit=100
&offset=0
```

**Réponse** :
```json
{
  "logs": [
    {
      "id": 1234,
      "user_id": 5,
      "username": "john.doe",
      "email": "john@example.com",
      "action": "secret_viewed",
      "resource": "secret",
      "details": {"secret_id": 42, "secret_name": "prod-db-password"},
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "risk_level": "medium",
      "created_at": "2025-12-29T20:00:00Z"
    }
  ],
  "total": 1543,
  "limit": 100,
  "offset": 0
}
```

### **2. GET /api/audit/admin/stats**

Obtenir des statistiques et analytics

**Paramètres** :
```
?days=30
```

**Réponse** :
```json
{
  "period": "30 days",
  "actionStats": [
    {"action": "login", "count": 1245},
    {"action": "secret_viewed", "count": 843}
  ],
  "activeUsers": [
    {"username": "john.doe", "email": "john@...", "action_count": 352}
  ],
  "timeline": [
    {"date": "2025-12-29", "count": 45}
  ],
  "riskDistribution": [
    {"risk_level": "low", "count": 800},
    {"risk_level": "high", "count": 12}
  ],
  "suspiciousActivity": {
    "failedLogins": [
      {"ip_address": "45.123.45.67", "attempts": 15, "last_attempt": "..."}
    ]
  }
}
```

### **3. GET /api/audit/admin/user/:userId**

Historique complet d'un utilisateur spécifique

**Exemple** :
```bash
GET /api/audit/admin/user/5?limit=50&offset=0
```

### **4. GET /api/audit/admin/actions**

Liste de tous les types d'actions disponibles

**Réponse** :
```json
{
  "actions": [
    {"action": "login", "count": 1245},
    {"action": "secret_viewed", "count": 843}
  ]
}
```

### **5. GET /api/audit/admin/export**

Exporter les logs en CSV

**Exemple** :
```bash
GET /api/audit/admin/export?dateFrom=2025-01-01&dateTo=2025-01-31
```

**Télécharge** : `audit-logs-1735497600000.csv`

### **6. DELETE /api/audit/admin/cleanup**

Nettoyer les vieux logs (rétention de données)

**Body** :
```json
{
  "retentionDays": 90
}
```

**Réponse** :
```json
{
  "success": true,
  "deletedCount": 5432,
  "message": "Deleted audit logs older than 90 days"
}
```

---

## 🎯 Cas d'Usage

### **1. Enquête sur une activité suspecte**

```bash
# Voir tous les accès à un secret sensible
GET /api/audit/admin/logs?resource=secret&search=prod-db-password

# Traquer les tentatives de connexion échouées d'une IP
GET /api/audit/admin/logs?action=login_failed&ipAddress=45.123.45.67
```

### **2. Audit de conformité**

```bash
# Exporter tous les logs du mois dernier
GET /api/audit/admin/export?dateFrom=2025-12-01&dateTo=2025-12-31

# Vérifier qui a accédé à des secrets critiques
GET /api/audit/admin/logs?action=secret_viewed&riskLevel=high
```

### **3. Analyse d'utilisation**

```bash
# Statistiques des 90 derniers jours
GET /api/audit/admin/stats?days=90

# Utilisateurs les plus actifs
# (inclus dans les stats)
```

### **4. Suivi d'un utilisateur spécifique**

```bash
# Toutes les actions de john.doe
GET /api/audit/admin/user/5

# Recherche par nom
GET /api/audit/admin/logs?search=john.doe
```

---

## 🔐 Sécurité & Permissions

### **Qui peut accéder aux logs d'audit ?**

- ✅ **Administrateurs** : Accès complet (`/api/audit/admin/*`)
- ✅ **Utilisateurs** : Leur propre historique (`/api/audit`)
- ❌ **Autres rôles** : Pas d'accès

### **Niveaux de risque**

Les actions sont automatiquement classifiées :

| Niveau | Description | Exemples |
|--------|-------------|----------|
| `low` | Actions normales | login, secret_viewed |
| `medium` | Actions sensibles | secret_created, secret_shared |
| `high` | Actions critiques | secret_deleted, user_deleted |
| `critical` | Alertes sécurité | login_failed (répété), unusual_activity |

### **Détection d'anomalies**

Le système détecte automatiquement :
- ✅ Tentatives de connexion échouées répétées (>3 en 5 min)
- ✅ Connexions depuis des IPs inhabituelles
- ✅ Accès en masse à des secrets
- ✅ Modifications en dehors des heures de travail

---

## 📱 Dashboard Admin

Le composant React `AuditDashboard` offre :

- 📊 **Statistiques visuelles** (30 jours)
- 🔍 **Filtres avancés** (par utilisateur, action, date, risque)
- 📥 **Export CSV** pour analyses externes
- 🚨 **Alertes** sur activités suspectes
- 📄 **Pagination** des logs

### **Intégration dans votre app**

```jsx
import AuditDashboard from './components/AuditDashboard';

// Dans votre router
<Route path="/admin/audit" element={<AuditDashboard />} />
```

---

## 🛠️ Configuration

### **Rétention des logs**

Par défaut, les logs sont conservés indéfiniment. Pour nettoyer :

```sql
-- Manuellement via SQL
DELETE FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Ou via API
DELETE /api/audit/admin/cleanup
Body: {"retentionDays": 90}
```

### **Alertes automatiques**

Configurez les alertes dans `backend/src/services/emailService.js` :

```javascript
// Envoyer un email si >5 tentatives échouées
if (failedLoginCount > 5) {
  await sendSecurityAlert(user.email, 'Multiple failed login attempts');
}
```

---

## 📈 Métriques & KPIs

### **Views SQL prédéfinies**

```sql
-- Secrets par utilisateur
SELECT * FROM secrets_per_user;

-- Secrets partagés (résumé)
SELECT * FROM shared_secrets_summary;

-- Activité des 30 derniers jours
SELECT * FROM recent_activity LIMIT 100;
```

### **Exemples de requêtes Analytics**

```sql
-- Actions les plus fréquentes
SELECT action, COUNT(*) as count
FROM audit_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY action
ORDER BY count DESC;

-- Heures de pointe
SELECT EXTRACT(HOUR FROM created_at) as hour, COUNT(*) as activity
FROM audit_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY hour
ORDER BY hour;

-- Utilisateurs inactifs
SELECT u.username, MAX(al.created_at) as last_activity
FROM users u
LEFT JOIN audit_logs al ON u.id = al.user_id
GROUP BY u.id, u.username
HAVING MAX(al.created_at) < NOW() - INTERVAL '30 days'
  OR MAX(al.created_at) IS NULL;
```

---

## 🔗 Intégrations SIEM

Pour exporter vers des outils de sécurité externes (Splunk, ELK, etc.) :

### **Option 1 : Export périodique CSV**

```bash
# Cron job quotidien
0 2 * * * curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "$API_URL/audit/admin/export?dateFrom=$(date -d '1 day ago' +%Y-%m-%d)" \
  -o "/backup/audit-$(date +%Y%m%d).csv"
```

### **Option 2 : Webhook (à implémenter)**

Envoyer chaque log vers un endpoint externe en temps réel.

### **Option 3 : Base de données partagée**

Répliquer `audit_logs` vers une DB centralisée.

---

## ✅ Checklist de Conformité

- [ ] Logs activés pour toutes les actions sensibles
- [ ] Rétention configurée selon la réglementation (GDPR: min 6 mois)
- [ ] Accès aux logs restreint aux administrateurs
- [ ] Exports périodiques pour archivage
- [ ] Alertes configurées pour activités suspectes
- [ ] Dashboard de monitoring accessible
- [ ] Documentation partagée avec l'équipe sécurité

---

## 📚 Ressources

- [FEATURES_ROADMAP.md](./FEATURES_ROADMAP.md) - Vue d'ensemble des features
- [RBAC_GUIDE.md](./RBAC_GUIDE.md) - Gestion des rôles et permissions
- Migration SQL : `backend/migrations/001_add_features.sql`

---

**🔐 L'audit est essentiel pour la sécurité et la conformité. Surveillez régulièrement !**
