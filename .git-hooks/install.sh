#!/bin/bash
# 🔒 Git Hooks Installation Script
# Installe automatiquement les git hooks pour la sécurité

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔒 Installation des Git Hooks${NC}"
echo "================================"

# Check if .git directory exists
if [ ! -d ".git" ]; then
    echo "❌ Erreur: Pas un dépôt Git (pas de dossier .git)"
    exit 1
fi

# Create hooks directory if needed
mkdir -p .git/hooks

# Copy hooks
echo "📋 Copie des hooks..."
if [ -d ".git-hooks" ]; then
    cp -v .git-hooks/* .git/hooks/ 2>/dev/null || true
    echo -e "${GREEN}✅ Hooks copiés${NC}"
else
    echo "⚠️  Dossier .git-hooks non trouvé"
fi

# Make hooks executable
echo ""
echo "🔧 Permissions des hooks..."
chmod +x .git/hooks/pre-commit 2>/dev/null || true
chmod +x .git/hooks/commit-msg 2>/dev/null || true

# Verify installation
echo ""
echo "✅ Vérification..."
if [ -x ".git/hooks/pre-commit" ]; then
    echo -e "${GREEN}✅ pre-commit hook installé${NC}"
else
    echo "⚠️  pre-commit hook non trouvé ou non exécutable"
fi

echo ""
echo "================================"
echo -e "${GREEN}✅ Installation terminée!${NC}"
echo ""
echo "Les hooks suivants sont actifs:"
found=0
for hook in .git/hooks/*; do
    name=$(basename "$hook")
    [[ "$name" == *sample* ]] && continue
    if [ -f "$hook" ]; then
        echo "$name"
        found=1
    fi
done

if [ "$found" -eq 0 ]; then
    echo "Aucun hook"
fi
echo ""
echo "Prochaines étapes:"
echo "1. Les hooks s'exécuteront automatiquement"
echo "2. Pour tester: git commit --allow-empty -m 'test'"
echo "3. Pour bypass: git commit --no-verify"
