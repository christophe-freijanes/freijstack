#!/bin/bash
#
# 🔒 SecureVault - Automated Cloud Backup Script (HARDENED)
#
# Supports: AWS S3, Azure Blob, Google Cloud Storage, Backblaze B2,
#           DigitalOcean Spaces, Wasabi
#
# Usage: ./backup-to-cloud.sh [staging|production] [provider]
#

set -euo pipefail
set +x 2>/dev/null || true

# If someone enabled xtrace upstream, force-disable it.
if [[ "$(set -o | awk '$1=="xtrace"{print $2}')" == "on" ]]; then
  set +x
fi

# Colors (safe)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Strict permissions for any created file
umask 077

# Configuration
BACKUP_DIR="/tmp/securevault-backups"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Environment
ENV="${1:-staging}"
PROVIDER="${2:-}"

# Directories
if [[ "$ENV" == "production" ]]; then
  DEPLOY_DIR="/srv/www/securevault"
  DB_NAME="securevault"
else
  DEPLOY_DIR="/srv/www/securevault-staging"
  DB_NAME="securevault"
fi

PROJECT_PATH="saas/securevault"

# Runtime vars (set during execution)
TIMESTAMP=""
BACKUP_FILE=""
BACKUP_PATH=""
BACKUP_SIZE=""

# ---------- Logging (never prints secrets) ----------
log()  { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
error(){ echo -e "${RED}✗${NC} $1"; exit 1; }
info() { echo -e "${BLUE}ℹ${NC} $1"; }

# Best-effort masking for GitHub Actions logs
mask_if_actions() {
  [[ "${GITHUB_ACTIONS:-}" == "true" ]] || return 0
  for v in \
    AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_S3_BUCKET AWS_REGION \
    AZURE_STORAGE_ACCOUNT AZURE_STORAGE_KEY AZURE_CONTAINER \
    GOOGLE_APPLICATION_CREDENTIALS GCS_BUCKET \
    B2_APPLICATION_KEY_ID B2_APPLICATION_KEY B2_BUCKET_NAME \
    SPACES_ACCESS_KEY SPACES_SECRET_KEY SPACES_BUCKET SPACES_REGION \
    WASABI_ACCESS_KEY WASABI_SECRET_KEY WASABI_BUCKET WASABI_REGION \
    SLACK_WEBHOOK_URL DISCORD_WEBHOOK_URL
  do
    local val="${!v:-}"
    if [[ -n "$val" ]]; then
      echo "::add-mask::$val"
    fi
  done
}

cleanup_local_files() {
  # Remove backup archive if still present
  if [[ -n "${BACKUP_PATH:-}" && -f "${BACKUP_PATH:-}" ]]; then
    rm -f "$BACKUP_PATH"
  fi
  # Remove any leftover uncompressed dump
  if [[ -n "${BACKUP_PATH:-}" && -f "${BACKUP_PATH:-%.gz}" ]]; then
    rm -f "${BACKUP_PATH%.gz}"
  fi
}

on_exit() {
  local code=$?
  cleanup_local_files
  exit "$code"
}
trap on_exit EXIT

# ---------- Validation ----------
validate_env_arg() {
  case "$ENV" in
    staging|production) ;;
    *) error "Invalid environment '$ENV' (expected staging|production)" ;;
  esac
}

validate_provider_arg() {
  [[ -z "$PROVIDER" ]] && return 0
  case "$PROVIDER" in
    s3|aws|azure|gcs|gcp|google|b2|backblaze|spaces|digitalocean|wasabi) ;;
    *) error "Unknown provider: $PROVIDER. Supported: s3, azure, gcs, b2, spaces, wasabi" ;;
  esac
}

# Check if running in correct directory
check_environment() {
  info "Checking environment: $ENV"

  [[ -d "$DEPLOY_DIR" ]] || error "Deployment directory not found: $DEPLOY_DIR"
  [[ -d "$DEPLOY_DIR/$PROJECT_PATH" ]] || error "Project path not found: $DEPLOY_DIR/$PROJECT_PATH"

  log "Environment validated"
}

# Create backup directory
setup_backup_dir() {
  mkdir -p "$BACKUP_DIR"
  chmod 700 "$BACKUP_DIR" || true
  log "Backup directory ready: $BACKUP_DIR"
}

# ---------- Backup ----------
create_backup() {
  info "Creating PostgreSQL backup..."

  TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
  BACKUP_FILE="securevault_${ENV}_${TIMESTAMP}.sql"
  BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

  cd "$DEPLOY_DIR/$PROJECT_PATH"

  # Ensure compose exists
  docker compose ps >/dev/null 2>&1 || warn "docker compose ps failed (continuing)"

  # Dump (no secrets printed). If pg_dump fails, script fails due to set -e.
  docker compose exec -T postgres pg_dump -U postgres -d "$DB_NAME" > "$BACKUP_PATH"

  [[ -s "$BACKUP_PATH" ]] || error "Backup file is empty or failed to create"

  # Compress
  gzip -f "$BACKUP_PATH"
  BACKUP_PATH="${BACKUP_PATH}.gz"
  BACKUP_FILE="${BACKUP_FILE}.gz"

  BACKUP_SIZE="$(du -h "$BACKUP_PATH" | awk '{print $1}')"
  log "Backup created: $BACKUP_FILE (${BACKUP_SIZE})"
}

