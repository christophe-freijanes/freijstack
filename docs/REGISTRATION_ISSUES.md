# 🔧 SecureVault - Résolution des Problèmes d'Enregistrement

## 🚨 Symptômes Courants

- ❌ "Impossible de créer un compte"
- ❌ Le bouton Register ne répond pas
- ❌ Erreur 404 ou 500 dans la console
- ❌ "Network Error" dans le navigateur
- ❌ Le formulaire ne se soumet pas

---

## 🔍 Diagnostic Automatique

```bash
# Exécuter le script de diagnostic
chmod +x scripts/diagnose-registration.sh

# Pour staging
./scripts/diagnose-registration.sh staging

# Pour production
./scripts/diagnose-registration.sh production
```

Le script vérifie automatiquement :
- ✅ Backend accessible
- ✅ CORS configuré correctement
- ✅ Endpoint /api/auth/register fonctionne
- ✅ Base de données connectée
- ✅ Table users existe
- ✅ Variables d'environnement configurées

---

## 🛠️ Solutions Rapides

### Solution 1 : Redémarrer le Backend

```bash
# Sur le VPS
ssh user@vps
cd /srv/www/securevault-staging/saas/securevault

# Redémarrer
docker compose restart backend

# Vérifier que c'est démarré
docker compose ps
docker compose logs -f backend
```

### Solution 2 : Vérifier et Appliquer les Migrations

```bash
# Vérifier si la table users existe
docker compose exec postgres psql -U postgres -d securevault -c "\dt"

# Si la table users n'existe PAS, appliquer les migrations
docker compose exec -T postgres psql -U postgres -d securevault < backend/migrations/001_add_features.sql

# Vérifier à nouveau
docker compose exec postgres psql -U postgres -d securevault -c "\d users"
```

### Solution 3 : Corriger CORS

Si vous voyez "CORS policy" dans les erreurs du navigateur :

```bash
# Vérifier la config CORS
cd /srv/www/securevault-staging/saas/securevault
grep -A 20 "CORS Configuration" backend/src/server.js

# Vérifier FRONTEND_URL
grep FRONTEND_URL .env

# Si absent, ajouter
echo "FRONTEND_URL=https://vault-staging.freijstack.com" >> .env

# Redémarrer
docker compose restart backend
```

### Solution 4 : Vérifier les Variables d'Environnement

```bash
# Sur le VPS
cd /srv/www/securevault-staging/saas/securevault

# Vérifier que toutes les variables critiques sont définies
for var in POSTGRES_PASSWORD JWT_SECRET ENCRYPTION_KEY FRONTEND_URL DB_HOST; do
  if grep -q "^${var}=" .env; then
    echo "✓ $var is set"
  else
    echo "✗ $var is MISSING"
  fi
done

# Si des variables manquent, copier depuis le template VPS
if [ ! -f .env ]; then
  # Utiliser les valeurs du fichier VPS
  source /srv/www/securevault-staging/.env
  # Ou copier le template
  cp .env.staging .env
fi

# Redémarrer
docker compose restart backend
```

---

## 📋 Checklist de Dépannage

Cochez chaque élément :

### Backend
- [ ] Container backend est "Up" : `docker compose ps`
- [ ] Backend répond à /health : `curl https://vault-api-staging.freijstack.com/health`
- [ ] Logs backend sans erreur : `docker compose logs backend | grep -i error`
- [ ] Port 3001 écoute : `docker compose exec backend netstat -tulpn | grep 3001`

### Database
- [ ] Container postgres est "Up" : `docker compose ps postgres`
- [ ] Base securevault existe : `docker compose exec postgres psql -U postgres -l | grep securevault`
- [ ] Table users existe : `docker compose exec postgres psql -U postgres -d securevault -c "\dt" | grep users`
- [ ] Peut créer un user test : (voir test SQL ci-dessous)

### CORS
- [ ] OPTIONS retourne 204/200 : `curl -X OPTIONS https://vault-api.../api/auth/register`
- [ ] Headers CORS présents : (voir test curl ci-dessous)
- [ ] FRONTEND_URL dans .env correspond au domaine frontend
- [ ] Pas de blocage par ad-blocker/extension navigateur

