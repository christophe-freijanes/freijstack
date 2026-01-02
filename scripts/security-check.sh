#!/bin/bash
# 🔒 Security Check Script - FreijStack
# Vérifie que le dépôt est sécurisé avant commit

set -e

echo "🔒 FreijStack Security Check"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Check for .env files (non-example)
echo "🔍 Vérification des fichiers .env..."
if git status --porcelain | grep -E "\.env[^.]" > /dev/null; then
    echo -e "${RED}❌ ERREUR: Fichiers .env détectés!${NC}"
    git status --porcelain | grep -E "\.env[^.]"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Aucun .env non-example${NC}"
fi

# 2. Check for private keys
echo ""
echo "🔍 Vérification des clés privées..."
if git status --porcelain | grep -E "\.key|\.pem|id_rsa|id_ed25519" > /dev/null; then
    echo -e "${RED}❌ ERREUR: Clés privées détectées!${NC}"
    git status --porcelain | grep -E "\.key|\.pem|id_rsa|id_ed25519"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Aucune clé privée${NC}"
fi

# 3. Check for credentials files
echo ""
echo "🔍 Vérification des credentials..."
if git status --porcelain | grep -E "credentials\.json|secret|password" > /dev/null; then
    echo -e "${RED}❌ ERREUR: Fichiers de credentials détectés!${NC}"
    git status --porcelain | grep -E "credentials\.json|secret|password"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Aucun fichier de credentials${NC}"
fi

# 4. Check for database files
echo ""
echo "🔍 Vérification des fichiers bases de données..."
if git status --porcelain | grep -E "\.db|\.sqlite|pgdata|mongodata" > /dev/null; then
    echo -e "${RED}❌ ERREUR: Fichiers bases de données détectés!${NC}"
    git status --porcelain | grep -E "\.db|\.sqlite|pgdata|mongodata"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Aucun fichier base de données${NC}"
fi

# 5. Check for node_modules (should not be committed)
echo ""
echo "🔍 Vérification des node_modules..."
if git status --porcelain | grep "node_modules" > /dev/null; then
    echo -e "${RED}❌ ERREUR: node_modules détectés!${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ node_modules ignorés${NC}"
fi

# 6. Check .gitignore is present
echo ""
echo "🔍 Vérification du .gitignore..."
if [ ! -f ".gitignore" ]; then
    echo -e "${RED}❌ ERREUR: .gitignore manquant!${NC}"
    ERRORS=$((ERRORS + 1))
elif [ ! -s ".gitignore" ]; then
    echo -e "${RED}❌ ERREUR: .gitignore vide!${NC}"
    ERRORS=$((ERRORS + 1))
else
    ENTRIES=$(wc -l < .gitignore)
    echo -e "${GREEN}✅ .gitignore présent ($ENTRIES règles)${NC}"
fi

# 7. Check for console.log / debug code (optional warning)
echo ""
echo "🔍 Vérification du code debug..."
DEBUG_LINES=$(git diff --cached --unified=0 | grep "^\+" | grep -E "console\.(log|error|warn|debug)|debugger" | grep -v "^+++" || true | wc -l)
if [ "$DEBUG_LINES" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  ATTENTION: $DEBUG_LINES lignes de debug détectées${NC}"
    git diff --cached --unified=0 | grep "^\+" | grep -E "console\.(log|error|warn|debug)|debugger" | grep -v "^+++" || true
else
    echo -e "${GREEN}✅ Aucun code debug${NC}"
fi

# 8. Check for hardcoded secrets (pattern matching)
echo ""
echo "🔍 Vérification des secrets en dur..."
SECRETS=$(git diff --cached | grep -E "(password|secret|token|api.?key|apikey).*=" | grep -v "^\-" | grep -v ".env.example" | grep -c ".")
if [ "$SECRETS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  ATTENTION: Possibles secrets en dur détectés!${NC}"
    git diff --cached | grep -E "(password|secret|token|api.?key|apikey).*=" || true
else
    echo -e "${GREEN}✅ Aucun secret en dur détecté${NC}"
fi

# Summary
echo ""
echo "=============================="
if [ "$ERRORS" -eq 0 ]; then
    echo -e "${GREEN}✅ Dépôt SÉCURISÉ - OK to commit!${NC}"
    exit 0
else
    echo -e "${RED}❌ $ERRORS erreur(s) de sécurité détectée(s)${NC}"
    echo "   Corrigez les erreurs avant de commiter"
    exit 1
fi