# ---------- Helpers ----------
require_cmd() {
  command -v "$1" >/dev/null 2>&1 || error "Missing dependency: $1"
}

install_aws_cli_if_missing() {
  if command -v aws >/dev/null 2>&1; then
    return 0
  fi

  warn "AWS CLI not installed. Installing (quiet)..."
  require_cmd curl
  require_cmd unzip

  local tmpdir
  tmpdir="$(mktemp -d)"
  chmod 700 "$tmpdir" || true

  curl -sS "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "${tmpdir}/awscliv2.zip"
  unzip -q "${tmpdir}/awscliv2.zip" -d "$tmpdir"
  sudo "${tmpdir}/aws/install" >/dev/null 2>&1 || true

  rm -rf "$tmpdir"
  command -v aws >/dev/null 2>&1 || error "AWS CLI install failed"
}

# ---------- Upload: AWS S3 ----------
upload_to_s3() {
  info "Uploading to AWS S3..."

  [[ -n "${AWS_ACCESS_KEY_ID:-}" && -n "${AWS_SECRET_ACCESS_KEY:-}" && -n "${AWS_S3_BUCKET:-}" ]] \
    || error "Missing AWS credentials. Set: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET"

  install_aws_cli_if_missing

  local region="${AWS_REGION:-us-east-1}"
  local s3_path="s3://${AWS_S3_BUCKET}/securevault/${ENV}/${BACKUP_FILE}"

  # Upload
  aws s3 cp "$BACKUP_PATH" "$s3_path" --region "$region" >/dev/null
  log "Uploaded to S3: $s3_path"

  # Cleanup old backups (best effort)
  info "Cleaning up backups older than ${RETENTION_DAYS} days (S3)..."
  local cutoff_date
  cutoff_date="$(date -d "${RETENTION_DAYS} days ago" +%Y%m%d 2>/dev/null || date -v-"${RETENTION_DAYS}"d +%Y%m%d)"

  aws s3 ls "s3://${AWS_S3_BUCKET}/securevault/${ENV}/" --region "$region" \
    | awk '{print $4}' \
    | while read -r name; do
        [[ -z "$name" ]] && continue
        local backup_date
        backup_date="$(echo "$name" | grep -oE '[0-9]{8}' | head -n1 || true)"
        if [[ -n "$backup_date" && "$backup_date" -lt "$cutoff_date" ]]; then
          info "Deleting old backup: $name"
          aws s3 rm "s3://${AWS_S3_BUCKET}/securevault/${ENV}/${name}" --region "$region" >/dev/null || true
        fi
      done

  log "S3 backup complete"
}

# ---------- Upload: Azure ----------
upload_to_azure() {
  info "Uploading to Azure Blob Storage..."

  [[ -n "${AZURE_STORAGE_ACCOUNT:-}" && -n "${AZURE_STORAGE_KEY:-}" && -n "${AZURE_CONTAINER:-}" ]] \
    || error "Missing Azure credentials. Set: AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_KEY, AZURE_CONTAINER"

  require_cmd curl
  require_cmd jq

  if ! command -v az >/dev/null 2>&1; then
    warn "Azure CLI not installed. Installing (quiet)..."
    curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash >/dev/null 2>&1 || error "Azure CLI install failed"
  fi

  az storage blob upload \
    --account-name "$AZURE_STORAGE_ACCOUNT" \
    --account-key "$AZURE_STORAGE_KEY" \
    --container-name "$AZURE_CONTAINER" \
    --name "securevault/${ENV}/${BACKUP_FILE}" \
    --file "$BACKUP_PATH" \
    --overwrite >/dev/null

  log "Uploaded to Azure: ${AZURE_STORAGE_ACCOUNT}/${AZURE_CONTAINER}/securevault/${ENV}/${BACKUP_FILE}"

  # Cleanup old backups (best effort)
  info "Cleaning up backups older than ${RETENTION_DAYS} days (Azure)..."
  local cutoff_ts
  cutoff_ts="$(date -d "${RETENTION_DAYS} days ago" +%s 2>/dev/null || date -v-"${RETENTION_DAYS}"d +%s)"

  az storage blob list \
    --account-name "$AZURE_STORAGE_ACCOUNT" \
    --account-key "$AZURE_STORAGE_KEY" \
    --container-name "$AZURE_CONTAINER" \
    --prefix "securevault/${ENV}/" \
    --query "[].{name:name,lastModified:properties.lastModified}" \
    --output json \
    | jq -r '.[] | "\(.lastModified)\t\(.name)"' \
    | while IFS=$'\t' read -r modified name; do
        [[ -z "$modified" || -z "$name" ]] && continue
        local blob_ts
        blob_ts="$(date -d "$modified" +%s 2>/dev/null || true)"
        [[ -z "$blob_ts" ]] && continue
        if [[ "$blob_ts" -lt "$cutoff_ts" ]]; then
          info "Deleting old backup: $name"
          az storage blob delete \
            --account-name "$AZURE_STORAGE_ACCOUNT" \
            --account-key "$AZURE_STORAGE_KEY" \
            --container-name "$AZURE_CONTAINER" \
            --name "$name" >/dev/null || true
        fi
      done

  log "Azure backup complete"
}

