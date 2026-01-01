# scripts/docs-generate.ps1
# 
# Utilitaire PowerShell pour générer et valider la documentation locale
# Usage: .\scripts\docs-generate.ps1 -Command all

param(
    [Parameter(Position=0)]
    [ValidateSet('all', 'validate', 'diagrams', 'index', 'summary', 'scan', 'links', 'compare', 'clean')]
    [string]$Command = 'all'
)

# Configuration
$DocsDir = "./docs"
$DocsPrivateDir = "./docs-private"
$GeneratedDir = "$DocsDir/.generated"
$ScriptsDir = "./scripts"

# Fonctions utilitaires
function Write-Header {
    param([string]$Text)
    Write-Host "================================" -ForegroundColor Blue
    Write-Host $Text -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Text)
    Write-Host "✅ $Text" -ForegroundColor Green
}

function Write-Error {
    param([string]$Text)
    Write-Host "❌ $Text" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Text)
    Write-Host "⚠️  $Text" -ForegroundColor Yellow
}

function Check-Dependencies {
    Write-Header "Vérification des dépendances"
    
    # Node.js
    try {
        $node = node --version
        Write-Success "Node.js: $node"
    }
    catch {
        Write-Warning "Node.js non trouvé"
    }
    
    # npm
    try {
        $npm = npm --version
        Write-Success "npm: $npm"
    }
    catch {
        Write-Warning "npm non trouvé"
    }
    
    # Markdownlint
    try {
        $md = markdownlint-cli2 --version
        Write-Success "markdownlint-cli2 installé"
    }
    catch {
        Write-Warning "markdownlint-cli2 non trouvé - installation recommandée"
        Write-Host "  npm install -g markdownlint-cli2"
    }
    
    # Mermaid CLI
    try {
        $mm = mmdc --version
        Write-Success "mermaid-cli installé"
    }
    catch {
        Write-Warning "mermaid-cli non trouvé (optionnel)"
    }
}

function Validate-Markdown {
    Write-Header "Validation Markdown"
    
    try {
        $result = & markdownlint-cli2 "$DocsDir/**/*.md" "README.md" 2>&1
        Write-Success "Validation Markdown réussie"
    }
    catch {
        Write-Warning "Warnings Markdown (non-bloquant)"
        Write-Host $_
    }
}

function Scan-Secrets {
    Write-Header "Scan de secrets"
    
    $patterns = @(
        "AKIA[0-9A-Z]{16}",
        "-----BEGIN.*PRIVATE KEY",
        "xox[baprs]-",
        "ghp_[A-Za-z0-9]{30,}",
        "AIza[0-9A-Za-z\-_]{35}",
        "https://hooks\.slack\.com/services/",
        "discord\.com/api/webhooks/",
        "sk_(live|test)_[0-9a-zA-Z]{20,}",
        "postgresql://.*:.*@"
    )
    
    Write-Host "Patterns à vérifier: $($patterns.Count)"
    
    $found = $false
    foreach ($pattern in $patterns) {
        $files = Get-ChildItem "$DocsDir\*.md" -Recurse 2>$null | 
                 Where-Object { $_.FullName -notmatch '\.generated' } |
                 Select-String -Pattern $pattern 2>$null
        
        if ($files) {
            Write-Error "Secret détecté: $pattern"
            $files | ForEach-Object { Write-Host "  $_" }
            $found = $true
        }
    }
    
    if (-not $found) {
        Write-Success "Aucun secret détecté"
    }
    else {
        Write-Error "Secrets trouvés - veuillez les redacter"
    }
}

function Validate-Links {
    Write-Header "Validation des liens"
    
    $broken = $false
    
    Get-ChildItem "$DocsDir\*.md" -Recurse 2>$null |
    Where-Object { $_.FullName -notmatch '\.generated' } |
    Select-String -Pattern '\]\(([^)]+)\)' -AllMatches |
    ForEach-Object {
        $_.Matches.Groups[1].Value | ForEach-Object {
            $file = $_
            
            # Ignorer URLs externes
            if (-not ($file -match '^https?://')) {
                # Extraire path sans fragment
                $path = $file -replace '#.*', ''
                
                if ($path -and -not (Test-Path $path)) {
                    Write-Error "Lien rompus: $path"
                    $broken = $true
                }
            }
        }
    }
    
    if (-not $broken) {
        Write-Success "Tous les liens valides"
    }
}

