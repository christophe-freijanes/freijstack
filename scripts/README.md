# 🛠️ Scripts Utilitaires

Ce dossier contient les scripts d'automation et utilitaires pour maintenir l'infrastructure FreijStack.

**Dernière mise à jour**: Janvier 2026

---

## 📋 Contenu

```
scripts/
├── backup-to-cloud.sh              # Backup vers AWS S3 + Azure
├── check-traefik-network.sh        # Vérifier réseau Traefik
├── check-vps-staging.ps1           # Vérifier santé VPS
├── cleanup-registry-images.sh      # Cleanup images Docker Registry
├── deploy-registry.sh              # Déployer Docker Registry
├── destroy-portfolio.ps1           # Détruire portfolio (cleanup)
├── diagnose-cors.sh                # Diagnostic CORS SecureVault
├── diagnose-registration.ps1       # Diagnostic registration
├── diagnose-registration.sh        # Diagnostic registration (shell)
├── docs-generate.ps1               # Générer docs (Windows)
├── docs-generate.sh                # Générer docs (Unix)
├── fix-network-issue.sh            # Corriger problèmes réseau
├── generate-secrets.ps1            # Générer secrets et clés
├── redeploy-portfolio.ps1          # Redéployer portfolio
├── redeploy-portfolio.sh           # Redéployer portfolio (shell)
├── rotate-secrets.sh               # Rotation des secrets
├── run-migrations.sh               # Exécuter migrations DB
├── security-check.sh               # Audit sécurité
├── setup-registry-prod-secrets.sh  # Setup secrets Registry prod
├── setup-ssh-key.sh                # Configuration SSH
├── test-registry.sh                # Tester Registry
├── validate-automation.sh          # Valider workflows CI/CD
└── README.md                       # Ce fichier
```

---

## 📚 Scripts Documentation

### `docs-generate.sh` / `docs-generate.ps1` - Générer la Documentation

Génération et validation automatique de la documentation.

**Usage (Bash/Linux/Mac)**:
```bash
./scripts/docs-generate.sh [command]
```

**Usage (PowerShell/Windows)**:
```powershell
.\scripts\docs-generate.ps1 -Command <command>
```

**Commands**:
| Command | Description |
|---------|-------------|
| `all` | Génération complète (validation + diagrams + index) |
| `validate` | Valider markdown + scan secrets + vérifier liens |
| `diagrams` | Générer diagrams Mermaid (PNG + SVG) |
| `index` | Générer index JSON des documents |
| `summary` | Générer résumé avec statistiques |
| `scan` | Scanner les secrets sensibles dans /docs |
| `links` | Valider les liens internes (broken links) |
| `compare` | Comparer documents publics vs privés |
| `clean` | Nettoyer fichiers générés (.generated, .index.json) |

**Exemples**:
```bash
# Bash
./scripts/docs-generate.sh all         # Génération complète
./scripts/docs-generate.sh scan        # Vérifier les secrets
./scripts/docs-generate.sh diagrams    # Générer diagrams Mermaid seulement
./scripts/docs-generate.sh validate    # Valider markdown + liens
./scripts/docs-generate.sh clean       # Nettoyer fichiers générés

# PowerShell
.\scripts\docs-generate.ps1 -Command all
.\scripts\docs-generate.ps1 -Command scan
.\scripts\docs-generate.ps1 -Command diagrams
```

**Outputs**:
- `docs/.generated/` - Diagrams convertis (PNG, SVG)
- `docs/.index.json` - Index JSON de tous les documents
- `docs/.summary.txt` - Résumé avec statistiques
- Console output - Détails de validation

**Dépendances**:
- Node.js 16+ (pour markdownlint et mermaid-cli)
- npm (optionnel, pour installation tools)
- ripgrep `rg` (optionnel, pour scan secrets avancé)

**Installation dépendances** (première utilisation):
```bash
# Installation globale des tools
npm install -g markdownlint-cli2 @mermaid-js/mermaid-cli

# Ou sur Windows avec Chocolatey
choco install markdownlint ripgrep

# Ou sur Mac avec brew
brew install markdownlint ripgrep
```

**Configuration**:
Voir [DOCS_CONFIG_REFERENCE.md](../docs/DOCS_CONFIG_REFERENCE.md) pour:
- Patterns de secrets à détecter
- Règles de linting Markdown
- Plannification des générations (cron)