### Frontend
- [ ] Frontend accessible : `curl https://vault-staging.freijstack.com`
- [ ] Fichier index.html charge : (vérifier dans DevTools)
- [ ] Variables React configurées : (vérifier REACT_APP_API_URL)
- [ ] Console navigateur sans erreur : (ouvrir DevTools → Console)

---

## 🔬 Tests Manuels Détaillés

### Test 1 : Backend Health

```bash
curl https://vault-api-staging.freijstack.com/health
```

**Résultat attendu** :
```json
{"status":"healthy","timestamp":"2024-12-29T...","service":"securevault-backend"}
```

### Test 2 : CORS Preflight

```bash
curl -v -X OPTIONS https://vault-api-staging.freijstack.com/api/auth/register \
  -H "Origin: https://vault-staging.freijstack.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

**Résultat attendu** :
```
< HTTP/2 204
< access-control-allow-origin: https://vault-staging.freijstack.com
< access-control-allow-methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
< access-control-allow-credentials: true
```

### Test 3 : Registration Endpoint

```bash
curl -v -X POST https://vault-api-staging.freijstack.com/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: https://vault-staging.freijstack.com" \
  -d '{
    "username": "testuser123",
    "email": "test123@example.com",
    "password": "TestPass123!"
  }'
```

**Résultats possibles** :

✅ **HTTP 201** : Succès, user créé
```json
{"user":{"id":1,"username":"testuser123","email":"test123@example.com"},"token":"eyJhbGc..."}
```

⚠️ **HTTP 400** : Erreur de validation
```json
{"error":"Password must contain uppercase, lowercase, number and special character"}
```

⚠️ **HTTP 409** : User existe déjà
```json
{"error":"Username or email already exists"}
```

❌ **HTTP 500** : Erreur serveur (problème DB ou code)
```json
{"error":"Internal server error"}
```

### Test 4 : Database Direct

```bash
# Se connecter à la base
docker compose exec postgres psql -U postgres -d securevault

# Lister les tables
\dt

# Voir la structure de users
\d users

# Compter les users
SELECT COUNT(*) FROM users;

# Tester l'insertion (avec mot de passe hashé)
INSERT INTO users (username, email, password_hash, created_at)
VALUES ('testuser', 'test@example.com', '$2b$12$hash...', NOW())
RETURNING id, username, email;

# Quitter
\q
```

---

## 🚨 Erreurs Spécifiques et Solutions

### Erreur : "relation 'users' does not exist"

**Cause** : Les migrations n'ont pas été appliquées.

**Solution** :
```bash
cd /srv/www/securevault-staging/saas/securevault

# Appliquer migration 001
docker compose exec -T postgres psql -U postgres -d securevault < backend/migrations/001_add_features.sql

# Vérifier
docker compose exec postgres psql -U postgres -d securevault -c "\dt"

# Redémarrer le backend
docker compose restart backend
```

### Erreur : "ECONNREFUSED" ou "Cannot connect to database"

**Cause** : Le backend ne peut pas se connecter à PostgreSQL.

**Solution** :
```bash
# Vérifier que postgres tourne
docker compose ps postgres

# Vérifier les variables DB
grep -E "^(DB_HOST|POSTGRES_PASSWORD|DATABASE_URL)=" .env

# DB_HOST doit être "postgres" (nom du service)
# Si manquant, ajouter :
echo "DB_HOST=postgres" >> .env

# Redémarrer les deux
docker compose restart postgres backend
```

### Erreur : "Password does not meet requirements"

**Cause** : Le mot de passe ne respecte pas les règles.

**Règles** :
- ✅ Minimum 8 caractères
- ✅ Au moins 1 majuscule
- ✅ Au moins 1 minuscule
- ✅ Au moins 1 chiffre
- ✅ Au moins 1 caractère spécial (!@#$%^&*)

**Exemples valides** :
- `SecurePass123!`
- `MyP@ssw0rd`
- `Test1234!`

### Erreur : "CORS policy: No 'Access-Control-Allow-Origin'"

**Cause** : Le backend ne renvoie pas les headers CORS ou l'origine n'est pas autorisée.

**Solution** :

1. Vérifier que CORS est configuré dans server.js :
```bash
cd /srv/www/securevault-staging/saas/securevault
grep -A 30 "CORS Configuration" backend/src/server.js
```

2. Vérifier FRONTEND_URL :
```bash
grep FRONTEND_URL .env
# Doit être : FRONTEND_URL=https://vault-staging.freijstack.com
```

3. Forcer le rebuild du backend :
```bash
docker compose down backend
docker compose up -d --build backend
```

### Erreur : "Network Error" dans le navigateur

**Causes possibles** :
- Ad-blocker bloque la requête
- Extension navigateur interfère
- Problème réseau/DNS

**Solutions** :

1. Désactiver temporairement ad-blocker et extensions
2. Tester dans une fenêtre privée/incognito
3. Vérifier dans DevTools → Network :
   - La requête est-elle envoyée ?
   - Quel est le code HTTP ?
   - Y a-t-il une erreur CORS ?

4. Tester avec curl (voir tests ci-dessus)

---

## 🔄 Procédure Complète de Reset

Si rien ne fonctionne, réinitialisez tout :

```bash
# 1. Se connecter au VPS
ssh user@vps