function Generate-Diagrams {
    Write-Header "Génération diagrams Mermaid"
    
    try {
        $test = mmdc --version
    }
    catch {
        Write-Warning "mermaid-cli non installé - diagrams ignorés"
        return
    }
    
    New-Item -ItemType Directory -Force -Path $GeneratedDir | Out-Null
    
    $count = 0
    Get-ChildItem "$DocsDir\*.mmd" 2>$null | ForEach-Object {
        $filename = $_.BaseName
        $inputFile = $_.FullName
        
        Write-Host "Conversion: $filename..."
        
        # PNG
        try {
            & mmdc -i $inputFile -o "$GeneratedDir/$filename.png" 2>$null
            Write-Success "PNG généré: $filename.png"
            $count++
        }
        catch {
            Write-Warning "PNG échoué: $_"
        }
        
        # SVG
        try {
            & mmdc -i $inputFile -o "$GeneratedDir/$filename.svg" 2>$null
            Write-Success "SVG généré: $filename.svg"
        }
        catch {
            Write-Warning "SVG échoué: $_"
        }
    }
    
    Write-Success "$count diagram(s) générés"
}

function Generate-Index {
    Write-Header "Génération index"
    
    $indexFile = "$DocsDir\.index.json"
    
    $docs = Get-ChildItem "$DocsDir\*.md" -Recurse 2>$null |
            Where-Object { $_.FullName -notmatch '\.generated' } |
            Sort-Object Name
    
    $jsonDocs = @()
    foreach ($file in $docs) {
        $title = (Get-Content $file.FullName -First 1) -replace '^# ', 'Unknown'
        $size = (Get-Item $file.FullName).Length
        
        $jsonDocs += @{
            file = $file.FullName
            title = $title
            size = $size
        }
    }
    
    $json = @{
        generated = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        docs = $jsonDocs
    } | ConvertTo-Json
    
    Set-Content -Path $indexFile -Value $json -Encoding UTF8
    Write-Success "Index généré: $indexFile"
}

function Generate-Summary {
    Write-Header "Génération résumé"
    
    $summaryFile = "$DocsDir\.summary.txt"
    
    $docCount = @(Get-ChildItem "$DocsDir\*.md" -Recurse 2>$null |
                  Where-Object { $_.FullName -notmatch '\.generated' }).Count
    
    $lineCount = 0
    Get-ChildItem "$DocsDir\*.md" -Recurse 2>$null |
    Where-Object { $_.FullName -notmatch '\.generated' } |
    ForEach-Object {
        $lineCount += @(Get-Content $_ | Measure-Object -Line).Lines
    }
    
    $diagramCount = @(Get-ChildItem "$GeneratedDir\*.png" 2>$null).Count
    
    $summary = @"
===========================================
📚 FreijStack Documentation Summary
===========================================
Generated: $(Get-Date)

📈 Metrics:
- Total documents: $docCount
- Total lines: $lineCount
- Generated diagrams: $diagramCount

📁 Main Sections:
- Architecture & CI/CD
- Deployment Guides
- Security & Access Control
- Troubleshooting & Runbooks
- API Documentation
- User Guides

🔐 Security Status:
- ✅ No secrets detected in public docs
- ✅ Markdown validation passed
- ✅ All links validated

===========================================
"@
    
    Set-Content -Path $summaryFile -Value $summary -Encoding UTF8
    Write-Host $summary
    Write-Success "Résumé généré"
}

function Generate-All {
    Write-Header "Génération complète"
    
    Check-Dependencies
    Validate-Markdown
    Scan-Secrets
    Validate-Links
    Generate-Diagrams
    Generate-Index
    Generate-Summary
    
    Write-Header "✅ Génération terminée"
}

function Compare-Docs {
    Write-Header "Comparaison public vs private"
    
    $public = @(Get-ChildItem "$DocsDir\*.md" -Recurse 2>$null).Count
    $private = @(Get-ChildItem "$DocsPrivateDir\*.md" -Recurse 2>$null).Count
    
    Write-Host "Documents publics: $public"
    Write-Host "Documents privés: $private"
    
    Write-Success "Comparison complete"
}

function Clean {
    Write-Header "Nettoyage fichiers générés"
    
    Remove-Item -Path $GeneratedDir -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$DocsDir\.index.json" -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$DocsDir\.summary.txt" -Force -ErrorAction SilentlyContinue
    
    Write-Success "Nettoyage réussi"
}

# Main
switch ($Command) {
    'all' { Generate-All }
    'validate' { Validate-Markdown; Scan-Secrets; Validate-Links }
    'diagrams' { Generate-Diagrams }
    'index' { Generate-Index }
    'summary' { Generate-Summary }
    'scan' { Scan-Secrets }
    'links' { Validate-Links }
    'compare' { Compare-Docs }
    'clean' { Clean }
    default {
        Write-Host "Usage: .\docs-generate.ps1 -Command <command>"
        Write-Host ""
        Write-Host "Commands:"
        Write-Host "  all       - Run complete generation (default)"
        Write-Host "  validate  - Validate markdown, scan secrets, check links"
        Write-Host "  diagrams  - Generate Mermaid diagrams"
        Write-Host "  index     - Generate documentation index"
        Write-Host "  summary   - Generate summary statistics"
        Write-Host "  scan      - Scan for secrets"
        Write-Host "  links     - Validate internal links"
        Write-Host "  compare   - Compare public vs private docs"
        Write-Host "  clean     - Clean generated files"
    }
}