# ---------- Upload: GCS ----------
upload_to_gcs() {
  info "Uploading to Google Cloud Storage..."

  [[ -n "${GCS_BUCKET:-}" ]] || error "Missing GCS bucket name. Set: GCS_BUCKET"
  [[ -n "${GOOGLE_APPLICATION_CREDENTIALS:-}" ]] || error "Missing GCS credentials. Set: GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)"
  [[ -f "${GOOGLE_APPLICATION_CREDENTIALS}" ]] || error "GOOGLE_APPLICATION_CREDENTIALS file not found at: ${GOOGLE_APPLICATION_CREDENTIALS}"

  # Non-interactive: require gsutil present (recommended to preinstall on VPS)
  command -v gsutil >/dev/null 2>&1 || error "gsutil not found. Install Google Cloud SDK (non-interactive) on the VPS."

  # Activate service account quietly
  command -v gcloud >/dev/null 2>&1 || warn "gcloud not found; gsutil may still work if configured. Continuing..."
  if command -v gcloud >/dev/null 2>&1; then
    gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS" >/dev/null 2>&1 || error "gcloud auth failed"
  fi

  local gcs_path="gs://${GCS_BUCKET}/securevault/${ENV}/${BACKUP_FILE}"
  gsutil cp "$BACKUP_PATH" "$gcs_path" >/dev/null
  log "Uploaded to GCS: $gcs_path"

  # Cleanup old backups (best effort)
  info "Cleaning up backups older than ${RETENTION_DAYS} days (GCS)..."
  local cutoff_ts
  cutoff_ts="$(date -d "${RETENTION_DAYS} days ago" +%s 2>/dev/null || date -v-"${RETENTION_DAYS}"d +%s)"

  # gsutil -l output: size timestamp url
  gsutil ls -l "gs://${GCS_BUCKET}/securevault/${ENV}/" 2>/dev/null \
    | awk '{print $2, $3}' \
    | while read -r ts url; do
        [[ -z "$ts" || -z "$url" ]] && continue
        local obj_ts
        obj_ts="$(date -d "$ts" +%s 2>/dev/null || true)"
        [[ -z "$obj_ts" ]] && continue
        if [[ "$obj_ts" -lt "$cutoff_ts" ]]; then
          info "Deleting old backup: $url"
          gsutil rm "$url" >/dev/null || true
        fi
      done

  log "GCS backup complete"
}

# ---------- Upload: B2 ----------
upload_to_b2() {
  info "Uploading to Backblaze B2..."

  [[ -n "${B2_APPLICATION_KEY_ID:-}" && -n "${B2_APPLICATION_KEY:-}" && -n "${B2_BUCKET_NAME:-}" ]] \
    || error "Missing B2 credentials. Set: B2_APPLICATION_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME"

  if ! command -v b2 >/dev/null 2>&1; then
    warn "B2 CLI not installed. Installing..."
    require_cmd pip
    pip install -q b2 || error "Failed to install b2"
  fi

  b2 authorize-account "$B2_APPLICATION_KEY_ID" "$B2_APPLICATION_KEY" >/dev/null
  b2 upload-file "$B2_BUCKET_NAME" "$BACKUP_PATH" "securevault/${ENV}/${BACKUP_FILE}" >/dev/null

  log "Uploaded to B2: ${B2_BUCKET_NAME}/securevault/${ENV}/${BACKUP_FILE}"
  info "Note: Prefer lifecycle rules in B2 for retention cleanup."
  log "B2 backup complete"
}

