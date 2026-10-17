# 🔍 SecureVault Registration Diagnostic Tool (PowerShell)
# Tests rapides pour identifier le problème d'enregistrement

param(
    [string]$Environment = "staging"
)

$ErrorActionPreference = "Continue"

if ($Environment -eq "production") {
    $API_URL = "https://vault-api.freijstack.com"
    $FRONTEND_URL = "https://vault.freijstack.com"
} else {
    $API_URL = "https://vault-api-staging.freijstack.com"
    $FRONTEND_URL = "https://vault-staging.freijstack.com"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔍 SecureVault Registration Diagnostic" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "API: $API_URL" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Backend Health Check
Write-Host "▶ 1. Backend Health Check" -ForegroundColor Magenta
try {
    $health = Invoke-RestMethod -Uri "$API_URL/api/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  ✓ Backend is responding" -ForegroundColor Green
    Write-Host "    Response: $($health | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "  ✗ Backend not responding" -ForegroundColor Red
    Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 2. CORS Preflight Test
Write-Host "▶ 2. CORS Preflight (OPTIONS) Test" -ForegroundColor Magenta
try {
    $headers = @{
        "Origin" = $FRONTEND_URL
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type"
    }
    
    $response = Invoke-WebRequest -Uri "$API_URL/api/auth/register" -Method OPTIONS -Headers $headers -TimeoutSec 10 -ErrorAction Stop
    
    if ($response.StatusCode -in @(200, 204)) {
        Write-Host "  ✓ CORS preflight successful (HTTP $($response.StatusCode))" -ForegroundColor Green
        
        # Check CORS headers
        $allowOrigin = $response.Headers["Access-Control-Allow-Origin"]
        $allowMethods = $response.Headers["Access-Control-Allow-Methods"]
        $allowHeaders = $response.Headers["Access-Control-Allow-Headers"]
        
        if ($allowOrigin) {
            Write-Host "    ✓ Access-Control-Allow-Origin: $allowOrigin" -ForegroundColor Green
        } else {
            Write-Host "    ✗ Missing Access-Control-Allow-Origin" -ForegroundColor Red
        }
        
        if ($allowMethods) {
            Write-Host "    ✓ Access-Control-Allow-Methods: $allowMethods" -ForegroundColor Green
        }
        
        if ($allowHeaders) {
            Write-Host "    ✓ Access-Control-Allow-Headers: $allowHeaders" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "  ✗ CORS preflight failed" -ForegroundColor Red
    Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "    This will block registration from the browser!" -ForegroundColor Yellow
}
Write-Host ""

# 3. Test Registration Endpoint
Write-Host "▶ 3. Registration Endpoint Test" -ForegroundColor Magenta
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$testData = @{
    username = "testuser$timestamp"
    email = "test$timestamp@example.com"
    password = "TestPass123!"
} | ConvertTo-Json

Write-Host "  Testing with:" -ForegroundColor Gray
Write-Host "    Email: test$timestamp@example.com" -ForegroundColor Gray
Write-Host "    Username: testuser$timestamp" -ForegroundColor Gray

try {
    $headers = @{
        "Content-Type" = "application/json"
        "Origin" = $FRONTEND_URL
    }
    
    $response = Invoke-RestMethod -Uri "$API_URL/api/auth/register" -Method POST -Body $testData -Headers $headers -TimeoutSec 10 -ErrorAction Stop
    
    Write-Host "  ✓ Registration successful!" -ForegroundColor Green
    Write-Host "    Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "  ✗ Registration failed (HTTP $statusCode)" -ForegroundColor Red
    
    try {
        $errorBody = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "    Error: $($errorBody.error)" -ForegroundColor Red
        if ($errorBody.details) {
            Write-Host "    Details: $($errorBody.details)" -ForegroundColor Red
        }
    } catch {
        Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# 4. Database Connection Check (if SSH available)
Write-Host "▶ 4. Database Connection Check (requires SSH)" -ForegroundColor Magenta
Write-Host "  ℹ  Run on VPS to check database:" -ForegroundColor Cyan
Write-Host "    cd /srv/www/securevault-$Environment/saas/securevault" -ForegroundColor Gray
Write-Host "    docker compose exec postgres psql -U postgres -d securevault -c '\dt'" -ForegroundColor Gray
Write-Host ""

# 5. Browser Console Check
Write-Host "▶ 5. Browser Console Check" -ForegroundColor Magenta
Write-Host "  Open browser console (F12) on $FRONTEND_URL and check for:" -ForegroundColor Cyan
Write-Host "    • CORS errors (red text about 'blocked by CORS policy')" -ForegroundColor Gray
Write-Host "    • Network errors (failed requests to /api/auth/register)" -ForegroundColor Gray
Write-Host "    • JavaScript errors" -ForegroundColor Gray
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📊 Diagnostic Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Common issues and fixes:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. CORS 404 on OPTIONS:" -ForegroundColor White
Write-Host "   → Add app.options('*', cors()) in server.js" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Missing CORS headers:" -ForegroundColor White
Write-Host "   → Check CORS allowedOrigins includes your domain" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Database errors:" -ForegroundColor White
Write-Host "   → Run migrations: cd /srv/www/securevault-$Environment && ./scripts/run-migrations.sh $Environment" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Backend not starting:" -ForegroundColor White
Write-Host "   → Check logs: docker compose logs backend" -ForegroundColor Gray
Write-Host "   → Check .env file has all required variables" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Rate limiting:" -ForegroundColor White
Write-Host "   → Rate limiter should skip OPTIONS requests" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Full documentation:" -ForegroundColor Cyan
Write-Host "   docs/REGISTRATION_ISSUES.md" -ForegroundColor Gray
Write-Host "   docs/CORS_TROUBLESHOOTING.md" -ForegroundColor Gray
Write-Host ""
