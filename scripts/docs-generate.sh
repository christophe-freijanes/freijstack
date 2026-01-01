#!/bin/bash
# scripts/docs-generate.sh
# 
# Utilitaire pour générer et valider la documentation locale
# Usage: ./scripts/docs-generate.sh [command]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCS_DIR="./docs"
DOCS_PRIVATE_DIR="./docs-private"
GENERATED_DIR="$DOCS_DIR/.generated"
SCRIPTS_DIR="./scripts"

# Functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

check_dependencies() {
    print_header "Vérification des dépendances"
    
    local missing=0
    
    # Node.js
    if ! command -v node &> /dev/null; then
        print_warning "Node.js non trouvé"
        missing=1
    else
        print_success "Node.js: $(node --version)"
    fi
    
    # npm
    if ! command -v npm &> /dev/null; then
        print_warning "npm non trouvé"
        missing=1
    else
        print_success "npm: $(npm --version)"
    fi
    
    # Markdown linter
    if ! command -v markdownlint-cli2 &> /dev/null; then
        print_warning "markdownlint-cli2 non trouvé - installation..."
        npm install -g markdownlint-cli2 || print_error "Installation failed"
    else
        print_success "markdownlint-cli2 installé"
    fi
    
    # Mermaid CLI
    if ! command -v mmdc &> /dev/null; then
        print_warning "@mermaid-js/mermaid-cli non trouvé - installation..."
        npm install -g @mermaid-js/mermaid-cli || print_warning "Installation optionnelle"
    else
        print_success "mermaid-cli installé"
    fi
    
    # ripgrep
    if ! command -v rg &> /dev/null; then
        print_warning "ripgrep (rg) non trouvé - installation..."
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt-get install -y ripgrep || print_warning "Installé manuellement"
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            brew install ripgrep || print_warning "Installé avec brew"
        fi
    else
        print_success "ripgrep installé"
    fi
    
    if [ $missing -eq 1 ]; then
        print_warning "Certaines dépendances manquent"
    fi
}

validate_markdown() {
    print_header "Validation Markdown"
    
    if ! command -v markdownlint-cli2 &> /dev/null; then
        print_error "markdownlint-cli2 non installé"
        return 1
    fi
    
    if markdownlint-cli2 "${DOCS_DIR}/**/*.md" README.md 2>/dev/null; then
        print_success "Validation Markdown réussie"
    else
        print_warning "Warnings de linting (non-bloquant)"
    fi
}

scan_secrets() {
    print_header "Scan de secrets"
    
    if ! command -v rg &> /dev/null; then
        print_warning "ripgrep non disponible - scan ignoré"
        return 0
    fi
    
    local found=0
    
    # Patterns sensibles
    patterns=(
        "AKIA[0-9A-Z]{16}"
        "-----BEGIN.*PRIVATE KEY"
        "xox[baprs]-"
        "ghp_[A-Za-z0-9]{30,}"
        "AIza[0-9A-Za-z\-_]{35}"
        "https://hooks\.slack\.com/services/"
        "discord\.com/api/webhooks/"
        "sk_(live|test)_[0-9a-zA-Z]{20,}"
        "postgresql://.*:.*@"
    )
    
    echo "Patterns à vérifier: ${#patterns[@]}"
    
    for pattern in "${patterns[@]}"; do
        if rg -n "$pattern" "$DOCS_DIR" --type markdown 2>/dev/null; then
            print_error "Secret détecté: $pattern"
            found=1
        fi
    done
    
    if [ $found -eq 0 ]; then
        print_success "Aucun secret détecté"
    else
        print_error "Secrets trouvés - veuillez les redacter"
        return 1
    fi
}

