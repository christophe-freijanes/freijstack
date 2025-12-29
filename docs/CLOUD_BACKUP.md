# ☁️ SecureVault - Configuration des Backups Cloud

## 📋 Vue d'Ensemble

SecureVault supporte les backups automatiques vers **6 providers cloud** majeurs :

| Provider | Type | Prix | Vitesse | Fiabilité |
|----------|------|------|---------|-----------|
| **AWS S3** | Object Storage | 💰💰 Moyen | ⚡⚡⚡ Rapide | ⭐⭐⭐⭐⭐ Excellent |
| **Azure Blob** | Object Storage | 💰💰 Moyen | ⚡⚡⚡ Rapide | ⭐⭐⭐⭐⭐ Excellent |
| **Google Cloud** | Object Storage | 💰💰 Moyen | ⚡⚡⚡ Rapide | ⭐⭐⭐⭐⭐ Excellent |
| **Backblaze B2** | Object Storage | 💰 Économique | ⚡⚡ Moyen | ⭐⭐⭐⭐ Très bon |
| **DigitalOcean Spaces** | Object Storage | 💰 Économique | ⚡⚡⚡ Rapide | ⭐⭐⭐⭐ Très bon |
| **Wasabi** | Object Storage | 💰 Économique | ⚡⚡⚡ Rapide | ⭐⭐⭐⭐ Très bon |

---

## 🚀 Configuration Rapide

### 1. AWS S3 (Recommandé pour Production)

**Avantages** : Fiabilité maximale, intégration AWS, durabilité 99.999999999%

```bash
# 1. Créer un bucket S3
aws s3 mb s3://securevault-backups --region us-east-1

# 2. Configurer les variables d'environnement
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_S3_BUCKET="securevault-backups"
export AWS_REGION="us-east-1"

# 3. Lancer le backup
./scripts/backup-to-cloud.sh staging s3
```

**Configuration IAM (sécurisée)** :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::securevault-backups",
        "arn:aws:s3:::securevault-backups/*"
      ]
    }
  ]
}
```

**Lifecycle Policy (rétention automatique)** :

```json
{
  "Rules": [
    {
      "Id": "DeleteOldBackups",
      "Status": "Enabled",
      "Prefix": "securevault/",
      "Expiration": {
        "Days": 30
      },
      "Transitions": [
        {
          "Days": 7,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

---

### 2. Azure Blob Storage

**Avantages** : Intégration Azure, bon pricing, lifecycle management

```bash
# 1. Créer un compte de stockage
az storage account create \
  --name securevaultbackups \
  --resource-group myResourceGroup \
  --location eastus \
  --sku Standard_LRS

# 2. Créer un conteneur
az storage container create \
  --name backups \
  --account-name securevaultbackups

# 3. Récupérer la clé
AZURE_KEY=$(az storage account keys list \
  --account-name securevaultbackups \
  --query '[0].value' -o tsv)

# 4. Configurer les variables
export AZURE_STORAGE_ACCOUNT="securevaultbackups"
export AZURE_STORAGE_KEY="$AZURE_KEY"
export AZURE_CONTAINER="backups"

# 5. Lancer le backup
./scripts/backup-to-cloud.sh staging azure
```

**Lifecycle Management** :

```bash
az storage account management-policy create \
  --account-name securevaultbackups \
  --policy @lifecycle-policy.json
```

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "DeleteOldBackups",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "baseBlob": {
            "delete": {
              "daysAfterModificationGreaterThan": 30
            },
            "tierToCool": {
              "daysAfterModificationGreaterThan": 7
            }
          }
        },
        "filters": {
          "prefixMatch": ["securevault/"]
        }
      }
    }
  ]
}
```

---

### 3. Google Cloud Storage (GCS)

**Avantages** : Multi-régional, excellent pricing, AI/ML intégration

```bash
# 1. Créer un bucket
gsutil mb -c STANDARD -l US gs://securevault-backups/

# 2. Créer un service account
gcloud iam service-accounts create securevault-backup \
  --display-name="SecureVault Backup Account"

# 3. Donner les permissions
gsutil iam ch serviceAccount:securevault-backup@PROJECT_ID.iam.gserviceaccount.com:objectAdmin \
  gs://securevault-backups