**Sécurité**:
- ✅ Scan automatique pour AWS keys, GitHub tokens, DB passwords, webhooks
- ✅ Redaction patterns: `<REDACTED>`, `<VPS_HOST>`, `<DB_PASSWORD>`
- ✅ Détection faux positifs via `.gitleaksignore`
- ✅ Bloque commit si secrets en public (CI/CD)

---

## 🔐 Scripts Sécurité

### `generate-secrets.ps1` - Générer les Secrets

Génère les clés cryptographiques et secrets pour SecureVault.

```powershell
# Générer tous les secrets
.\scripts\generate-secrets.ps1

# Générer un secret spécifique
.\scripts\generate-secrets.ps1 -Type "JWT"
```

**Outputs**:
- `JWT_SECRET` (32 bytes hex)
- `ENCRYPTION_KEY` (32 bytes hex)
- `DATABASE_PASSWORD` (random string)

**Usage**: Copier les valeurs dans `.env` sur le VPS.

---

### `rotate-secrets.sh` - Rotation des Secrets

Effectue la rotation périodique des secrets de chiffrement.

```bash
chmod +x scripts/rotate-secrets.sh

# Rotation manuelle
./scripts/rotate-secrets.sh

# Rotation planifiée (cron)
0 0 1 * * /path/to/scripts/rotate-secrets.sh
```

**Processus**:
1. Génère nouvelle `ENCRYPTION_KEY`
2. Re-chiffre tous les secrets existants
3. Backup ancienne clé
4. Met à jour `.env` sur VPS

⚠️ **IMPORTANT**: 
- Effectuer hors heures de pointe
- Backup database avant de lancer
- Éviter simultanément avec d'autres modifications

---

### `security-check.sh` - Audit Sécurité

Effectue un audit de sécurité complet du système et de l'application.

```bash
chmod +x scripts/security-check.sh

# Audit complet
./scripts/security-check.sh

# Audit specific component
./scripts/security-check.sh --target securevault
./scripts/security-check.sh --target infrastructure
```

**Vérifie**:
- Fichiers sensibles (.env, .pem, .key)
- Permissions fichiers (too permissive)
- Certificats SSL/TLS (expiration)
- Docker images (vulnérabilités)
- Logs sensibles (secrets, passwords)

---

## 💾 Scripts Backup

### `backup-to-cloud.sh` - Backup Multi-Cloud

Sauvegarde les données critiques vers AWS S3 et Azure Blob Storage.

```bash
chmod +x scripts/backup-to-cloud.sh

# Backup complet
./scripts/backup-to-cloud.sh

# Backup spécifique
./scripts/backup-to-cloud.sh --target securevault
./scripts/backup-to-cloud.sh --target certificates
```

**Sauvegarde**:
- PostgreSQL databases
- Certificats Let's Encrypt (Traefik)
- Secrets et clés (chiffrés)
- Fichiers configuration importants
- Logs d'audit

**Destinations**:
- **AWS S3**: `s3://freijstack-backups/`
- **Azure Blob**: `freijstackbackups/`

**Configuration requise**:
```bash
# AWS
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."

# Azure
export AZURE_STORAGE_ACCOUNT="..."
export AZURE_STORAGE_KEY="..."
```

**Planification (cron)**:
```bash
# Backup quotidien à 2h du matin
0 2 * * * /path/to/scripts/backup-to-cloud.sh
```

---

## 🚀 Scripts Infrastructure

### `setup-ssh-key.sh` - Configuration SSH

Configure l'authentification par clé SSH pour accès VPS.

```bash
chmod +x scripts/setup-ssh-key.sh

# Configuration interactive
./scripts/setup-ssh-key.sh

# Avec paramètres
./scripts/setup-ssh-key.sh --user deploy --vps 51.178.42.69
```

**Actions**:
1. Génère pair de clés SSH (si absent)
2. Copie clé publique vers VPS
3. Configure `/etc/ssh/sshd_config`
4. Désactive password authentication
5. Teste connexion

---

### `check-vps-staging.ps1` - Santé VPS

Vérifie l'état de santé complet du VPS et services.

```powershell
# Check complet
.\scripts\check-vps-staging.ps1

# Check spécifique
.\scripts\check-vps-staging.ps1 -Component disk
.\scripts\check-vps-staging.ps1 -Component docker
```

**Vérifie**:
- CPU usage
- Mémoire disponible
- Disque libre
- Services Docker (running)
- Connexion réseau
- Certificats SSL (expiration)
- DNS resolution

**Output**: Rapport JSON avec status et alertes.