# ---------- Upload: DigitalOcean Spaces ----------
upload_to_spaces() {
  info "Uploading to DigitalOcean Spaces..."

  [[ -n "${SPACES_ACCESS_KEY:-}" && -n "${SPACES_SECRET_KEY:-}" && -n "${SPACES_BUCKET:-}" && -n "${SPACES_REGION:-}" ]] \
    || error "Missing Spaces credentials. Set: SPACES_ACCESS_KEY, SPACES_SECRET_KEY, SPACES_BUCKET, SPACES_REGION"

  install_aws_cli_if_missing

  local endpoint="https://${SPACES_REGION}.digitaloceanspaces.com"
  local dest="s3://${SPACES_BUCKET}/securevault/${ENV}/${BACKUP_FILE}"

  AWS_ACCESS_KEY_ID="$SPACES_ACCESS_KEY" AWS_SECRET_ACCESS_KEY="$SPACES_SECRET_KEY" \
    aws s3 cp "$BACKUP_PATH" "$dest" --endpoint-url="$endpoint" >/dev/null

  log "Uploaded to Spaces: ${SPACES_BUCKET}/securevault/${ENV}/${BACKUP_FILE}"

  log "Spaces backup complete"
}

# ---------- Upload: Wasabi ----------
upload_to_wasabi() {
  info "Uploading to Wasabi..."

  [[ -n "${WASABI_ACCESS_KEY:-}" && -n "${WASABI_SECRET_KEY:-}" && -n "${WASABI_BUCKET:-}" && -n "${WASABI_REGION:-}" ]] \
    || error "Missing Wasabi credentials. Set: WASABI_ACCESS_KEY, WASABI_SECRET_KEY, WASABI_BUCKET, WASABI_REGION"

  install_aws_cli_if_missing

  local endpoint="https://s3.${WASABI_REGION}.wasabisys.com"
  local dest="s3://${WASABI_BUCKET}/securevault/${ENV}/${BACKUP_FILE}"

  AWS_ACCESS_KEY_ID="$WASABI_ACCESS_KEY" AWS_SECRET_ACCESS_KEY="$WASABI_SECRET_KEY" \
    aws s3 cp "$BACKUP_PATH" "$dest" --endpoint-url="$endpoint" >/dev/null

  log "Uploaded to Wasabi: ${WASABI_BUCKET}/securevault/${ENV}/${BACKUP_FILE}"
  log "Wasabi backup complete"
}

# Cleanup local backup only (trap handles it too)
cleanup_local() {
  info "Cleaning up local backup..."
  cleanup_local_files
  log "Local backup removed"
}

# Send notification (never prints secrets; silent curl)
send_notification() {
  local status=$1
  local message=$2

  if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
    curl -sS -X POST -H 'Content-type: application/json' \
      --data "{\"text\":\"🔒 SecureVault Backup [$ENV] - $status\n$message\"}" \
      "$SLACK_WEBHOOK_URL" >/dev/null 2>&1 || true
  fi

  if [[ -n "${DISCORD_WEBHOOK_URL:-}" ]]; then
    curl -sS -X POST -H 'Content-type: application/json' \
      --data "{\"content\":\"🔒 SecureVault Backup [$ENV] - $status\n$message\"}" \
      "$DISCORD_WEBHOOK_URL" >/dev/null 2>&1 || true
  fi
}

# ---------- Main ----------
main() {
  echo ""
  echo "======================================"
  echo "🔒 SecureVault Cloud Backup (HARDENED)"
  echo "======================================"
  echo ""

  validate_env_arg
  validate_provider_arg
  mask_if_actions

  check_environment
  setup_backup_dir
  create_backup

  # Upload to cloud(s)
  if [[ -z "$PROVIDER" ]]; then
    info "No provider specified, auto-detecting from environment variables..."

    if [[ -n "${AWS_S3_BUCKET:-}" ]]; then upload_to_s3; fi
    if [[ -n "${AZURE_CONTAINER:-}" ]]; then upload_to_azure; fi
    if [[ -n "${GCS_BUCKET:-}" ]]; then upload_to_gcs; fi
    if [[ -n "${B2_BUCKET_NAME:-}" ]]; then upload_to_b2; fi
    if [[ -n "${SPACES_BUCKET:-}" ]]; then upload_to_spaces; fi
    if [[ -n "${WASABI_BUCKET:-}" ]]; then upload_to_wasabi; fi
  else
    case "$PROVIDER" in
      s3|aws) upload_to_s3 ;;
      azure) upload_to_azure ;;
      gcs|gcp|google) upload_to_gcs ;;
      b2|backblaze) upload_to_b2 ;;
      spaces|digitalocean) upload_to_spaces ;;
      wasabi) upload_to_wasabi ;;
    esac
  fi

  cleanup_local

  echo ""
  log "Backup completed successfully!"
  send_notification "SUCCESS" "Backup: ${BACKUP_FILE} (${BACKUP_SIZE})"
}

# Help
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: $0 [environment] [provider]"
  echo ""
  echo "Arguments:"
  echo "  environment    staging or production (default: staging)"
  echo "  provider       s3, azure, gcs, b2, spaces, wasabi (default: auto-detect)"
  exit 0
fi

main
