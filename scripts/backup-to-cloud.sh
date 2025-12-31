#!/bin/bash
#
# 🔒 SecureVault - Automated Cloud Backup Script
# 
# Supports: AWS S3, Azure Blob, Google Cloud Storage, Backblaze B2, 
#           DigitalOcean Spaces, Wasabi
#
# Usage: ./backup-to-cloud.sh [staging|production] [provider]
#

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="/tmp/securevault-backups"
RETENTION_DAYS=30

# Environment
ENV="${1:-staging}"
PROVIDER="${2:-}"

# Directories
if [ "$ENV" = "production" ]; then
    DEPLOY_DIR="/srv/www/securevault"
    DB_NAME="securevault"
else
    DEPLOY_DIR="/srv/www/securevault-staging"
    DB_NAME="securevault"
fi

PROJECT_PATH="saas/securevault"

# Functions
log() {
    echo -e "${GREEN}✓${NC} $1"
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if running in correct directory
check_environment() {
    info "Checking environment: $ENV"
    
    if [ ! -d "$DEPLOY_DIR" ]; then
        error "Deployment directory not found: $DEPLOY_DIR"
    fi
    
    if [ ! -d "$DEPLOY_DIR/$PROJECT_PATH" ]; then
        error "Project path not found: $DEPLOY_DIR/$PROJECT_PATH"
    fi
    
    log "Environment validated"
}

# Create backup directory
setup_backup_dir() {
    mkdir -p "$BACKUP_DIR"
    log "Backup directory ready: $BACKUP_DIR"
}

# Create PostgreSQL backup
create_backup() {
    info "Creating PostgreSQL backup..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="securevault_${ENV}_${TIMESTAMP}.sql"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"
    
    cd "$DEPLOY_DIR/$PROJECT_PATH"
    
    # Create SQL dump
    docker compose exec -T postgres pg_dump -U postgres -d "$DB_NAME" > "$BACKUP_PATH"
    
    if [ ! -s "$BACKUP_PATH" ]; then
        error "Backup file is empty or failed to create"
    fi
    
    # Compress backup
    gzip "$BACKUP_PATH"
    BACKUP_PATH="${BACKUP_PATH}.gz"
    BACKUP_FILE="${BACKUP_FILE}.gz"
    
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    log "Backup created: $BACKUP_FILE (${BACKUP_SIZE})"
    
    # Export for other functions
    export BACKUP_FILE BACKUP_PATH BACKUP_SIZE
}

# Upload to AWS S3
upload_to_s3() {
    info "Uploading to AWS S3..."
    
    if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_S3_BUCKET" ]; then
        error "Missing AWS credentials. Set: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET"
    fi
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        warn "AWS CLI not installed, installing..."
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip -q awscliv2.zip
        sudo ./aws/install
        rm -rf aws awscliv2.zip
    fi
    
    # Configure AWS CLI
    export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
    AWS_REGION="${AWS_REGION:-us-east-1}"
    
    # Upload
    S3_PATH="s3://${AWS_S3_BUCKET}/securevault/${ENV}/${BACKUP_FILE}"
    aws s3 cp "$BACKUP_PATH" "$S3_PATH" --region "$AWS_REGION"
    
    log "Uploaded to S3: $S3_PATH"
    
    # Cleanup old backups
    info "Cleaning up backups older than ${RETENTION_DAYS} days..."
    CUTOFF_DATE=$(date -d "${RETENTION_DAYS} days ago" +%Y%m%d 2>/dev/null || date -v-${RETENTION_DAYS}d +%Y%m%d)
    
    aws s3 ls "s3://${AWS_S3_BUCKET}/securevault/${ENV}/" --region "$AWS_REGION" | while read -r line; do
        BACKUP_DATE=$(echo "$line" | awk '{print $4}' | grep -oP '\d{8}' | head -n1)
        BACKUP_NAME=$(echo "$line" | awk '{print $4}')
        
        if [ -n "$BACKUP_DATE" ] && [ "$BACKUP_DATE" -lt "$CUTOFF_DATE" ]; then
            info "Deleting old backup: $BACKUP_NAME"
            aws s3 rm "s3://${AWS_S3_BUCKET}/securevault/${ENV}/${BACKUP_NAME}" --region "$AWS_REGION"
        fi
    done
    
    log "S3 backup complete"
}

# Upload to Azure Blob Storage
upload_to_azure() {
    info "Uploading to Azure Blob Storage..."
    
    if [ -z "$AZURE_STORAGE_ACCOUNT" ] || [ -z "$AZURE_STORAGE_KEY" ] || [ -z "$AZURE_CONTAINER" ]; then
        error "Missing Azure credentials. Set: AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_KEY, AZURE_CONTAINER"
    fi
    
    # Check if Azure CLI is installed
    if ! command -v az &> /dev/null; then
        warn "Azure CLI not installed, installing..."
        curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
    fi
    
    # Upload
    az storage blob upload \
        --account-name "$AZURE_STORAGE_ACCOUNT" \
        --account-key "$AZURE_STORAGE_KEY" \
        --container-name "$AZURE_CONTAINER" \
        --name "securevault/${ENV}/${BACKUP_FILE}" \
        --file "$BACKUP_PATH" \
        --overwrite
    
    log "Uploaded to Azure: ${AZURE_STORAGE_ACCOUNT}/${AZURE_CONTAINER}/securevault/${ENV}/${BACKUP_FILE}"
    
    # Cleanup old backups
    info "Cleaning up backups older than ${RETENTION_DAYS} days..."
    CUTOFF_TIMESTAMP=$(date -d "${RETENTION_DAYS} days ago" +%s 2>/dev/null || date -v-${RETENTION_DAYS}d +%s)
    
    az storage blob list \
        --account-name "$AZURE_STORAGE_ACCOUNT" \
        --account-key "$AZURE_STORAGE_KEY" \
        --container-name "$AZURE_CONTAINER" \
        --prefix "securevault/${ENV}/" \
        --query "[].{name:name,lastModified:properties.lastModified}" \
        --output json | jq -r '.[] | "\(.lastModified)\t\(.name)"' | while IFS=$'\t' read -r modified name; do
        
        BLOB_TIMESTAMP=$(date -d "$modified" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S" "$modified" +%s)
        
        if [ "$BLOB_TIMESTAMP" -lt "$CUTOFF_TIMESTAMP" ]; then
            info "Deleting old backup: $name"
            az storage blob delete \
                --account-name "$AZURE_STORAGE_ACCOUNT" \
                --account-key "$AZURE_STORAGE_KEY" \
                --container-name "$AZURE_CONTAINER" \
                --name "$name"
        fi
    done
    
    log "Azure backup complete"
}

# Upload to Google Cloud Storage
upload_to_gcs() {
    info "Uploading to Google Cloud Storage..."
    
    if [ -z "$GCS_BUCKET" ]; then
        error "Missing GCS bucket name. Set: GCS_BUCKET"
    fi
    
    if [ -z "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
        error "Missing GCS credentials. Set: GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)"
    fi
    
    # Check if gcloud is installed
    if ! command -v gsutil &> /dev/null; then
        warn "Google Cloud SDK not installed, installing..."
        curl https://sdk.cloud.google.com | bash
        exec -l $SHELL
        gcloud init
    fi
    
    # Authenticate
    gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
    
    # Upload
    GCS_PATH="gs://${GCS_BUCKET}/securevault/${ENV}/${BACKUP_FILE}"
    gsutil cp "$BACKUP_PATH" "$GCS_PATH"
    
    log "Uploaded to GCS: $GCS_PATH"
    
    # Cleanup old backups
    info "Cleaning up backups older than ${RETENTION_DAYS} days..."
    gsutil ls -l "gs://${GCS_BUCKET}/securevault/${ENV}/" | awk '{print $2, $3}' | while read -r date backup_path; do
        if [ -n "$date" ]; then
            BACKUP_TIMESTAMP=$(date -d "$date" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S" "$date" +%s)
            CUTOFF_TIMESTAMP=$(date -d "${RETENTION_DAYS} days ago" +%s 2>/dev/null || date -v-${RETENTION_DAYS}d +%s)
            
            if [ "$BACKUP_TIMESTAMP" -lt "$CUTOFF_TIMESTAMP" ]; then
                info "Deleting old backup: $backup_path"
                gsutil rm "$backup_path"
            fi
        fi
    done
    
    log "GCS backup complete"
}

# Upload to Backblaze B2
upload_to_b2() {
    info "Uploading to Backblaze B2..."
    
    if [ -z "$B2_APPLICATION_KEY_ID" ] || [ -z "$B2_APPLICATION_KEY" ] || [ -z "$B2_BUCKET_NAME" ]; then
        error "Missing B2 credentials. Set: B2_APPLICATION_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME"
    fi
    
    # Check if b2 CLI is installed
    if ! command -v b2 &> /dev/null; then
        warn "B2 CLI not installed, installing..."
        pip install b2
    fi
    
    # Authenticate
    b2 authorize-account "$B2_APPLICATION_KEY_ID" "$B2_APPLICATION_KEY"
    
    # Upload
    b2 upload-file "$B2_BUCKET_NAME" "$BACKUP_PATH" "securevault/${ENV}/${BACKUP_FILE}"
    
    log "Uploaded to B2: ${B2_BUCKET_NAME}/securevault/${ENV}/${BACKUP_FILE}"
    
    # Cleanup (B2 has lifecycle rules, but we can also do manual cleanup)
    info "Note: Configure lifecycle rules in B2 console for automatic cleanup"
    
    log "B2 backup complete"
}

# Upload to DigitalOcean Spaces
upload_to_spaces() {
    info "Uploading to DigitalOcean Spaces..."
    
    if [ -z "$SPACES_ACCESS_KEY" ] || [ -z "$SPACES_SECRET_KEY" ] || [ -z "$SPACES_BUCKET" ] || [ -z "$SPACES_REGION" ]; then
        error "Missing Spaces credentials. Set: SPACES_ACCESS_KEY, SPACES_SECRET_KEY, SPACES_BUCKET, SPACES_REGION"
    fi
    
    # Use AWS CLI with Spaces endpoint
    export AWS_ACCESS_KEY_ID="$SPACES_ACCESS_KEY"
    export AWS_SECRET_ACCESS_KEY="$SPACES_SECRET_KEY"
    SPACES_ENDPOINT="https://${SPACES_REGION}.digitaloceanspaces.com"
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        warn "AWS CLI not installed, installing..."
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip -q awscliv2.zip
        sudo ./aws/install
        rm -rf aws awscliv2.zip
    fi
    
    # Upload
    aws s3 cp "$BACKUP_PATH" "s3://${SPACES_BUCKET}/securevault/${ENV}/${BACKUP_FILE}" \
        --endpoint-url="$SPACES_ENDPOINT"
    
    log "Uploaded to Spaces: ${SPACES_BUCKET}/securevault/${ENV}/${BACKUP_FILE}"
    
    # Cleanup old backups
    info "Cleaning up backups older than ${RETENTION_DAYS} days..."
    CUTOFF_DATE=$(date -d "${RETENTION_DAYS} days ago" +%Y%m%d 2>/dev/null || date -v-${RETENTION_DAYS}d +%Y%m%d)
    
    aws s3 ls "s3://${SPACES_BUCKET}/securevault/${ENV}/" --endpoint-url="$SPACES_ENDPOINT" | while read -r line; do
        BACKUP_DATE=$(echo "$line" | awk '{print $4}' | grep -oP '\d{8}' | head -n1)
        BACKUP_NAME=$(echo "$line" | awk '{print $4}')
        
        if [ -n "$BACKUP_DATE" ] && [ "$BACKUP_DATE" -lt "$CUTOFF_DATE" ]; then
            info "Deleting old backup: $BACKUP_NAME"
            aws s3 rm "s3://${SPACES_BUCKET}/securevault/${ENV}/${BACKUP_NAME}" --endpoint-url="$SPACES_ENDPOINT"
        fi
    done
    
    log "Spaces backup complete"
}

# Upload to Wasabi
upload_to_wasabi() {
    info "Uploading to Wasabi..."
    
    if [ -z "$WASABI_ACCESS_KEY" ] || [ -z "$WASABI_SECRET_KEY" ] || [ -z "$WASABI_BUCKET" ] || [ -z "$WASABI_REGION" ]; then
        error "Missing Wasabi credentials. Set: WASABI_ACCESS_KEY, WASABI_SECRET_KEY, WASABI_BUCKET, WASABI_REGION"
    fi
    
    # Use AWS CLI with Wasabi endpoint
    export AWS_ACCESS_KEY_ID="$WASABI_ACCESS_KEY"
    export AWS_SECRET_ACCESS_KEY="$WASABI_SECRET_KEY"
    WASABI_ENDPOINT="https://s3.${WASABI_REGION}.wasabisys.com"
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        warn "AWS CLI not installed, installing..."
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip -q awscliv2.zip
        sudo ./aws/install
        rm -rf aws awscliv2.zip
    fi
    
    # Upload
    aws s3 cp "$BACKUP_PATH" "s3://${WASABI_BUCKET}/securevault/${ENV}/${BACKUP_FILE}" \
        --endpoint-url="$WASABI_ENDPOINT"
    
    log "Uploaded to Wasabi: ${WASABI_BUCKET}/securevault/${ENV}/${BACKUP_FILE}"
    
    log "Wasabi backup complete"
}

# Cleanup local backup
cleanup_local() {
    info "Cleaning up local backup..."
    rm -f "$BACKUP_PATH"
    log "Local backup removed"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🔒 SecureVault Backup [$ENV] - $status\n$message\"}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi
    
    if [ -n "$DISCORD_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"content\":\"🔒 SecureVault Backup [$ENV] - $status\n$message\"}" \
            "$DISCORD_WEBHOOK_URL" 2>/dev/null || true
    fi
}

# Main execution
main() {
    echo ""
    echo "======================================"
    echo "🔒 SecureVault Cloud Backup"
    echo "======================================"
    echo ""
    
    # Validate
    check_environment
    setup_backup_dir
    
    # Create backup
    create_backup
    
    # Upload to cloud(s)
    if [ -z "$PROVIDER" ]; then
        info "No provider specified, checking environment variables..."
        
        # Try all configured providers
        [ -n "$AWS_S3_BUCKET" ] && upload_to_s3
        [ -n "$AZURE_CONTAINER" ] && upload_to_azure
        [ -n "$GCS_BUCKET" ] && upload_to_gcs
        [ -n "$B2_BUCKET_NAME" ] && upload_to_b2
        [ -n "$SPACES_BUCKET" ] && upload_to_spaces
        [ -n "$WASABI_BUCKET" ] && upload_to_wasabi
        
    else
        case "$PROVIDER" in
            s3|aws)
                upload_to_s3
                ;;
            azure)
                upload_to_azure
                ;;
            gcs|gcp|google)
                upload_to_gcs
                ;;
            b2|backblaze)
                upload_to_b2
                ;;
            spaces|digitalocean)
                upload_to_spaces
                ;;
            wasabi)
                upload_to_wasabi
                ;;
            *)
                error "Unknown provider: $PROVIDER. Supported: s3, azure, gcs, b2, spaces, wasabi"
                ;;
        esac
    fi
    
    # Cleanup
    cleanup_local
    
    echo ""
    log "Backup completed successfully!"
    send_notification "SUCCESS" "Backup: ${BACKUP_FILE} (${BACKUP_SIZE})"
}