---

### `fix-network-issue.sh` - Corriger Problèmes Réseau

Diagnostique et corrige les problèmes de connectivité réseau.

```bash
chmod +x scripts/fix-network-issue.sh

# Diagnostic et fix
./scripts/fix-network-issue.sh

# Dry-run (sans modification)
./scripts/fix-network-issue.sh --dry-run
```

**Problèmes corrigés**:
- Interface réseau down
- Routes manquantes
- Firewall rules
- DNS resolution failures
- Docker network issues

---

## 🧪 Scripts Testing & Validation

### `validate-automation.sh` - Valider CI/CD

Valide la configuration des workflows GitHub Actions.

```bash
chmod +x scripts/validate-automation.sh

# Validation complète
./scripts/validate-automation.sh

# Validation un workflow spécifique
./scripts/validate-automation.sh --workflow infrastructure-deploy
```

**Vérifie**:
- YAML syntax (`.github/workflows/`)
- Secrets configurés dans GitHub
- Triggers valides (branches, events)
- Docker images accessibles
- Service accounts authentifiés

---

### `diagnose-cors.sh` - Diagnostic CORS

Diagnostique les problèmes CORS sur SecureVault.

```bash
chmod +x scripts/diagnose-cors.sh

# Diagnostic
./scripts/diagnose-cors.sh

# Test spécifique
./scripts/diagnose-cors.sh --test origin
./scripts/diagnose-cors.sh --test headers
```

**Tests**:
- Preflight requests (OPTIONS)
- CORS headers (Access-Control-*)
- Credentials handling
- SSL/TLS certificate
- Traefik routing

**Output**: Rapport détaillé avec solutions.

---

### `diagnose-registration.ps1` / `.sh` - Diagnostic Registration

Diagnostique les problèmes d'enregistrement (registration) sur SecureVault.

```powershell
# PowerShell version
.\scripts\diagnose-registration.ps1

# Ou version shell
./scripts/diagnose-registration.sh
```

**Vérifie**:
- Database connectivity
- API endpoints available
- Email validation (si applicable)
- Password complexity rules
- Rate limiting

---

## 📊 Scripts Database

### `run-migrations.sh` - Migrations Database

Exécute les migrations SQL pour mettre à jour le schéma database.

```bash
chmod +x scripts/run-migrations.sh

# Exécuter toutes les migrations
./scripts/run-migrations.sh

# Migration spécifique
./scripts/run-migrations.sh --version 002

# Rollback
./scripts/run-migrations.sh --rollback 002
```

**Migrations**:
- `001_add_features.sql` - Features initiales
- `002_pro_features.sql` - Features pro
- ...autres migrations

**Processus**:
1. Backup database (automatique)
2. Exécute migrations en séquence
3. Valide intégrité schéma
4. Logs changements

**Planning**:
- Exécuter hors heures de pointe
- Backup avant d'exécuter
- Test sur staging d'abord

---

## � Scripts Docker Registry

### `deploy-registry.sh` - Déployer Docker Registry

Déploie le Docker Registry sur le VPS.

```bash
chmod +x scripts/deploy-registry.sh

# Déployer production
./scripts/deploy-registry.sh --env production

# Déployer staging
./scripts/deploy-registry.sh --env staging
```

**Actions**:
1. Crée structure de dossiers
2. Configure htpasswd auth
3. Lance docker-compose
4. Vérifie health check
5. Configure Traefik routing

---

### `cleanup-registry-images.sh` - Cleanup Images Registry

Nettoie les anciennes images du Docker Registry.

```bash
chmod +x scripts/cleanup-registry-images.sh

# Cleanup automatique
./scripts/cleanup-registry-images.sh

# Dry-run (voir ce qui serait supprimé)
./scripts/cleanup-registry-images.sh --dry-run

# Cleanup images > 60 jours
./scripts/cleanup-registry-images.sh --days 60
```

**Supprime**:
- Images non-taguées
- Images plus anciennes que X jours
- Layers orphelins

**Planification**:
```bash
# Cleanup hebdomadaire (cron)
0 3 * * 0 /path/to/scripts/cleanup-registry-images.sh
```

---

### `test-registry.sh` - Tester Docker Registry

Teste le bon fonctionnement du Docker Registry.

```bash
chmod +x scripts/test-registry.sh

# Test complet
./scripts/test-registry.sh

# Test production
./scripts/test-registry.sh --env production

# Test staging
./scripts/test-registry.sh --env staging
```

