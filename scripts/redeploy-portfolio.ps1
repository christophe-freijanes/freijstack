# ============================================
# Portfolio Complete Redeploy Script (PowerShell)
# Destroys and rebuilds portfolio from scratch
# ============================================

param(
    [string]$VpsIP = "31.97.10.57",
    [string]$SshKey = "$env:USERPROFILE\.ssh\freijstack_deploy"
)

$ErrorActionPreference = "Stop"

$REGISTRY = "registry.freijstack.com"
$IMAGE = "portfolio"

Write-Host "🔄 Starting complete portfolio redeployment..." -ForegroundColor Cyan
Write-Host "📡 Connecting to VPS: $VpsIP" -ForegroundColor Blue

function Invoke-VpsCommand {
    param([string]$Command)
    ssh -i $SshKey root@$VpsIP $Command
}

Write-Host "🗑️  Destroying current portfolio deployment..." -ForegroundColor Yellow

try {
    Invoke-VpsCommand "cd /srv/www/portfolio && docker compose down -v 2>&1" | Out-Null
    Write-Host "✅ Staging containers removed"
} catch {
    Write-Host "⚠️  No staging containers to remove"
}

try {
    Invoke-VpsCommand "cd /srv/www/portfolio && docker compose -f docker-compose.prod.yml down -v 2>&1" | Out-Null
    Write-Host "✅ Production containers removed"
} catch {
    Write-Host "⚠️  No production containers to remove"
}

Write-Host "🗑️  Removing old images..." -ForegroundColor Yellow
Invoke-VpsCommand "docker rmi $REGISTRY/$IMAGE`:latest -f 2>&1 | head -1" | Out-Null
Invoke-VpsCommand "docker rmi $REGISTRY/$IMAGE`:latest-beta -f 2>&1 | head -1" | Out-Null
Write-Host "✅ Old images removed"

Write-Host "📥 Pulling fresh images from registry..." -ForegroundColor Blue
Invoke-VpsCommand "docker pull $REGISTRY/$IMAGE`:latest-beta 2>&1 | tail -3"
Invoke-VpsCommand "docker pull $REGISTRY/$IMAGE`:latest 2>&1 | tail -3"

Write-Host "🚀 Starting staging container..." -ForegroundColor Green
Invoke-VpsCommand "cd /srv/www/portfolio && docker compose -p staging up -d && sleep 5"
Write-Host "✅ Staging started"

Write-Host "🚀 Starting production container..." -ForegroundColor Green
Invoke-VpsCommand "cd /srv/www/portfolio && docker compose -p production -f docker-compose.prod.yml up -d && sleep 5"
Write-Host "✅ Production started"

Write-Host ""
Write-Host "✅ Checking container health..." -ForegroundColor Cyan
Invoke-VpsCommand "docker ps | grep portfolio"

Write-Host ""
Write-Host "📊 Verifying responses..." -ForegroundColor Cyan
Write-Host "Staging (port 3000):"
Invoke-VpsCommand "curl -s http://127.0.0.1:3000/ | head -1"

Write-Host ""
Write-Host "Production (port 3001):"
Invoke-VpsCommand "curl -s http://127.0.0.1:3001/ | head -1"

Write-Host ""
Write-Host "✅ Portfolio redeployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access your portfolio:" -ForegroundColor Yellow
Write-Host "   Staging:     https://portfolio-staging.freijstack.com"
Write-Host "   Production:  https://portfolio.freijstack.com"
