# Script de diagnostic VPS pour staging
# Usage: .\scripts\check-vps-staging.ps1

param(
    [string]$VpsHost = "31.97.10.57",
    [string]$VpsUser = "root"
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🔍 Diagnostic VPS Staging" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📡 Connexion au VPS: $VpsUser@$VpsHost`n" -ForegroundColor Yellow

# Commandes à exécuter sur le VPS
$commands = @(
    "echo '=== Docker Containers Staging ==='",
    "cd /srv/www/securevault-staging/saas/securevault && docker compose ps",
    "",
    "echo '=== Backend Logs (dernières 20 lignes) ==='",
    "cd /srv/www/securevault-staging/saas/securevault && docker compose logs --tail=20 backend",
    "",
    "echo '=== Traefik Labels Backend ==='",
    "docker inspect securevault-staging-backend | grep -A 10 'Labels'",
    "",
    "echo '=== Test interne backend health ==='",
    "docker exec securevault-staging-backend curl -s http://localhost:5000/api/health || echo 'Backend not responding internally'",
    "",
    "echo '=== Variables d''environnement Backend ==='",
    "cd /srv/www/securevault-staging/saas/securevault && docker compose exec backend env | grep -E '(NODE_ENV|PORT|FRONTEND_URL|ALLOWED_ORIGINS)'"
)

$fullCommand = $commands -join " && "

Write-Host "Execution des commandes de diagnostic...`n" -ForegroundColor Cyan

# Exécuter via SSH
ssh "$VpsUser@$VpsHost" $fullCommand

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ Diagnostic terminé" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📋 Que vérifier :`n" -ForegroundColor Yellow
Write-Host "1. Docker containers 'Up' (backend, postgres, frontend)" -ForegroundColor White
Write-Host "2. Backend logs sans erreurs critiques" -ForegroundColor White
Write-Host "3. Traefik labels avec vault-api-staging.freijstack.com" -ForegroundColor White
Write-Host "4. Test interne backend retourne OK" -ForegroundColor White
Write-Host "5. Variables env correctes (PORT=5000, NODE_ENV=staging)`n" -ForegroundColor White

Write-Host "🔧 Si problème détecté :`n" -ForegroundColor Yellow
Write-Host "- Redémarrer: ssh $VpsUser@$VpsHost 'cd /srv/www/securevault-staging/saas/securevault && docker compose restart backend'" -ForegroundColor White
Write-Host "- Rebuild: ssh $VpsUser@$VpsHost 'cd /srv/www/securevault-staging/saas/securevault && docker compose up -d --build backend'" -ForegroundColor White
Write-Host "- Logs live: ssh $VpsUser@$VpsHost 'cd /srv/www/securevault-staging/saas/securevault && docker compose logs -f backend'`n" -ForegroundColor White