**Tests**:
- Connexion registry API
- Authentication (htpasswd)
- Push/Pull test image
- UI accessible
- HTTPS/TLS valide

---

### `setup-registry-prod-secrets.sh` - Setup Secrets Registry

Configure les secrets pour Docker Registry production.

```bash
chmod +x scripts/setup-registry-prod-secrets.sh

# Setup production
./scripts/setup-registry-prod-secrets.sh
```

**Configure**:
- htpasswd credentials
- TLS certificates
- Storage backend
- Auth tokens

---

## 📦 Scripts Portfolio

### `redeploy-portfolio.ps1` / `.sh` - Redéployer Portfolio

Redéploie le portfolio (staging ou production).

```powershell
# PowerShell version
.\scripts\redeploy-portfolio.ps1 -Environment staging
.\scripts\redeploy-portfolio.ps1 -Environment production

# Shell version
./scripts/redeploy-portfolio.sh staging
./scripts/redeploy-portfolio.sh production
```

**Actions**:
1. Pull latest code
2. Build assets
3. Sync vers VPS
4. Reload nginx
5. Validate deployment

---

### `destroy-portfolio.ps1` - Détruire Portfolio

Supprime complètement le portfolio (cleanup).

```powershell
# Détruire staging
.\scripts\destroy-portfolio.ps1 -Environment staging

# Détruire production (confirmation requise)
.\scripts\destroy-portfolio.ps1 -Environment production -Force
```

**⚠️ Attention**: Action destructive, backup avant d'exécuter.

---

## 🔍 Scripts Réseau

### `check-traefik-network.sh` - Vérifier Réseau Traefik

Vérifie la configuration réseau Docker de Traefik.

```bash
chmod +x scripts/check-traefik-network.sh

# Check réseau
./scripts/check-traefik-network.sh
```

**Vérifie**:
- Réseau `web` existe
- Containers connectés
- Configuration réseau Traefik
- Routing rules

**Fix automatique**: Recrée le réseau si problème détecté.

---

## �📝 Utilisation Courante

### Préparation VPS Initial

```bash
# 1. Configuration SSH
./scripts/setup-ssh-key.sh

# 2. Générer secrets
./scripts/generate-secrets.ps1
# Copier dans .env sur VPS

# 3. Validation infrastructure
./scripts/check-vps-staging.ps1
```

### Maintenance Régulière

```bash
# Audit sécurité (hebdomadaire)
./scripts/security-check.sh

# Backup (quotidien)
./scripts/backup-to-cloud.sh

# Santé VPS (quotidien)
./scripts/check-vps-staging.ps1

# Rotation secrets (mensuel)
./scripts/rotate-secrets.sh
```

### Troubleshooting

```bash
# Problème réseau
./scripts/fix-network-issue.sh

# Problème CORS
./scripts/diagnose-cors.sh

# Problème registration
./scripts/diagnose-registration.sh

# Validation CI/CD
./scripts/validate-automation.sh
```

---

## 🔧 Conditions d'Exécution

### Prérequis

- **Linux/macOS** pour `.sh` scripts
- **Windows PowerShell** pour `.ps1` scripts (ou WSL + bash)
- Accès SSH au VPS
- AWS/Azure credentials (pour backups)
- GitHub token (pour validation CI/CD)

### Permissions

Rendre exécutables:
```bash
chmod +x scripts/*.sh
chmod +x scripts/*.ps1
```

### Logs

Tous les scripts logent dans `/var/log/freijstack/`:
```bash
tail -f /var/log/freijstack/security-check.log
tail -f /var/log/freijstack/backup.log
```

---

## 📚 Documentation Complète

- **Architecture**: [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- **Déploiement**: [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)
- **Sécurité**: [../SECURITY.md](../SECURITY.md)
- **Troubleshooting**: [../docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md)

---

## 🐛 Troubleshooting Scripts

### Script Permission Denied

```bash
chmod +x scripts/script-name.sh
```

### Script Failed (permissions)

```bash
# Exécuter avec sudo si nécessaire
sudo ./scripts/script-name.sh

# Ou avec su
su - root -c "./scripts/script-name.sh"
```

### PowerShell ExecutionPolicy

```powershell
# Si erreur de policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Exécuter script
.\scripts\generate-secrets.ps1
```

---

**Créé par**: Christophe FREIJANES  
**Dernière mise à jour**: Janvier 2026  
**Version**: 1.0.0