# 4. Générer la clé JSON
gcloud iam service-accounts keys create ~/securevault-gcs-key.json \
  --iam-account=securevault-backup@PROJECT_ID.iam.gserviceaccount.com

# 5. Configurer les variables
export GCS_BUCKET="securevault-backups"
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/securevault-gcs-key.json"

# 6. Lancer le backup
./scripts/backup-to-cloud.sh staging gcs
```

**Lifecycle Policy** :

```bash
gsutil lifecycle set lifecycle.json gs://securevault-backups
```

```json
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {
          "age": 30,
          "matchesPrefix": ["securevault/"]
        }
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {
          "age": 7,
          "matchesPrefix": ["securevault/"]
        }
      }
    ]
  }
}
```

---

### 4. Backblaze B2 (Budget-Friendly)

**Avantages** : Très économique ($0.005/GB), téléchargements gratuits, simple

```bash
# 1. Créer un compte sur backblaze.com
# 2. Créer un bucket "securevault-backups"
# 3. Créer une clé d'application

# 4. Configurer les variables
export B2_APPLICATION_KEY_ID="..."
export B2_APPLICATION_KEY="..."
export B2_BUCKET_NAME="securevault-backups"

# 5. Lancer le backup
./scripts/backup-to-cloud.sh staging b2
```

**Lifecycle Rules (via B2 Console)** :

1. Allez dans le bucket → **Lifecycle Settings**
2. Ajoutez une règle :
   - **Keep only the last 30 days of file versions**
   - **Prefix**: `securevault/`

---

### 5. DigitalOcean Spaces (Simple & Abordable)

**Avantages** : Simple, pricing prévisible ($5/mois 250GB), compatible S3

```bash
# 1. Créer un Space sur DigitalOcean
# 2. Générer des clés API

# 3. Configurer les variables
export SPACES_ACCESS_KEY="..."
export SPACES_SECRET_KEY="..."
export SPACES_BUCKET="securevault-backups"
export SPACES_REGION="nyc3"  # ou sfo3, ams3, sgp1, fra1

# 4. Lancer le backup
./scripts/backup-to-cloud.sh staging spaces
```

**Lifecycle Policy** (via API ou console) :

```bash
# Configurer via AWS CLI (Spaces est S3-compatible)
aws s3api put-bucket-lifecycle-configuration \
  --bucket securevault-backups \
  --endpoint-url=https://nyc3.digitaloceanspaces.com \
  --lifecycle-configuration file://lifecycle.json
```

---

### 6. Wasabi (Stockage Rapide)

**Avantages** : Pas de frais de sortie, rapide, pricing simple

```bash
# 1. Créer un compte sur wasabi.com
# 2. Créer un bucket

# 3. Configurer les variables
export WASABI_ACCESS_KEY="..."
export WASABI_SECRET_KEY="..."
export WASABI_BUCKET="securevault-backups"
export WASABI_REGION="us-east-1"  # ou eu-central-1, us-west-1

# 4. Lancer le backup
./scripts/backup-to-cloud.sh staging wasabi
```

---

## 🔄 Backups Automatiques

### Méthode 1 : Cron Job (sur VPS)

```bash
# Éditer le crontab
crontab -e

# Ajouter une ligne pour backup quotidien à 3h du matin
0 3 * * * /srv/www/securevault/scripts/backup-to-cloud.sh production s3 >> /var/log/securevault-backup.log 2>&1

# Backup staging tous les jours à 4h
0 4 * * * /srv/www/securevault-staging/scripts/backup-to-cloud.sh staging s3 >> /var/log/securevault-backup-staging.log 2>&1
```

### Méthode 2 : GitHub Actions (Automatique)

Ajoutez ce workflow dans `.github/workflows/backup.yml` :

```yaml
name: 🔒 Scheduled Backup

on:
  schedule:
    # Tous les jours à 3h UTC
    - cron: '0 3 * * *'
  workflow_dispatch: # Manuel aussi

jobs:
  backup:
    name: 💾 Backup to Cloud
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4
      
      - name: 🔐 Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H ${{ secrets.VPS_SSH_HOST }} >> ~/.ssh/known_hosts
      
      - name: 💾 Run Backup
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_REGION: us-east-1
        run: |
          ssh -i ~/.ssh/deploy_key ${{ secrets.VPS_SSH_USER }}@${{ secrets.VPS_SSH_HOST }} \
            "export AWS_ACCESS_KEY_ID='$AWS_ACCESS_KEY_ID' && \
             export AWS_SECRET_ACCESS_KEY='$AWS_SECRET_ACCESS_KEY' && \
             export AWS_S3_BUCKET='$AWS_S3_BUCKET' && \
             export AWS_REGION='$AWS_REGION' && \
             /srv/www/securevault/scripts/backup-to-cloud.sh production s3"
      
      - name: 📧 Notify on failure
        if: failure()
        run: echo "Backup failed! Check logs."
