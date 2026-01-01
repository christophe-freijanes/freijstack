# 🔍 Guide de Redaction - Patterns & Exemples

Reference rapide pour redacter les infos sensibles dans les documents publics.

**Format**: Patterns avec exemples avant/après et cas d'usage.

---

## 📋 Index Rapide

- [Identifiants Cloud](#identifiants-cloud)
- [Secrets & Tokens](#secrets--tokens)
- [URLs & Endpoints](#urls--endpoints)
- [Infrastructure](#infrastructure)
- [Données Personnelles](#données-personnelles)
- [Configurations](#configurations)
- [Exemples Complets](#exemples-complets)

---

## Identifiants Cloud

### AWS

**Pattern**: Clés d'accès AWS (commence par `AKIA` ou `ASIA`)

```markdown
# ❌ AVANT
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_SESSION_TOKEN=AQoDYXdzEJr...<long string>...

# ✅ APRÈS
AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY>
AWS_SESSION_TOKEN=<AWS_SESSION_TOKEN>

# 📍 CONTEXTE RECOMMANDÉ
AWS_ACCESS_KEY_ID=<REDACTED>         # Obtenu depuis IAM Console
AWS_SECRET_ACCESS_KEY=<REDACTED>     # Généré une seule fois
AWS_SESSION_TOKEN=<REDACTED>         # Optionnel pour sessions temporaires
AWS_REGION=us-east-1                  # ✅ OK - public info
```

### Azure

```markdown
# ❌ AVANT
AZURE_STORAGE_ACCOUNT_NAME=myaccountname
AZURE_STORAGE_ACCOUNT_KEY=DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=xxxx==
AZURE_SUBSCRIPTION_ID=12345678-1234-1234-1234-123456789012

# ✅ APRÈS
AZURE_STORAGE_ACCOUNT_NAME=<AZURE_STORAGE_ACCOUNT>
AZURE_STORAGE_ACCOUNT_KEY=<REDACTED>
AZURE_SUBSCRIPTION_ID=<REDACTED>

# 📍 CONTEXTE
AZURE_STORAGE_ENDPOINT=https://<AZURE_ACCOUNT>.blob.core.windows.net/  # ✅ OK
AZURE_RESOURCE_GROUP=prod-backups                                         # ✅ OK
```

### GCP

```markdown
# ❌ AVANT
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
GOOGLE_CLOUD_PROJECT=my-project-123456
{
  "type": "service_account",
  "project_id": "my-project",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...",
  "client_email": "service@my-project.iam.gserviceaccount.com"
}

# ✅ APRÈS
GOOGLE_APPLICATION_CREDENTIALS=<REDACTED>
GOOGLE_CLOUD_PROJECT=<GCP_PROJECT_ID>

# 📍 CONTEXTE
GCP_BUCKET=gs://prod-backups/  # ✅ OK - can be known
GCP_REGION=us-central1         # ✅ OK
```

---

## Secrets & Tokens

### GitHub Tokens

```markdown
# ❌ AVANT
GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyzABC
GITHUB_APP_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\nMIIEvQIBADANBg...
GITHUB_OAUTH_CLIENT_SECRET=ghu_1234567890abcdefghij

# ✅ APRÈS
GITHUB_TOKEN=<REDACTED>
GITHUB_APP_PRIVATE_KEY=<REDACTED>
GITHUB_OAUTH_CLIENT_SECRET=<REDACTED>

# 📍 CONTEXTE
GITHUB_OWNER=christophe-freijanes  # ✅ OK - public
GITHUB_REPO=freijstack             # ✅ OK - public
GITHUB_APP_ID=12345                # ✅ OK - public
```

### JWT Secrets

```markdown
# ❌ AVANT
JWT_SECRET=aB9$kL@mN2#pQ4%rS&tU8*vW0(xY3)zA5+bC7-dE

# ✅ APRÈS
JWT_SECRET=<REDACTED>

# 📍 CONTEXTE
JWT_ALGORITHM=HS256         # ✅ OK
JWT_EXPIRY=24h              # ✅ OK
JWT_ISSUER=freijstack.com   # ✅ OK
```

### Database Passwords

```markdown
# ❌ AVANT
POSTGRES_PASSWORD=Tr0pic@lFruit#92$Safe!
DB_CONNECTION_STRING=postgresql://admin:<REDACTED>@db.internal:5432/vault_db
MONGODB_URI=mongodb+srv://user:<REDACTED>@cluster.mongodb.net/dbname

# ✅ APRÈS
POSTGRES_PASSWORD=<REDACTED>
DB_CONNECTION_STRING=postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>
MONGODB_URI=mongodb+srv://<DB_USER>:<DB_PASSWORD>@<DB_CLUSTER>/<DB_NAME>

# 📍 CONTEXTE - Ce qui est OK
DATABASE_ENGINE=postgresql    # ✅ OK
DATABASE_PORT=5432           # ✅ OK (standard)
DATABASE_VERSION=15          # ✅ OK
```

### API Keys (diverses services)

```markdown
# ❌ AVANT - Ne JAMAIS mettre en doc public
STRIPE_SECRET=sk_live_<REDACTED>
STRIPE_PUBLIC=pk_live_<REDACTED>
OPENAI_API_KEY=sk-proj-<REDACTED>
SENDGRID_API_KEY=SG.<REDACTED>
SLACK_TOKEN=xoxb-<REDACTED>
DISCORD_TOKEN=<REDACTED>

# ✅ APRÈS
STRIPE_SECRET=<STRIPE_SECRET>
STRIPE_PUBLIC=<STRIPE_PUBLIC>      # Même la clé publique si pas nécessaire
OPENAI_API_KEY=<OPENAI_API_KEY>
SENDGRID_API_KEY=<SENDGRID_API_KEY>
SLACK_TOKEN=<SLACK_TOKEN>
DISCORD_TOKEN=<DISCORD_TOKEN>

# 📍 CONTEXTE - Ce qui est OK
STRIPE_ACCOUNT=acct_123456    # ✅ OK si pas lié à secret
STRIPE_PUBLISHABLE_KEY=pk_*   # ⚠️ Optionnel - généralement exposé
OPENAI_MODEL=gpt-4            # ✅ OK
SENDGRID_SENDER_EMAIL=noreply@freijstack.com  # ✅ OK
```

---

## URLs & Endpoints

### Webhooks

```markdown
# ❌ AVANT
SLACK_WEBHOOK=https://hooks.slack.com/services/T123456/B789012/abcdefghijklmnopqrst
GITHUB_WEBHOOK_SECRET=whsec_12345abcdefghijklmnop
DISCORD_WEBHOOK=https://discord.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz_1A2B3C4D5E

# ✅ APRÈS
SLACK_WEBHOOK=<REDACTED_SLACK_WEBHOOK>
GITHUB_WEBHOOK_SECRET=<REDACTED>
DISCORD_WEBHOOK=<REDACTED_DISCORD_WEBHOOK>

# 📍 CONTEXTE - Documenté de cette manière
Pour configurer Slack:
1. Allez dans Incoming Webhooks: https://api.slack.com/messaging/webhooks
2. Créez un nouveau webhook pour le channel #alerts
3. Stockez l'URL dans GitHub Secrets: SLACK_WEBHOOK
```

### Database URIs

```markdown
# ❌ AVANT
POSTGRES_URI=postgresql://admin:SecurePass123@db.company.local:5432/production_vault
MYSQL_CONNECTION=mysql://root:MyP@ssw0rd!@mysql.internal.local:3306/app_db
MONGODB=mongodb+srv://app_user:encrypted_pass@mongodb-prod.internal.cloud/db?replicaSet=main

# ✅ APRÈS
POSTGRES_URI=postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>
MYSQL_CONNECTION=mysql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>
MONGODB=mongodb+srv://<DB_USER>:<DB_PASSWORD>@<DB_CLUSTER>/<DB_NAME>

# 📍 CONTEXTE
# Base de données PostgreSQL
# - Moteur: PostgreSQL 15
# - Port: 5432 (standard)
# - Chiffrement: AES-256-GCM
```

### API Endpoints (sensibles)

```markdown
# ❌ AVANT
Backend API: https://api.internal.freijstack.com:8443/v1/
Admin Panel: https://admin.internal.freijstack.com
Monitoring: https://prometheus.internal:9090/

# ✅ APRÈS
Backend API: https://<API_HOST>:<API_PORT>/v1/
Admin Panel: https://<ADMIN_HOST>/
Monitoring: https://<MONITORING_HOST>:<MONITORING_PORT>/

# 📍 CONTEXTE - Ce qui est OK
Public API: https://api.freijstack.com/v1/  # ✅ OK - vraiment public
Portfolio: https://portfolio.freijstack.com  # ✅ OK - vraiment public
```

---

## Infrastructure

### Hostnames & IPs

```markdown
# ❌ AVANT
Production VPS: 203.0.113.42 (root@prod-01.freijstack.local)
Staging Server: 198.51.100.89 (root@staging-01.internal)
Jump Host: 192.0.2.5 (admin@jump.internal)
SSH Config: Host prod-vps
               HostName 203.0.113.42
               User root
               IdentityFile ~/.ssh/prod_rsa

# ✅ APRÈS
Production VPS: <VPS_PROD_IP> (root@<VPS_PROD_HOST>)
Staging Server: <VPS_STAGING_IP> (<VPS_USER>@<VPS_STAGING_HOST>)
Jump Host: <JUMP_HOST_IP> (<JUMP_USER>@<JUMP_HOST>)
SSH Config: Host <VPS_PROD_ALIAS>
               HostName <VPS_PROD_HOST>
               User <VPS_USER>
               IdentityFile <SSH_KEY_PATH>

# 📍 CONTEXTE - Ce qui est OK
Port standard SSH: 22          # ✅ OK
Docker port: 2375              # ✅ OK (standard)
Architecture: x86_64 ARM64     # ✅ OK
OS: Ubuntu 22.04 LTS           # ✅ OK
```

### SSH Keys & Certificates

```markdown
# ❌ AVANT
SSH Key:
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUtbm9uZS1ub25lAAAAAA==
<64+ caractères d'encodage base64>
-----END OPENSSH PRIVATE KEY-----

# ✅ APRÈS
SSH Key: <REDACTED>

# 📍 CONTEXTE
SSH Key Generation (utiliser localement):
1. ssh-keygen -t ed25519 -C "deploy@freijstack.com"
2. Stocker clé privée dans ~/.ssh/deploy_key
3. Ajouter clé publique au serveur

Pour GitHub Actions:
- Utiliser GitHub Deploy Keys ou SSH Deploy Key Secrets
- Jamais commit de clés privées
```

---

## Données Personnelles

### Emails & Contacts

```markdown
# ❌ AVANT (Optionnel de redacter)
Contact: christophe@freijstack.com
Support: support@company.local
Admin: admin@internal.company.com

# ✅ APRÈS (Si souhaité plus privé)
Contact: <ADMIN_EMAIL>
Support: <SUPPORT_EMAIL>
Admin: <INTERNAL_EMAIL>

# ⚠️ NOTE
Les emails publiques (contact, support) peut rester public
Emails internes doivent être redactés
```

### Personal Data

```markdown
# ❌ AVANT - Ne JAMAIS inclure
User: John Doe (john.doe@company.com)
Phone: +33 6 12 34 56 78
Employee ID: EMP-12345
Credit Card: 4532-****-****-1234

# ✅ APRÈS
User: <REDACTED>
Phone: <REDACTED>
Employee ID: <REDACTED>
Credit Card: <REDACTED>

# ✅ COMPLÈTEMENT OK À EXCLURE
Ces infos ne devraient JAMAIS être dans les docs
```

---

## Configurations

### Environment Files

```markdown
# ❌ AVANT - Ne JAMAIS publier .env réel
.env
---
NODE_ENV=production
LOG_LEVEL=debug
DEBUG_MODE=true
SECRET_KEY=aB9$kL@mN2#pQ4%rS&tU8*vW0(xY3)zA5+bC7-dE
API_URL=https://api.internal.freijstack.com
DB_HOST=postgres.internal
DB_USER=vault_app
DB_PASSWORD=SuperSecure123!@#

# ✅ APRÈS - Exemple template
.env.example
---
NODE_ENV=production
LOG_LEVEL=debug
DEBUG_MODE=true
SECRET_KEY=<REDACTED>
API_URL=https://<API_HOST>
DB_HOST=<DB_HOST>
DB_USER=<DB_USER>
DB_PASSWORD=<REDACTED>

# 📍 TEMPLATE POUR CONTRIBUTING.md
Pour développement local:
1. Copiez .env.example vers .env
2. Remplissez les placeholders <...>
3. Ne committez JAMAIS .env
   - Vérifiez .gitignore contient: *.env
```

### Docker Environment

```markdown
# ❌ AVANT
docker-compose.yml:
environment:
  - POSTGRES_PASSWORD=Tr0pic@lFruit#92
  - JWT_SECRET=aB9$kL@mN2#pQ4%rS&
  - API_KEY=sk_live_123456

# ✅ APRÈS
docker-compose.yml:
environment:
  - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
  - JWT_SECRET=${JWT_SECRET}
  - API_KEY=${API_KEY}

.env (non-versionné)
# Valeurs réelles ici

Docs:
Secrets gérés via:
1. GitHub Secrets (CI/CD)
2. .env local (non-tracké git)
3. Docker run -e VAR=value (surcharge runtime)
```

### Configuration Files

```markdown
# ❌ AVANT - nginx.conf avec réalités sensibles
upstream api_backend {
    server internal-api.company.local:8443;
}
location /admin {
    auth_basic "Admin";
    auth_basic_user_file /etc/nginx/htpasswd;  # Username: admin, Pass: S3cur3P@ss!
}

# ✅ APRÈS
upstream api_backend {
    server <API_BACKEND_HOST>:<API_BACKEND_PORT>;
}
location /admin {
    auth_basic "Admin";
    auth_basic_user_file /etc/nginx/htpasswd;
    # Voir docs-private/CREDENTIALS.md pour credentials
}
```

---

## Exemples Complets

### ✅ BON EXEMPLE - Documentation Security Config

```markdown
## Configuration SAML SSO

### Étapes

1. **Obtenir métadonnées Identity Provider**
   - Contactez votre administrateur IdP
   - Récupérez le fichier `metadata.xml` ou l'URL

2. **Ajouter secrets GitHub**
   ```bash
   gh secret set SAML_METADATA_URL \
     --body "https://idp.example.com/metadata.xml"
   
   gh secret set SAML_CERT \
     --body "$(cat /path/to/certificate.pem)"
   ```

3. **Mettre à jour backend/config/saml.js**
   ```javascript
   const samlConfig = {
     entryPoint: process.env.SAML_METADATA_URL,
     issuer: 'https://vault.freijstack.com',
     cert: process.env.SAML_CERT,
     identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'
   };
   ```

4. **Tester dans staging**
   ```bash
   # Staging deployment teste automatiquement SAML
   git push origin develop
   # Vérifier health check post-deploy dans GitHub Actions
   ```

> 📝 **Note**: Configuration réelle stockée dans `/docs-private/CREDENTIALS.md`
```

### ❌ MAUVAIS EXEMPLE - Ne pas faire ceci

```markdown
## Configuration Database

Voici notre setup PostgreSQL:

Host: postgres.prod.internal
Port: 5432
Username: vault_prod_user
Password: Tr0p1c@lFruit#92$Safe!
Database: vault_production

Connectez-vous avec:
psql -h postgres.prod.internal -U vault_prod_user -d vault_production -c "SELECT * FROM users;"

SSH vers le serveur:
ssh -i ~/.ssh/prod_key root@203.0.113.42

⚠️ JAMAIS FAIRE CECI!
```

---

## Checklist de Redaction

Avant de commiter un document public:

```markdown
## 📋 Pre-commit Redaction Checklist

- [ ] Pas de clés AWS/GCP/Azure
- [ ] Pas de tokens GitHub/API (ghp_, sk_live_, etc.)
- [ ] Pas de secrets JWT ou DB passwords
- [ ] Pas de URLs webhook réelles
- [ ] Pas d'IPs ou hostnames internes
- [ ] Pas de chemins de fichiers sensibles
- [ ] Pas de noms de domaines internes
- [ ] Pas d'emails personnels (sauf publics)
- [ ] Pas de configurations réelles .env
- [ ] Pas de clés SSH privées
- [ ] Pas de credentials de domaine
- [ ] Pas de screenshots montrant dashboard sensible
- [ ] Tous les placeholders <...> sont cohérents
- [ ] Liens vers /docs-private/ sont présents où approprié
```

---

## Auto-Génération pour Docs

Vous pouvez créer un script de redaction:

```bash
#!/bin/bash
# redact-docs.sh

find docs -name "*.md" -type f | while read file; do
    echo "Checking $file..."
    
    # Patterns AWS
    grep -En "AKIA[0-9A-Z]{16}" "$file" && \
        echo "  ⚠️ AWS Keys detected"
    
    # Patterns GitHub tokens
    grep -En "ghp_[A-Za-z0-9]{30,}" "$file" && \
        echo "  ⚠️ GitHub tokens detected"
    
    # Private IPs
    grep -En "192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])" "$file" && \
        echo "  ⚠️ Private IPs detected"
    
    # Database strings
    grep -En "postgresql://.*@|mysql://.*@" "$file" && \
        echo "  ⚠️ Database connection strings detected"
done
```

---

**Dernière mise à jour**: Janvier 2026  
**Mainteneur**: DevOps + Security Team