# Show usage
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [environment] [provider]"
    echo ""
    echo "Arguments:"
    echo "  environment    staging or production (default: staging)"
    echo "  provider       s3, azure, gcs, b2, spaces, wasabi (default: auto-detect)"
    echo ""
    echo "Supported Providers:"
    echo "  - AWS S3 (s3/aws)"
    echo "  - Azure Blob Storage (azure)"
    echo "  - Google Cloud Storage (gcs/gcp/google)"
    echo "  - Backblaze B2 (b2/backblaze)"
    echo "  - DigitalOcean Spaces (spaces/digitalocean)"
    echo "  - Wasabi (wasabi)"
    echo ""
    echo "Environment Variables:"
    echo "  AWS S3:"
    echo "    - AWS_ACCESS_KEY_ID"
    echo "    - AWS_SECRET_ACCESS_KEY"
    echo "    - AWS_S3_BUCKET"
    echo "    - AWS_REGION (optional, default: us-east-1)"
    echo ""
    echo "  Azure:"
    echo "    - AZURE_STORAGE_ACCOUNT"
    echo "    - AZURE_STORAGE_KEY"
    echo "    - AZURE_CONTAINER"
    echo ""
    echo "  Google Cloud:"
    echo "    - GCS_BUCKET"
    echo "    - GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)"
    echo ""
    echo "  Backblaze B2:"
    echo "    - B2_APPLICATION_KEY_ID"
    echo "    - B2_APPLICATION_KEY"
    echo "    - B2_BUCKET_NAME"
    echo ""
    echo "  DigitalOcean Spaces:"
    echo "    - SPACES_ACCESS_KEY"
    echo "    - SPACES_SECRET_KEY"
    echo "    - SPACES_BUCKET"
    echo "    - SPACES_REGION (e.g., nyc3, sfo3)"
    echo ""
    echo "  Wasabi:"
    echo "    - WASABI_ACCESS_KEY"
    echo "    - WASABI_SECRET_KEY"
    echo "    - WASABI_BUCKET"
    echo "    - WASABI_REGION (e.g., us-east-1, eu-central-1)"
    echo ""
    echo "  Notifications (optional):"
    echo "    - SLACK_WEBHOOK_URL"
    echo "    - DISCORD_WEBHOOK_URL"
    echo ""
    echo "Examples:"
    echo "  $0 staging s3"
    echo "  $0 production azure"
    echo "  $0 staging           # Auto-detect all configured providers"
    exit 0
fi

# Run
main
