#!/bin/bash

# 🤖 Script de Validation de l'Automatisation
# Vérifie que tous les composants de l'automatisation sont en place

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
SUCCESS=0
WARNINGS=0
ERRORS=0

echo ""
echo "🤖 Validation de l'Automatisation SecureVault"
echo "============================================="
echo ""

# 1. Vérifier la structure des fichiers
echo "📁 Vérification de la structure..."
echo ""

files_to_check=(
  ".github/workflows/03-app-securevault-deploy.yml"
  ".github/workflows/05-health-prod.yml"
  ".github/workflows/06-maint-backup.yml"
  "docs/03-guides/AUTOMATION_GUIDE.md"
  "scripts/run-migrations.sh"
  "scripts/backup-to-cloud.sh"
)

for file in "${files_to_check[@]}"; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✓${NC} $file"
    ((SUCCESS++))
  else
    echo -e "  ${RED}✗${NC} $file - MANQUANT"
    ((ERRORS++))
  fi
done

echo ""

# 2. Vérifier les workflows GitHub Actions
echo "🔄 Vérification des workflows..."
echo ""

# Vérifier 03-app-securevault-deploy.yml
if grep -q "destroy-staging:" .github/workflows/03-app-securevault-deploy.yml 2>/dev/null; then
  echo -e "  ${GREEN}✓${NC} Job 'destroy-staging' trouvé dans 03-app-securevault-deploy.yml"
  ((SUCCESS++))
else
  echo -e "  ${RED}✗${NC} Job 'destroy-staging' manquant dans 03-app-securevault-deploy.yml"
  ((ERRORS++))
fi

if grep -q "refs/heads/master" .github/workflows/03-app-securevault-deploy.yml 2>/dev/null; then
  echo -e "  ${GREEN}✓${NC} Déploiement automatique sur master configuré"
  ((SUCCESS++))
else
  echo -e "  ${YELLOW}⚠${NC}  Déploiement automatique sur master non configuré"
  ((WARNINGS++))
fi

# Vérifier production-healthcheck.yml
if grep -q "cron: '\*/15 \* \* \* \*'" .github/workflows/production-healthcheck.yml 2>/dev/null; then
  echo -e "  ${GREEN}✓${NC} Health check toutes les 15 minutes configuré"
  ((SUCCESS++))
else
  echo -e "  ${YELLOW}⚠${NC}  Health check programmé manquant ou incorrect"
  ((WARNINGS++))
fi

if grep -q "auto-heal:" .github/workflows/production-healthcheck.yml 2>/dev/null; then
  echo -e "  ${GREEN}✓${NC} Job 'auto-heal' trouvé dans production-healthcheck.yml"
  ((SUCCESS++))
else
  echo -e "  ${RED}✗${NC} Job 'auto-heal' manquant dans production-healthcheck.yml"
  ((ERRORS++))
fi

echo ""

# 3. Vérifier les scripts de migration
echo "🗄️  Vérification des migrations..."
echo ""

if grep -q "PGUSER=\$(grep \"^POSTGRES_USER=\" .env" scripts/run-migrations.sh 2>/dev/null; then
  echo -e "  ${GREEN}✓${NC} Auto-détection PostgreSQL configurée"
  ((SUCCESS++))
else
  echo -e "  ${YELLOW}⚠${NC}  Auto-détection PostgreSQL manquante ou incorrecte"
  ((WARNINGS++))
fi

if [ -x "scripts/run-migrations.sh" ]; then
  echo -e "  ${GREEN}✓${NC} Script run-migrations.sh exécutable"
  ((SUCCESS++))
else
  echo -e "  ${YELLOW}⚠${NC}  Script run-migrations.sh non exécutable (chmod +x requis)"
  ((WARNINGS++))
fi

echo ""

# 4. Vérifier la documentation
echo "📚 Vérification de la documentation..."
echo ""

if grep -q "Destruction Automatique du Staging" docs/03-guides/AUTOMATION_GUIDE.md 2>/dev/null; then
  echo -e "  ${GREEN}✓${NC} Documentation automatisation complète"
  ((SUCCESS++))
else
  echo -e "  ${YELLOW}⚠${NC}  Documentation automatisation incomplète"
  ((WARNINGS++))
fi

if grep -q "AUTOMATION_GUIDE.md" docs/README.md 2>/dev/null; then
  echo -e "  ${GREEN}✓${NC} Référence AUTOMATION_GUIDE.md dans README principal"
  ((SUCCESS++))
else
  echo -e "  ${YELLOW}⚠${NC}  Référence AUTOMATION_GUIDE.md manquante dans README"
  ((WARNINGS++))
fi

echo ""

# 5. Vérifier les environnements sur VPS (optionnel)
echo "🌍 Vérification des environnements VPS (optionnel)..."
echo ""

if command -v ssh &> /dev/null; then
  echo -e "  ${BLUE}ℹ${NC}  Pour vérifier VPS, assurez-vous que :"
  echo "    • Staging: /srv/www/securevault-staging"
  echo "    • Production: /srv/www/securevault"
  echo "    • Fichiers .env configurés avec POSTGRES_USER et POSTGRES_DB"
else
  echo -e "  ${YELLOW}⚠${NC}  SSH non disponible, impossible de vérifier le VPS"
  ((WARNINGS++))
fi

echo ""

# 6. Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Résumé de la validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✓ Succès :${NC}     $SUCCESS"
echo -e "${YELLOW}⚠ Avertissements :${NC} $WARNINGS"
echo -e "${RED}✗ Erreurs :${NC}    $ERRORS"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ Automatisation complète validée !${NC}"
  echo ""
  echo "🎯 Prochaines étapes :"
  echo "  1. Push sur develop → Staging déployé automatiquement"
  echo "  2. Merge vers master → Production déployée, staging détruit"
  echo "  3. Production surveillée 24/7 avec auto-healing"
  echo ""
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Automatisation validée avec avertissements${NC}"
  echo ""
  echo "Certains composants optionnels sont manquants ou incomplets."
  echo "Le système fonctionnera mais pourrait nécessiter des ajustements."
  echo ""
  exit 0
else
  echo -e "${RED}❌ Automatisation incomplète - Erreurs détectées${NC}"
  echo ""
  echo "Veuillez corriger les erreurs avant de déployer."
  echo "Consultez la documentation : docs/03-guides/AUTOMATION_GUIDE.md"
  echo ""
  exit 1
fi
