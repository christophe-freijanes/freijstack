# 🔧 Guide de Dépannage - FreijStack

Guide complet pour diagnostiquer et résoudre les problèmes courants du portfolio et de l'infrastructure.

**Dernière mise à jour**: Janvier 2026

---

## 📋 Table des Matières

1. [Problèmes de Déploiement](#problèmes-de-déploiement)
2. [Erreurs HTTP](#erreurs-http)
3. [Problèmes SSL/TLS](#problèmes-ssltls)
4. [Problèmes Docker](#problèmes-docker)
5. [Problèmes DNS](#problèmes-dns)
6. [Problèmes Frontend](#problèmes-frontend)
7. [Problèmes CI/CD](#problèmes-cicd)
8. [SecureVault - Problèmes CORS](#securevault-problèmes-cors)
9. [SecureVault - Problèmes Enregistrement](#securevault-problèmes-enregistrement)
10. [Commandes de Diagnostic](#commandes-de-diagnostic)
11. [Contacts Support](#contacts-support)

---

## Problèmes de Déploiement

### ❌ Déploiement GitHub Actions échoue

**Symptômes**: Pipeline CI/CD rouge, erreur SSH

**Diagnostic**:
```bash
# Vérifier connexion SSH depuis local
ssh -i ~/.ssh/freijstack_deploy deploy@IP_VPS

# Vérifier logs GitHub Actions
# GitHub → Actions → Run échoué → Logs détaillés
```

**Solutions**:

1. **Clé SSH invalide ou expirée**
   ```bash
   # Régénérer clé
   ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/freijstack_deploy
   
   # Copier sur VPS
   ssh-copy-id -i ~/.ssh/freijstack_deploy.pub deploy@IP_VPS
   
   # Mettre à jour secret GitHub SSH_PRIVATE_KEY
   ```

2. **Permissions incorrectes sur VPS**
   ```bash
   # Corriger permissions
   sudo chown -R deploy:deploy /srv/www/portfolio
   sudo chmod 755 /srv/www/portfolio
   sudo chmod 644 /srv/www/portfolio/*.{html,css,js,json}
   ```

3. **Path de destination n'existe pas**
   ```bash
   # Créer dossiers manquants
   sudo mkdir -p /srv/www/portfolio
   sudo mkdir -p /srv/www/portfolio-staging
   sudo chown -R deploy:deploy /srv/www
   ```

---

### ❌ Rsync échoue avec "Permission denied"

**Symptômes**: Erreur rsync dans logs CI/CD

**Solutions**:
```bash
# Sur VPS - vérifier propriétaire
ls -la /srv/www/

# Corriger si nécessaire
sudo chown -R deploy:deploy /srv/www/portfolio
sudo chown -R deploy:deploy /srv/www/portfolio-staging

# Vérifier sudo access (si besoin)
sudo visudo
# Ajouter si absent:
# deploy ALL=(ALL) NOPASSWD: /usr/bin/docker-compose
```

---

## Erreurs HTTP

### ❌ 404 Not Found

**Symptômes**: Page blanche ou "404" en accédant au site

**Diagnostic**:
```bash
# Vérifier fichiers présents
ls -lah /srv/www/portfolio/
# Doit contenir: index.html, style.css, script.js, data.json

# Vérifier nginx logs
docker logs portfolio-prod 2>&1 | tail -20
```

**Solutions**:

1. **Fichiers manquants**
   ```bash
   # Redéployer depuis Git
   cd /tmp
   git clone https://github.com/christophe-freijanes/freijstack.git
   # Portfolio déployé via base-infra/
   # Vérifier que les fichiers existent
   ls -la /srv/www/portfolio/
   sudo chown -R deploy:deploy /srv/www/portfolio
   ```

2. **Mauvais path nginx**
   ```bash
   # Vérifier container mount
   docker inspect portfolio-prod | grep -A 5 Mounts
   
   # Doit montrer: /srv/www/portfolio:/usr/share/nginx/html:ro
   ```

3. **Index.html mal nommé**
   ```bash
   # Vérifier nom exact
   ls -la /srv/www/portfolio/index.html
   
   # Si absent, renommer ou copier
   ```

---

### ❌ 502 Bad Gateway

**Symptômes**: "502 Bad Gateway" en accédant au site

**Diagnostic**:
```bash
# Vérifier containers actifs
docker ps | grep -E "portfolio|traefik"

# Vérifier logs nginx
docker logs portfolio-prod --tail 50
```

**Solutions**:

1. **Container nginx arrêté**
   ```bash
   # Redémarrer container
   docker-compose -f /srv/docker/traefik/docker-compose.yml restart portfolio-prod
   
   # Vérifier status
   docker ps | grep portfolio-prod
   ```

2. **Traefik ne route pas correctement**
   ```bash
   # Vérifier labels Traefik
   docker inspect portfolio-prod | grep -A 10 Labels
   
   # Redémarrer Traefik
   docker-compose -f /srv/docker/traefik/docker-compose.yml restart traefik
   ```

3. **Network Docker déconnecté**
   ```bash
   # Vérifier network
   docker network ls
   docker network inspect web
   
   # Reconnecter si nécessaire
   docker network connect web portfolio-prod
   ```

---

### ❌ 503 Service Unavailable

**Symptômes**: "503" temporaire ou permanent

**Solutions**:
```bash
# Vérifier ressources système
free -h
df -h

# Vérifier si OOM (Out of Memory)
dmesg | grep -i "out of memory"

# Restart tous les containers
docker-compose -f /srv/docker/traefik/docker-compose.yml restart
```

---

## Problèmes SSL/TLS

### ❌ Certificat SSL invalide ou expiré

**Symptômes**: Navigateur affiche "Connexion non sécurisée"

**Diagnostic**:
```bash
# Vérifier certificat
openssl s_client -connect portfolio.freijstack.com:443 -servername portfolio.freijstack.com < /dev/null 2>/dev/null | openssl x509 -noout -dates

# Vérifier logs ACME Traefik
docker logs traefik 2>&1 | grep -i acme
```

**Solutions**:

1. **Rate limit Let's Encrypt**
   ```bash
   # Attendre 1h et relancer
   # Ou utiliser staging environment temporairement
   
   # Éditer docker-compose.yml:
   # --certificatesresolvers.letsencrypt.acme.caServer=https://acme-staging-v02.api.letsencrypt.org/directory
   
   docker-compose -f /srv/docker/traefik/docker-compose.yml restart traefik
   ```

2. **acme.json corrompu**
   ```bash
   # Sauvegarder ancien
   cp /srv/docker/traefik/acme.json /srv/docker/traefik/acme.json.bak
   
   # Recréer vide
   rm /srv/docker/traefik/acme.json
   touch /srv/docker/traefik/acme.json
   chmod 600 /srv/docker/traefik/acme.json
   
   # Restart Traefik
   docker-compose -f /srv/docker/traefik/docker-compose.yml restart traefik
   
   # Attendre 2-5 min pour nouveau certificat
   ```

3. **DNS non propagé**
   ```bash
   # Vérifier DNS
   dig portfolio.freijstack.com +short
   
   # Doit retourner IP_VPS
   # Si vide, attendre propagation DNS (5-30min)
   ```

---

### ❌ Mixed Content (HTTP/HTTPS)

**Symptômes**: Ressources bloquées, CSS/JS ne charge pas

**Solutions**:
```bash
# Vérifier CSP dans index.html
grep "Content-Security-Policy" /srv/www/portfolio/index.html

# Doit contenir: upgrade-insecure-requests

# Forcer HTTPS dans Traefik (déjà configuré)
# Vérifier redirection HTTP → HTTPS
curl -I http://portfolio.freijstack.com
# Doit retourner 301 ou 308 vers https://
```

---

## Problèmes Docker

### ❌ Docker daemon ne répond pas

**Symptômes**: `Cannot connect to Docker daemon`

**Solutions**:
```bash
# Vérifier status Docker
sudo systemctl status docker

# Redémarrer Docker
sudo systemctl restart docker

# Vérifier user dans groupe docker
groups deploy
# Doit contenir "docker"

# Si absent, ajouter
sudo usermod -aG docker deploy
# Déconnexion/reconnexion nécessaire
```

---

### ❌ Container ne démarre pas

**Symptômes**: Container en status "Exited" ou "Restarting"

**Diagnostic**:
```bash
# Vérifier logs container
docker logs portfolio-prod --tail 100

# Vérifier events Docker
docker events --since 30m
```

**Solutions**:
```bash
# Recréer container from scratch
docker-compose -f /srv/docker/traefik/docker-compose.yml down
docker-compose -f /srv/docker/traefik/docker-compose.yml up -d

# Vérifier image corrompue
docker pull nginx:alpine
docker-compose -f /srv/docker/traefik/docker-compose.yml up -d --force-recreate
```

---

### ❌ Espace disque plein

**Symptômes**: Erreur "no space left on device"

**Solutions**:
```bash
# Vérifier espace
df -h

# Nettoyer Docker
docker system prune -a --volumes

# Supprimer images inutilisées
docker image prune -a

# Supprimer vieux backups
find /home/deploy/backups/ -name "portfolio-*.tar.gz" -mtime +30 -delete

# Supprimer logs anciens
sudo journalctl --vacuum-time=7d
```

---

## Problèmes DNS

### ❌ Domaine ne résout pas

**Symptômes**: `nslookup` retourne NXDOMAIN

**Diagnostic**:
```bash
# Tester résolution DNS
dig portfolio.freijstack.com +short
nslookup portfolio.freijstack.com

# Tester depuis autre serveur DNS
dig @8.8.8.8 portfolio.freijstack.com +short
```

**Solutions**:

1. **Enregistrements DNS mal configurés**
   - Vérifier chez provider DNS
   - Type A doit pointer vers IP_VPS
   - TTL recommandé: 3600 (1h)

2. **Propagation DNS en cours**
   - Attendre 5-30 minutes
   - Vérifier propagation: https://www.whatsmydns.net/

3. **Cache DNS local**
   ```bash
   # Flush DNS cache (local machine)
   # Linux:
   sudo systemd-resolve --flush-caches
   
   # macOS:
   sudo dscacheutil -flushcache
   
   # Windows:
   ipconfig /flushdns
   ```

---

## Problèmes Frontend

### ❌ Thème saisonnier ne change pas

**Symptômes**: Couleurs restent identiques malgré changement de saison

**Diagnostic**:
```bash
# Vérifier script.js présent
ls -lah /srv/www/portfolio/script.js

# Vérifier date serveur
date
# Doit être synchronisée (NTP)
```

**Solutions**:
```bash
# Vider cache navigateur
# Ctrl+Shift+R (hard reload)

# Vérifier console navigateur (F12)
# Chercher erreurs JavaScript

# Synchroniser date/heure serveur
sudo timedatectl set-ntp true
sudo timedatectl status
```

---

### ❌ Langue ne bascule pas (i18n)

**Symptômes**: Interface reste en FR malgré clic sur EN

**Solutions**:
- Vider localStorage navigateur
- Vérifier console pour erreurs JS
- Tester en navigation privée
- Vider cache service worker si activé

---

### ❌ Formulaire contact ne fonctionne pas

**Symptômes**: Message "Erreur d'envoi" ou rien ne se passe

**Diagnostic**:
```bash
# Vérifier console navigateur (F12)
# Chercher erreurs réseau ou JavaScript

# Vérifier CSP ne bloque pas
grep "Content-Security-Policy" /srv/www/portfolio/index.html
```

**Solutions**:
- Captcha mal résolu → Régénérer
- Email backend pas configuré → Contact via lien mailto: fonctionne
- Vérifier script.js ligne captcha validation

---

## Problèmes CI/CD

### ❌ GitHub Actions timeout

**Symptômes**: Pipeline dépasse 6h et annulé

**Solutions**:
```bash
# Vérifier connexion réseau VPS
ping -c 4 github.com

# Réduire taille transfert rsync
# Ajouter --exclude dans workflow:
# rsync -avz --delete --exclude='*.log' --exclude='.git'
```

---

### ❌ CodeQL scan échoue

**Symptômes**: Job security fail

**Solutions**:
- Vérifier compatibilité langage
- Ignorer false positives avec `.github/codeql/codeql-config.yml`
- Timeout: augmenter dans workflow

---

### ❌ Gitleaks détecte faux positifs

**Symptômes**: Secret détecté alors que c'est un exemple

**Solutions**:
```bash
# Créer .gitleaksignore à la racine
echo "portfolio/example-config.js:12" >> .gitleaksignore

# Ou utiliser gitleaks:allow dans le code
# gitleaks:allow
const API_KEY = "example_key_not_real"
```

---

## SecureVault - Problèmes CORS

### 🚨 Erreur 404 sur OPTIONS (CORS Preflight)

**Symptômes** :
- Erreur 404 lors requête OPTIONS dans console navigateur
- Message: "CORS policy: No 'Access-Control-Allow-Origin' header"
- Blocage des requêtes API depuis le frontend

**Diagnostic** :
```bash
# Test CORS preflight
curl -X OPTIONS https://vault-api.freijstack.com/api/auth/register \
  -H "Origin: https://vault.freijstack.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -I

# Réponse attendue: HTTP 204 avec headers Access-Control-*
```

**Solutions** :

#### Solution 1 : Redémarrer Backend
```bash
cd /srv/www/securevault/saas/securevault
docker compose restart backend
docker compose logs -f backend
```

#### Solution 2 : Vérifier Configuration CORS

Fichier `backend/src/server.js` doit contenir :
```javascript
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
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
}));

app.options('*', cors());
```

#### Solution 3 : Vérifier Variables Environnement
```bash
# Vérifier FRONTEND_URL
grep FRONTEND_URL .env

# Si absent, ajouter
echo "FRONTEND_URL=https://vault.freijstack.com" >> .env

# Pour staging
echo "FRONTEND_URL=https://vault-staging.freijstack.com" >> .env.staging

# Redémarrer
docker compose restart backend
```

#### Solution 4 : Diagnostic Automatique
```bash
# Script de diagnostic complet
chmod +x scripts/diagnose-cors.sh
./scripts/diagnose-cors.sh
```

### 🔍 Autres Erreurs CORS

#### No 'Access-Control-Allow-Origin' header
**Cause** : Backend ne répond pas avec headers CORS  
**Solution** : Vérifier config CORS dans server.js, vérifier logs backend

#### Access-Control-Allow-Credentials vide
**Cause** : `credentials: true` non configuré  
**Solution** : Ajouter `credentials: true` dans config CORS

#### Rate Limit sur OPTIONS
**Cause** : Rate limiter bloque preflight requests  
**Solution** : Ajouter skip dans rate limiter :
```javascript
const limiter = rateLimit({
  skip: (req) => req.method === 'OPTIONS',
});
```

#### Helmet bloque CORS
**Cause** : Config Helmet trop stricte  
**Solution** : Modifier config Helmet :
```javascript
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));
```

### 🧪 Tests CORS Détaillés

**Test 1 : Backend écoute**
```bash
docker compose ps  # Backend doit être "Up"
curl http://localhost:3001/health
```

**Test 2 : Traefik route correctement**
```bash
curl https://vault-api.freijstack.com/health
docker logs traefik 2>&1 | grep -i "vault-api"
```

**Test 3 : Headers CORS présents**
```bash
curl -v https://vault-api.freijstack.com/api/auth/register \
  -H "Origin: https://vault.freijstack.com"
# Vérifier Access-Control-* headers dans réponse
```

---

## SecureVault - Problèmes Enregistrement

### 🚨 Impossible de Créer un Compte

**Symptômes** :
- ❌ Bouton Register ne répond pas
- ❌ Erreur 404 ou 500 dans console
- ❌ "Network Error" dans navigateur
- ❌ Formulaire ne se soumet pas

### 🔍 Diagnostic Automatique

```bash
# Script de diagnostic complet
chmod +x scripts/diagnose-registration.sh

# Pour staging
./scripts/diagnose-registration.sh staging

# Pour production
./scripts/diagnose-registration.sh production
```

Le script vérifie :
- ✅ Backend accessible
- ✅ CORS configuré
- ✅ Endpoint /api/auth/register fonctionne
- ✅ Database connectée
- ✅ Table users existe
- ✅ Variables environnement configurées

### 🛠️ Solutions Rapides

#### Solution 1 : Redémarrer Backend
```bash
ssh user@vps
cd /srv/www/securevault/saas/securevault

docker compose restart backend
docker compose ps
docker compose logs -f backend
```

#### Solution 2 : Vérifier et Appliquer Migrations
```bash
# Vérifier table users existe
docker compose exec postgres psql -U securevault -d securevault -c "\dt"

# Si table users absente, appliquer migrations
docker compose exec -T postgres psql -U securevault -d securevault \
  < backend/migrations/001_add_features.sql

# Vérifier structure
docker compose exec postgres psql -U securevault -d securevault -c "\d users"
```

#### Solution 3 : Corriger CORS
```bash
# Vérifier FRONTEND_URL
grep FRONTEND_URL .env

# Si absent
echo "FRONTEND_URL=https://vault.freijstack.com" >> .env
docker compose restart backend
```

#### Solution 4 : Vérifier Variables Environnement
```bash
# Vérifier toutes les variables critiques
for var in POSTGRES_PASSWORD JWT_SECRET ENCRYPTION_KEY FRONTEND_URL DB_HOST; do
  if grep -q "^${var}=" .env; then
    echo "✓ $var is set"
  else
    echo "✗ $var is MISSING"
  fi
done

# Si variables manquantes, copier depuis template
cp .env.example .env
# Puis éditer avec vraies valeurs

# Redémarrer
docker compose restart backend
```

### 📋 Checklist Dépannage Registration

#### Backend
- [ ] Container backend "Up" : `docker compose ps`
- [ ] Backend répond /health : `curl https://vault-api.freijstack.com/health`
- [ ] Logs sans erreur : `docker compose logs backend | grep -i error`
- [ ] Port 3001 écoute : `docker compose exec backend netstat -tulpn | grep 3001`

#### Database
- [ ] Container postgres "Up" : `docker compose ps postgres`
- [ ] DB securevault existe : `docker compose exec postgres psql -U securevault -l`
- [ ] Table users existe : `docker compose exec postgres psql -U securevault -d securevault -c "\dt"`
- [ ] Connexion DB OK : Check logs backend

#### CORS
- [ ] OPTIONS retourne 204/200
- [ ] Headers CORS présents
- [ ] FRONTEND_URL correspond au domaine
- [ ] Pas de blocage ad-blocker

#### Frontend
- [ ] Frontend accessible : `curl https://vault.freijstack.com`
- [ ] index.html charge
- [ ] Variables React configurées (REACT_APP_API_URL)
- [ ] Console navigateur sans erreur

### 🔬 Tests Manuels Registration

**Test 1 : Backend Health**
```bash
curl https://vault-api.freijstack.com/health

# Attendu:
# {"status":"healthy","timestamp":"...","service":"securevault-backend"}
```

**Test 2 : CORS Preflight**
```bash
curl -v -X OPTIONS https://vault-api.freijstack.com/api/auth/register \
  -H "Origin: https://vault.freijstack.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"

# Attendu HTTP 204 avec headers Access-Control-*
```

**Test 3 : Registration Endpoint**
```bash
curl -v -X POST https://vault-api.freijstack.com/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: https://vault.freijstack.com" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Attendu HTTP 201 + token
```

**Résultats possibles** :
- ✅ HTTP 201 : Succès, user créé
- ⚠️ HTTP 400 : Erreur validation (password faible, email invalide)
- ⚠️ HTTP 409 : User existe déjà
- ❌ HTTP 500 : Erreur serveur (check logs backend)

### 🔧 Problèmes Spécifiques

#### Erreur : "Username already exists"
```bash
# Vérifier users existants
docker compose exec postgres psql -U securevault -d securevault \
  -c "SELECT id, username, email, created_at FROM users;"

# Supprimer user test si nécessaire
docker compose exec postgres psql -U securevault -d securevault \
  -c "DELETE FROM users WHERE username='testuser';"
```

#### Erreur : "Password validation failed"
**Requirements** :
- Minimum 8 caractères
- Au moins 1 majuscule
- Au moins 1 minuscule
- Au moins 1 chiffre
- Au moins 1 caractère spécial

**Test password valide** : `TestPass123!`

#### Erreur : "Database connection failed"
```bash
# Vérifier connexion depuis backend
docker compose exec backend node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()').then(r => console.log('DB OK:', r.rows[0])).catch(console.error);
"

# Vérifier DATABASE_URL dans .env
grep DATABASE_URL .env
```

#### Erreur : "JWT_SECRET not configured"
```bash
# Générer nouveau JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Ajouter dans .env
echo "JWT_SECRET=<generated_secret>" >> .env

# Redémarrer
docker compose restart backend
```

### 📊 Logs Utiles

**Backend logs détaillés** :
```bash
docker compose logs backend --tail 100 -f
```

**PostgreSQL logs** :
```bash
docker compose logs postgres --tail 50
```

**Traefik routing** :
```bash
docker logs traefik 2>&1 | grep vault-api
```

**Tous les services** :
```bash
docker compose logs --tail 50 -f
```

---

## Commandes de Diagnostic

### Santé Système

```bash
# Ressources
htop
free -h
df -h

# Processus top CPU
ps aux --sort=-%cpu | head -10

# Processus top RAM
ps aux --sort=-%mem | head -10

# Uptime
uptime
```

### Docker Health

```bash
# Containers actifs
docker ps

# Tous containers
docker ps -a

# Stats temps réel
docker stats

# Logs container
docker logs portfolio-prod --tail 100 -f

# Inspect container
docker inspect portfolio-prod

# Networks
docker network ls
docker network inspect web
```

### Réseau

```bash
# Ports listening
sudo netstat -tlnp | grep -E ':(80|443|22)'

# Connexions actives
sudo netstat -an | grep ESTABLISHED

# Test connectivité
curl -I https://portfolio.freijstack.com
curl -I https://portfolio-staging.freijstack.com

# Test SSL
openssl s_client -connect portfolio.freijstack.com:443 -servername portfolio.freijstack.com
```

### Logs Système

```bash
# Logs généraux
sudo journalctl -xe

# Logs Docker service
sudo journalctl -u docker -n 100

# Logs nginx (via Docker)
docker exec portfolio-prod cat /var/log/nginx/access.log
docker exec portfolio-prod cat /var/log/nginx/error.log

# Logs kernel
dmesg | tail -50
```

---

## Contacts Support

### Logs à Collecter pour Support

Avant de demander de l'aide, collecter:

```bash
# Créer rapport diagnostic
cat > /tmp/diagnostic-$(date +%Y%m%d-%H%M%S).txt <<EOF
=== System Info ===
$(uname -a)
$(df -h)
$(free -h)

=== Docker Info ===
$(docker --version)
$(docker-compose --version)
$(docker ps -a)

=== Traefik Logs ===
$(docker logs traefik --tail 50 2>&1)

=== Portfolio Logs ===
$(docker logs portfolio-prod --tail 50 2>&1)

=== Network ===
$(curl -I https://portfolio.freijstack.com 2>&1)
EOF

# Envoyer le rapport
```

### Resources Utiles

- **Documentation officielle**: [README.md](../README.md)
- **Architecture**: [architecture.md](architecture.md)
- **Déploiement**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **GitHub Issues**: https://github.com/christophe-freijanes/freijstack/issues

---

**Version**: 1.0  
**Auteur**: Christophe FREIJANES  
**Date**: Décembre 2025
