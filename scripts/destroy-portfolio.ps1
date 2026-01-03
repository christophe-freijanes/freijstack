# ============================================
# Portfolio Destroy Script (PowerShell)
# Completely removes all portfolio containers and images
# ============================================

param(
    [string]$VpsIP = "31.97.10.57",
    [string]$SshKey = "$env:USERPROFILE\.ssh\freijstack_deploy",
    [switch]$Force
)

$REGISTRY = "registry.freijstack.com"
$IMAGE = "portfolio"

Write-Host "⚠️  WARNING: This will completely destroy portfolio deployment!" -ForegroundColor Red
Write-Host ""

if (-not $Force) {
    $response = Read-Host "Are you sure? (yes/no)"
    if ($response -ne "yes") {
        Write-Host "❌ Aborted"
        exit 1
    }
}

Write-Host "🔄 Destroying portfolio deployment..." -ForegroundColor Yellow

function Invoke-VpsCommand {
    param([string]$Command)
    ssh -i $SshKey root@$VpsIP $Command
}

Write-Host "Stopping containers..."
Invoke-VpsCommand "docker compose -f /srv/www/portfolio/docker-compose.yml down 2>&1" | Out-Null
Invoke-VpsCommand "docker compose -f /srv/www/portfolio/docker-compose.prod.yml down 2>&1" | Out-Null

Write-Host "Removing images..."
Invoke-VpsCommand "docker rmi $REGISTRY/$IMAGE`:latest -f 2>&1" | Out-Null
Invoke-VpsCommand "docker rmi $REGISTRY/$IMAGE`:latest-beta -f 2>&1" | Out-Null

Write-Host "Removing portfolio directory..."
Invoke-VpsCommand "rm -rf /srv/www/portfolio && mkdir -p /srv/www/portfolio"

Write-Host ""
Write-Host "✅ Portfolio completely destroyed!" -ForegroundColor Green
Write-Host ""
Write-Host "To redeploy, run:"
Write-Host "  .\scripts\redeploy-portfolio.ps1"
