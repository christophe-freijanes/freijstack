# 🔧 SecureVault - Guide de Dépannage CORS

## 🚨 Erreur 404 sur OPTIONS

**Symptôme** : Le navigateur affiche une erreur 404 lors d'une requête OPTIONS (preflight CORS).

```
OPTIONS https://vault-api.freijstack.com/api/auth/register
Status: 404
```

### ✅ Solutions

#### 1. Redémarrer le Backend (Solution Rapide)

```bash
# Sur le VPS
cd /srv/www/securevault/saas/securevault
docker compose restart backend

# Vérifier les logs
docker compose logs -f backend
```

#### 2. Vérifier la Configuration CORS

Le fichier [backend/src/server.js](../saas/securevault/backend/src/server.js) doit contenir :

```javascript
// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://vault.freijstack.com',
  'https://vault-staging.freijstack.com'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
}));

// Explicitly handle OPTIONS
app.options('*', cors());
```

#### 3. Vérifier les Variables d'Environnement

```bash
# Sur le VPS
cd /srv/www/securevault/saas/securevault

# Vérifier FRONTEND_URL dans .env
grep FRONTEND_URL .env

# Doit afficher :
# FRONTEND_URL=https://vault.freijstack.com
```

Si absent ou incorrect :

```bash
# Pour production
echo "FRONTEND_URL=https://vault.freijstack.com" >> .env

# Pour staging
cd /srv/www/securevault-staging/saas/securevault
echo "FRONTEND_URL=https://vault-staging.freijstack.com" >> .env

# Redémarrer
docker compose restart backend
```

#### 4. Diagnostic Automatique

Utilisez le script de diagnostic :

```bash
# Depuis votre machine locale
cd /path/to/freijstack
chmod +x scripts/diagnose-cors.sh
./scripts/diagnose-cors.sh
```

Ou depuis le VPS :

```bash
ssh user@vps
cd /srv/www/securevault
curl -X OPTIONS https://vault-api.freijstack.com/api/auth/register \
  -H "Origin: https://vault.freijstack.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -I
```

**Réponse attendue** :

```
HTTP/2 204
access-control-allow-origin: https://vault.freijstack.com
access-control-allow-methods: GET,HEAD,PUT,PATCH,POST,DELETE
access-control-allow-credentials: true
access-control-max-age: 86400
```

---

## 🚨 Autres Erreurs CORS Courantes

### Erreur : "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause** : Le backend ne répond pas avec les bons headers CORS.

**Solution** :

1. Vérifier que CORS est activé dans server.js (voir ci-dessus)
2. Vérifier les logs backend : `docker compose logs backend | grep CORS`
3. S'assurer que l'origine est dans `allowedOrigins`

### Erreur : "CORS policy: The value of the 'Access-Control-Allow-Credentials' header is ''"

**Cause** : `credentials: true` n'est pas configuré.

**Solution** : Vérifier dans server.js que `credentials: true` est présent dans la config CORS.

### Erreur : Rate Limit sur OPTIONS

**Cause** : Le rate limiter bloque les requêtes OPTIONS.

**Solution** : Ajoutez le skip dans server.js :

```javascript
const limiter = rateLimit({
  // ... autres options
  skip: (req) => req.method === 'OPTIONS', // Ne pas rate-limit les preflight
});
```

### Erreur : Helmet bloque les requêtes

**Cause** : Helmet avec une config trop stricte.

**Solution** : Vérifier la config Helmet dans server.js :

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  crossOriginEmbedderPolicy: false, // Important pour CORS
}));
```

---

## 🔍 Diagnostic Approfondi

### 1. Vérifier que le Backend Écoute

```bash
# Sur le VPS
docker compose ps

# Le backend doit être "Up"
# securevault-backend   docker-entrypoint.sh node   Up   0.0.0.0:3001->3001/tcp

# Tester en local (sur le VPS)
curl http://localhost:3001/health
# Doit retourner : {"status":"healthy",...}
```

### 2. Vérifier Traefik

```bash
# Vérifier que Traefik route correctement
docker logs traefik 2>&1 | grep -i "vault-api"

