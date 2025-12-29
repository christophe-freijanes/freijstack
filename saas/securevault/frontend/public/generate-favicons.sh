#!/bin/bash

# Script de génération des favicons PNG depuis SVG
# Nécessite ImageMagick ou Inkscape

set -e

echo "🎨 Génération des favicons PNG depuis SVG..."
echo ""

PUBLIC_DIR="$(dirname "$0")"
cd "$PUBLIC_DIR"

# Fonction pour convertir SVG en PNG
convert_svg() {
  local svg_file=$1
  local png_file=$2
  local size=$3
  
  echo "Converting $svg_file → $png_file ($size x $size)"
  
  # Essayer avec ImageMagick d'abord
  if command -v convert &> /dev/null; then
    convert -background none -resize ${size}x${size} "$svg_file" "$png_file"
  # Sinon essayer avec Inkscape
  elif command -v inkscape &> /dev/null; then
    inkscape "$svg_file" --export-png="$png_file" --export-width=$size --export-height=$size
  # Sinon essayer avec rsvg-convert
  elif command -v rsvg-convert &> /dev/null; then
    rsvg-convert -w $size -h $size "$svg_file" -o "$png_file"
  else
    echo "❌ Aucun outil de conversion trouvé (ImageMagick, Inkscape, ou librsvg)"
    echo "   Installez un de ces outils:"
    echo "   - ImageMagick: sudo apt install imagemagick"
    echo "   - Inkscape: sudo apt install inkscape"
    echo "   - librsvg: sudo apt install librsvg2-bin"
    exit 1
  fi
}

# Vérifier si les fichiers SVG existent
if [ ! -f "favicon.svg" ]; then
  echo "❌ Erreur: favicon.svg n'existe pas"
  exit 1
fi

echo "1️⃣ Génération favicon-16x16.png..."
convert_svg "favicon-16x16.png.svg" "favicon-16x16.png" 16

echo "2️⃣ Génération favicon-32x32.png..."
convert_svg "favicon-32x32.png.svg" "favicon-32x32.png" 32

echo "3️⃣ Génération apple-touch-icon.png (180x180)..."
convert_svg "apple-touch-icon.png.svg" "apple-touch-icon.png" 180

echo "4️⃣ Génération logo192.png..."
convert_svg "logo192.png.svg" "logo192.png" 192

echo "5️⃣ Génération logo512.png..."
convert_svg "logo512.png.svg" "logo512.png" 512

# Générer favicon.ico multi-résolution
echo "6️⃣ Génération favicon.ico (multi-résolution)..."
if command -v convert &> /dev/null; then
  convert favicon-16x16.png favicon-32x32.png -colors 256 favicon.ico
  echo "✅ favicon.ico créé (16x16 + 32x32)"
else
  echo "⚠️  favicon.ico nécessite ImageMagick"
fi

# Nettoyage des fichiers SVG temporaires
echo ""
echo "🧹 Nettoyage des fichiers SVG temporaires..."
rm -f favicon-16x16.png.svg favicon-32x32.png.svg apple-touch-icon.png.svg logo192.png.svg logo512.png.svg

echo ""
echo "✅ Tous les favicons ont été générés avec succès!"
echo ""
echo "📋 Fichiers créés:"
echo "  • favicon.svg (moderne, vectoriel)"
echo "  • favicon.ico (multi-résolution)"
echo "  • favicon-16x16.png"
echo "  • favicon-32x32.png"
echo "  • apple-touch-icon.png (180x180)"
echo "  • logo192.png"
echo "  • logo512.png"
echo ""
echo "🎯 Les favicons sont prêts à être utilisés!"