```

### Méthode 3 : SystemD Timer (Linux moderne)

```bash
# 1. Créer le service
sudo nano /etc/systemd/system/securevault-backup.service
```

```ini
[Unit]
Description=SecureVault Cloud Backup
After=network.target

[Service]
Type=oneshot
User=root
Environment="AWS_ACCESS_KEY_ID=..."
Environment="AWS_SECRET_ACCESS_KEY=..."
Environment="AWS_S3_BUCKET=securevault-backups"
Environment="AWS_REGION=us-east-1"
ExecStart=/srv/www/securevault/scripts/backup-to-cloud.sh production s3
StandardOutput=journal
StandardError=journal
```

```bash
# 2. Créer le timer
sudo nano /etc/systemd/system/securevault-backup.timer
```

```ini
[Unit]
Description=SecureVault Backup Timer
Requires=securevault-backup.service

[Timer]
OnCalendar=daily
OnCalendar=03:00
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
# 3. Activer
sudo systemctl enable securevault-backup.timer
sudo systemctl start securevault-backup.timer

# 4. Vérifier
sudo systemctl status securevault-backup.timer
sudo systemctl list-timers --all
```

---

## 📊 Multi-Cloud Strategy (Recommandé)

Pour une **résilience maximale**, utilisez plusieurs providers :

```bash
# Configuration dans /srv/www/securevault/.backup-env
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_S3_BUCKET="securevault-backups-primary"

export B2_APPLICATION_KEY_ID="..."
export B2_APPLICATION_KEY="..."
export B2_BUCKET_NAME="securevault-backups-secondary"

export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

```bash
# Script de backup multi-cloud
#!/bin/bash
source /srv/www/securevault/.backup-env

# Backup primaire (S3)
./scripts/backup-to-cloud.sh production s3

# Backup secondaire (B2)
./scripts/backup-to-cloud.sh production b2

# Sans provider spécifié, le script upload vers TOUS les providers configurés
./scripts/backup-to-cloud.sh production
```

---

## 🔐 Sécurité des Credentials

### Option 1 : Variables d'Environnement Sécurisées

```bash
# Créer un fichier sécurisé
sudo nano /srv/www/securevault/.backup-env
```

```bash
# AWS
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_S3_BUCKET="securevault-backups"

# Azure
export AZURE_STORAGE_ACCOUNT="securevaultbackups"
export AZURE_STORAGE_KEY="..."
export AZURE_CONTAINER="backups"
```

```bash
# Sécuriser les permissions
sudo chmod 600 /srv/www/securevault/.backup-env
sudo chown root:root /srv/www/securevault/.backup-env

# Utiliser dans cron
0 3 * * * source /srv/www/securevault/.backup-env && /srv/www/securevault/scripts/backup-to-cloud.sh production
```

### Option 2 : GitHub Secrets (pour Actions)

Allez dans **Settings → Secrets and variables → Actions** :

```
AWS_ACCESS_KEY_ID = AKIA...
AWS_SECRET_ACCESS_KEY = ...
AWS_S3_BUCKET = securevault-backups
AZURE_STORAGE_ACCOUNT = securevaultbackups
AZURE_STORAGE_KEY = ...
B2_APPLICATION_KEY_ID = ...
```

### Option 3 : Vault (HashiCorp Vault ou AWS Secrets Manager)

```bash
# Exemple avec AWS Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id securevault/backup-credentials \
  --query SecretString --output text | jq -r '
    .AWS_ACCESS_KEY_ID,
    .AWS_SECRET_ACCESS_KEY,
    .AWS_S3_BUCKET
  '
```

---

## 📈 Monitoring & Alertes

### Slack Notifications

```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX"

# Le script enverra automatiquement des notifications
./scripts/backup-to-cloud.sh production s3
```

### Discord Notifications

```bash
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
./scripts/backup-to-cloud.sh production s3
```