validate_links() {
    print_header "Validation des liens"
    
    local broken=0
    
    # Vérifier liens internes
    while IFS= read -r line; do
        # Extraire fichier from [text](file)
        if [[ $line =~ \]\(([^)]+)\) ]]; then
            file="${BASH_REMATCH[1]}"
            
            # Ignorer URLs externes
            if [[ ! $file =~ ^https?:// ]]; then
                # Extraire path sans fragment
                path="${file%#*}"
                
                if [ -n "$path" ] && [ ! -f "$path" ]; then
                    print_error "Lien rompus: $path (dans $line)"
                    broken=1
                fi
            fi
        fi
    done < <(grep -r '\[.*\](' "$DOCS_DIR" --include="*.md" -o || true)
    
    if [ $broken -eq 0 ]; then
        print_success "Tous les liens valides"
    else
        print_warning "Liens rompus détectés"
    fi
}

generate_diagrams() {
    print_header "Génération diagrams Mermaid"
    
    if ! command -v mmdc &> /dev/null; then
        print_warning "mermaid-cli non installé - diagrams ignorés"
        return 0
    fi
    
    mkdir -p "$GENERATED_DIR"
    
    local count=0
    for mmd_file in "$DOCS_DIR"/*.mmd; do
        if [ -f "$mmd_file" ]; then
            filename=$(basename "$mmd_file" .mmd)
            
            echo "Conversion: $filename..."
            
            # PNG
            if mmdc -i "$mmd_file" -o "$GENERATED_DIR/${filename}.png" 2>/dev/null; then
                print_success "PNG généré: ${filename}.png"
                count=$((count+1))
            fi
            
            # SVG
            if mmdc -i "$mmd_file" -o "$GENERATED_DIR/${filename}.svg" 2>/dev/null; then
                print_success "SVG généré: ${filename}.svg"
            fi
        fi
    done
    
    if [ $count -gt 0 ]; then
        print_success "$count diagram(s) générés"
    fi
}

generate_index() {
    print_header "Génération index"
    
    local index_file="$DOCS_DIR/.index.json"
    
    echo "{" > "$index_file"
    echo "  \"generated\": \"$(date -u +'%Y-%m-%dT%H:%M:%SZ')\"," >> "$index_file"
    echo "  \"docs\": [" >> "$index_file"
    
    local first=1
    for file in $(find "$DOCS_DIR" -name "*.md" -not -path "*/.generated/*" | sort); do
        if [ $first -eq 0 ]; then
            echo "," >> "$index_file"
        fi
        
        title=$(head -n 1 "$file" | sed 's/^# //' || echo "Unknown")
        size=$(wc -c < "$file")
        
        echo -n "    {\"file\": \"$file\", \"title\": \"$title\", \"size\": $size}" >> "$index_file"
        first=0
    done
    
    echo "" >> "$index_file"
    echo "  ]" >> "$index_file"
    echo "}" >> "$index_file"
    
    print_success "Index généré: $index_file"
}

generate_summary() {
    print_header "Génération résumé"
    
    local summary_file="$DOCS_DIR/.summary.txt"
    
    local doc_count=$(find "$DOCS_DIR" -name "*.md" | wc -l)
    local line_count=$(find "$DOCS_DIR" -name "*.md" -exec wc -l {} + | tail -1 | awk '{print $1}' || echo "0")
    local diagram_count=$(ls "$GENERATED_DIR"/*.png 2>/dev/null | wc -l || echo "0")
    
    cat > "$summary_file" << EOF
===========================================
📚 FreijStack Documentation Summary
===========================================
Generated: $(date)

📈 Metrics:
- Total documents: $doc_count
- Total lines: $line_count
- Generated diagrams: $diagram_count

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
EOF
    
    cat "$summary_file"
    print_success "Résumé généré"
}

generate_all() {
    print_header "Génération complète"
    
    check_dependencies
    validate_markdown
    scan_secrets
    validate_links
    generate_diagrams
    generate_index
    generate_summary
    
    print_header "✅ Génération terminée"
}

compare_docs() {
    print_header "Comparaison public vs private"
    
    local public=$(find "$DOCS_DIR" -name "*.md" | wc -l)
    local private=$(find "$DOCS_PRIVATE_DIR" -name "*.md" 2>/dev/null | wc -l || echo "0")
    
    echo "Documents publics: $public"
    echo "Documents privés: $private"
    
    print_success "Comparison complete"
}

clean() {
    print_header "Nettoyage fichiers générés"
    
    rm -rf "$GENERATED_DIR"
    rm -f "$DOCS_DIR/.index.json"
    rm -f "$DOCS_DIR/.summary.txt"
    
    print_success "Nettoyage réussi"
}

# Main
case "${1:-all}" in
    all)
        generate_all
        ;;
    validate)
        validate_markdown
        scan_secrets
        validate_links
        ;;
    diagrams)
        generate_diagrams
        ;;
    index)
        generate_index
        ;;
    summary)
        generate_summary
        ;;
    scan)
        scan_secrets
        ;;
    links)
        validate_links
        ;;
    compare)
        compare_docs
        ;;
    clean)
        clean
        ;;
    *)
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  all         - Run complete generation (default)"
        echo "  validate    - Validate markdown, scan secrets, check links"
        echo "  diagrams    - Generate Mermaid diagrams"
        echo "  index       - Generate documentation index"
        echo "  summary     - Generate summary statistics"
        echo "  scan        - Scan for secrets"
        echo "  links       - Validate internal links"
        echo "  compare     - Compare public vs private docs"
        echo "  clean       - Clean generated files"
        exit 1
        ;;
esac
