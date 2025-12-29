#!/usr/bin/env pwsh
# 🔐 Secret Generator for SecureVault
# Génère les secrets pour les fichiers .env

function Generate-Secret {
    param(
        [int]$Length = 32,
        [switch]$Hex
    )
    
    $chars = if ($Hex) {
        "0123456789abcdef"
    } else {
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
    
    $secret = ""
    for ($i = 0; $i -lt $Length; $i++) {
        $secret += $chars[(Get-Random -Maximum $chars.Length)]
    }
    return $secret
}

function Generate-Password {
    param([int]$Length = 20)
    
    $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    $password = ""
    for ($i = 0; $i -lt $Length; $i++) {
        $password += $chars[(Get-Random -Maximum $chars.Length)]
    }
    return $password
}

Write-Host "SecureVault Secret Generator" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Generate all secrets
$jwt_secret = Generate-Secret -Length 44  # Base64 encoded 32 bytes
$encryption_key = Generate-Secret -Length 64 -Hex  # 32 bytes hex
$db_password_prod = Generate-Password -Length 24
$db_password_staging = Generate-Password -Length 24

Write-Host "PRODUCTION SECRETS:" -ForegroundColor Green
Write-Host ""
Write-Host "JWT_SECRET=" -ForegroundColor Yellow -NoNewline
Write-Host $jwt_secret
Write-Host ""
Write-Host "ENCRYPTION_KEY=" -ForegroundColor Yellow -NoNewline
Write-Host $encryption_key
Write-Host ""
Write-Host "DB_PASSWORD=" -ForegroundColor Yellow -NoNewline
Write-Host $db_password_prod
Write-Host ""
Write-Host ""

Write-Host "STAGING SECRETS:" -ForegroundColor Green
Write-Host ""
Write-Host "JWT_SECRET=" -ForegroundColor Yellow -NoNewline
Write-Host $jwt_secret  # Can reuse same JWT_SECRET
Write-Host ""
Write-Host "ENCRYPTION_KEY=" -ForegroundColor Yellow -NoNewline
Write-Host $encryption_key  # Can reuse same ENCRYPTION_KEY
Write-Host ""
Write-Host "DB_PASSWORD=" -ForegroundColor Yellow -NoNewline
Write-Host $db_password_staging
Write-Host ""
Write-Host ""

Write-Host "Template .env PRODUCTION:" -ForegroundColor Blue
Write-Host "================================" -ForegroundColor Blue
Write-Host @"
NODE_ENV=production
PORT=8080
DB_HOST=postgres
DB_PORT=5432
DB_NAME=securevault_prod
DB_USER=vault_prod
DB_PASSWORD=$db_password_prod
JWT_SECRET=$jwt_secret
JWT_EXPIRY=7d
ENCRYPTION_KEY=$encryption_key
LOG_LEVEL=info
REACT_APP_API_URL=https://vault-api.freijstack.com
"@

Write-Host ""
Write-Host "Template .env STAGING:" -ForegroundColor Blue
Write-Host "================================" -ForegroundColor Blue
Write-Host @"
NODE_ENV=staging
PORT=8081
DB_HOST=postgres
DB_PORT=5432
DB_NAME=securevault_staging
DB_USER=vault_staging
DB_PASSWORD=$db_password_staging
JWT_SECRET=$jwt_secret
JWT_EXPIRY=7d
ENCRYPTION_KEY=$encryption_key
LOG_LEVEL=debug
REACT_APP_API_URL=https://vault-staging-api.freijstack.com
"@

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy the secrets above"
Write-Host "2. SSH to Hostinger:"
Write-Host "   ssh user@your-hostinger-ip"
Write-Host "3. Create .env files:"
Write-Host "   mkdir -p /srv/www/securevault/saas/securevault"
Write-Host "   nano /srv/www/securevault/saas/securevault/.env"
Write-Host "4. Paste PRODUCTION template content"
Write-Host "5. Repeat for STAGING in /srv/www/securevault-staging/"
Write-Host ""
Write-Host "WARNING: NEVER commit .env files!" -ForegroundColor Red