### Email Notifications (via sendmail)

```bash
# Modifier le script pour ajouter :
if [ "$?" -eq 0 ]; then
  echo "Backup succeeded: ${BACKUP_FILE}" | mail -s "✅ SecureVault Backup Success" admin@example.com
else
  echo "Backup failed!" | mail -s "❌ SecureVault Backup Failed" admin@example.com
fi
```

---

## 🔄 Restauration depuis Cloud

### AWS S3

```bash
# Lister les backups
aws s3 ls s3://securevault-backups/securevault/production/

# Télécharger un backup
aws s3 cp s3://securevault-backups/securevault/production/securevault_production_20241229_030000.sql.gz ./

# Décompresser
gunzip securevault_production_20241229_030000.sql.gz

# Restaurer
cd /srv/www/securevault/saas/securevault
docker compose exec -T postgres psql -U postgres -d securevault < securevault_production_20241229_030000.sql
```

### Azure

```bash
az storage blob download \
  --account-name securevaultbackups \
  --container-name backups \
  --name securevault/production/securevault_production_20241229_030000.sql.gz \
  --file backup.sql.gz
```

### GCS

```bash
gsutil cp gs://securevault-backups/securevault/production/securevault_production_20241229_030000.sql.gz ./
```

---

## 💰 Comparaison des Coûts

**Exemple : 10 GB de backups par mois, rétention 30 jours**

| Provider | Stockage | Téléchargement | Total/mois |
|----------|----------|----------------|------------|
| **AWS S3 Standard** | $0.23 | $0.90 (1GB/jour) | ~$1.13 |
| **AWS S3 Glacier** | $0.04 | $1.00 (retrieval) | ~$1.04 |
| **Azure Cool Blob** | $0.10 | $1.00 | ~$1.10 |
| **Google Cloud Standard** | $0.20 | $1.20 | ~$1.40 |
| **Backblaze B2** | **$0.05** | **$0.00** (gratuit) | **$0.05** ⭐ |
| **DigitalOcean Spaces** | **$5** (forfait 250GB) | $0.00 | **$5.00** |
| **Wasabi** | **$0.069** | **$0.00** (gratuit) | **$0.069** ⭐ |

**Recommandation** :
- **Budget limité** : Backblaze B2 ou Wasabi
- **Production critique** : AWS S3 + B2 (multi-cloud)
- **Simplicité** : DigitalOcean Spaces
- **Intégration cloud existante** : Utiliser le provider de votre infrastructure

---

## ✅ Checklist de Déploiement

- [ ] Choisir un provider cloud (ou plusieurs)
- [ ] Créer le bucket/container
- [ ] Générer les credentials (access keys)
- [ ] Configurer les variables d'environnement
- [ ] Tester manuellement : `./scripts/backup-to-cloud.sh staging s3`
- [ ] Configurer le cron job ou GitHub Actions
- [ ] Tester la restauration d'un backup
- [ ] Configurer les notifications (Slack/Discord)
- [ ] Vérifier les lifecycle policies (rétention 30 jours)
- [ ] Documenter les credentials dans un password manager sécurisé

---

## 🆘 Dépannage

### Erreur : "AWS CLI not found"

```bash
# Installer AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Erreur : "Permission denied"

```bash
# Vérifier les credentials
aws s3 ls s3://securevault-backups/  # Test AWS
az storage blob list --account-name securevaultbackups  # Test Azure
```

### Backup vide ou échoue

```bash
# Vérifier que PostgreSQL est accessible
docker compose exec postgres psql -U postgres -c "\l"

# Tester le dump manuellement
docker compose exec postgres pg_dump -U postgres securevault > test.sql
```

### Impossible de supprimer les anciens backups

```bash
# Vérifier les permissions IAM/storage
# Ajouter les droits de suppression (DeleteObject pour S3)
```

---

## 📚 Ressources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Azure Blob Storage](https://docs.microsoft.com/azure/storage/blobs/)
- [Google Cloud Storage](https://cloud.google.com/storage/docs)
- [Backblaze B2 Docs](https://www.backblaze.com/b2/docs/)
- [DigitalOcean Spaces](https://docs.digitalocean.com/products/spaces/)
- [Wasabi Docs](https://wasabi.com/help/)

---

**🎉 Vos données SecureVault sont maintenant protégées dans le cloud !**