# 2. Aller dans le dossier
cd /srv/www/securevault-staging

# 3. Pull les dernières modifications
git fetch origin
git reset --hard origin/develop
git clean -fd

# 4. Aller dans le projet
cd saas/securevault

# 5. Arrêter tous les containers
docker compose down

# 6. Vérifier/créer .env depuis le VPS
if [ ! -f .env ]; then
  cp /srv/www/securevault-staging/.env .env
fi

# Vérifier que FRONTEND_URL est correct
grep FRONTEND_URL .env

# 7. Rebuild et redémarrer TOUT
docker compose up -d --build

# 8. Attendre le démarrage (30 secondes)
sleep 30

# 9. Appliquer les migrations
docker compose exec -T postgres psql -U postgres -d securevault < backend/migrations/001_add_features.sql
docker compose exec -T postgres psql -U postgres -d securevault < backend/migrations/002_pro_features.sql

# 10. Redémarrer le backend
docker compose restart backend

# 11. Vérifier les logs
docker compose logs -f backend

# 12. Tester
curl https://vault-api-staging.freijstack.com/health
```

---

## 🎯 Test depuis le Navigateur

1. **Ouvrir DevTools** (F12)
2. **Aller dans l'onglet Console**
3. **Essayer de s'enregistrer**
4. **Observer les erreurs** :

   - ❌ `CORS policy` → Problème CORS (voir solution 3)
   - ❌ `404 Not Found` → Route inexistante
   - ❌ `500 Internal Server Error` → Problème backend/DB
   - ❌ `Network Error` → Backend inaccessible

5. **Aller dans l'onglet Network**
6. **Filtrer par "register"**
7. **Cliquer sur la requête**
8. **Vérifier** :
   - Status code
   - Request headers (Origin, Content-Type)
   - Response headers (Access-Control-Allow-Origin)
   - Response body (message d'erreur)

---

## 📞 Support Avancé

Si le problème persiste après toutes ces étapes :

1. **Collecter les informations** :
```bash
# Logs backend
docker compose logs backend > backend-logs.txt

# Logs postgres
docker compose logs postgres > postgres-logs.txt

# Configuration
cat .env > env-config.txt  # Masquer les secrets avant de partager !
docker compose ps > containers-status.txt

# Tester registration
curl -v -X POST https://vault-api-staging.freijstack.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test123!"}' \
  > registration-test.txt 2>&1
```

2. **Vérifier la stack complète** :
```bash
# Containers actifs
docker compose ps

# Réseaux
docker network ls
docker network inspect securevault_staging_network

# Volumes
docker volume ls
docker volume inspect securevault-staging_postgres_data
```

3. **Tester en isolation** :
```bash
# Tester le backend directement (sans Traefik)
docker compose exec backend curl http://localhost:3001/health

# Tester depuis le VPS
curl http://localhost:3001/health
```

---

## ✅ Validation Finale

Après correction, vérifiez que tout fonctionne :

```bash
# Exécuter le diagnostic
./scripts/diagnose-registration.sh staging

# Tous les checks doivent être ✓ verts

# Tester depuis le navigateur
# 1. Aller sur https://vault-staging.freijstack.com
# 2. Cliquer sur "Register"
# 3. Remplir le formulaire
# 4. Soumettre
# 5. Devrait créer l'utilisateur et vous connecter
```

**Si tout est OK, vous devriez voir** :
- ✅ Redirection vers le dashboard
- ✅ Token dans localStorage
- ✅ User info affichée

🎉 **Enregistrement fonctionnel !**