# Tester l'accès externe
curl https://vault-api.freijstack.com/health
```

### 3. Vérifier les Logs Backend

```bash
# Logs en temps réel
docker compose logs -f backend

# Filtrer les erreurs
docker compose logs backend | grep -i error

# Filtrer CORS
docker compose logs backend | grep -i cors
```

### 4. Tester avec curl

```bash
# Test OPTIONS (preflight)
curl -v -X OPTIONS https://vault-api.freijstack.com/api/auth/register \
  -H "Origin: https://vault.freijstack.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization"

# Test POST réel
curl -v -X POST https://vault-api.freijstack.com/api/auth/register \
  -H "Origin: https://vault.freijstack.com" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"Test123!"}'
```

---

## 🔄 Procédure Complète de Fix

Si rien ne fonctionne, suivez cette procédure :

```bash
# 1. Se connecter au VPS
ssh user@vps

# 2. Aller dans le dossier
cd /srv/www/securevault/saas/securevault

# 3. Sauvegarder la config actuelle
cp backend/src/server.js backend/src/server.js.backup
cp .env .env.backup

# 4. Pull les dernières modifications depuis Git
cd /srv/www/securevault
git pull origin master  # ou develop pour staging

# 5. Vérifier la configuration
cd saas/securevault
cat backend/src/server.js | grep -A 20 "CORS Configuration"

# 6. Vérifier FRONTEND_URL
grep FRONTEND_URL .env

# 7. Rebuild et restart
docker compose down
docker compose up -d --build backend

# 8. Attendre le démarrage (10 secondes)
sleep 10

# 9. Vérifier les logs
docker compose logs --tail=50 backend

# 10. Tester CORS
curl -I -X OPTIONS https://vault-api.freijstack.com/api/auth/register \
  -H "Origin: https://vault.freijstack.com" \
  -H "Access-Control-Request-Method: POST"

# Doit retourner HTTP 204 avec headers Access-Control-Allow-*
```

---

## 📋 Checklist de Vérification

- [ ] Backend est "Up" : `docker compose ps`
- [ ] Backend répond à /health : `curl https://vault-api.freijstack.com/health`
- [ ] FRONTEND_URL est défini dans .env
- [ ] CORS configuré dans server.js avec allowedOrigins
- [ ] `app.options('*', cors())` présent dans server.js
- [ ] Rate limiter skip OPTIONS : `skip: (req) => req.method === 'OPTIONS'`
- [ ] Logs backend ne montrent pas d'erreur : `docker compose logs backend`
- [ ] Traefik route correctement : `docker logs traefik | grep vault-api`
- [ ] Test OPTIONS retourne 204 : `curl -X OPTIONS https://vault-api.../api/auth/register`
- [ ] Headers CORS présents dans la réponse OPTIONS

---

## 🆘 Support

Si le problème persiste après toutes ces étapes :

1. **Collectez les logs** :
   ```bash
   docker compose logs backend > backend-logs.txt
   docker logs traefik > traefik-logs.txt
   ```

2. **Vérifiez la configuration réseau** :
   ```bash
   docker network ls
   docker network inspect web
   docker network inspect securevault_network
   ```

3. **Testez depuis différents endroits** :
   - Depuis le VPS (localhost)
   - Depuis votre machine (domain)
   - Depuis Postman/Insomnia

4. **Vérifiez DNS** :
   ```bash
   dig vault-api.freijstack.com
   dig vault.freijstack.com
   ```

---

## 🎯 Configuration de Référence

### server.js (minimal fonctionnel)

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// CORS - MUST BE BEFORE ROUTES
app.use(cors({
  origin: true, // Allow all origins temporarily for testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.options('*', cors()); // Handle preflight

app.use(express.json());

// Routes
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/auth'));

app.listen(3001, () => console.log('Server running'));
```

Si cette config minimale fonctionne, réintroduisez progressivement :
1. Rate limiting
2. Helmet
3. Restricted origins
4. Autres middlewares

---

**📌 Rappel Important** : Les requêtes OPTIONS (preflight) doivent TOUJOURS retourner 200 ou 204, même sans authentification !
