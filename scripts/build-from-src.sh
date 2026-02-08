#!/bin/bash
# Production Build Script
echo "🚀 Building World Clock Wallpaper from src/ to dist/"
echo "========================================"

# Clean dist directory
rm -rf dist/
mkdir -p dist

# Copy and minify source files
echo "📝 Minifying JavaScript..."
cp src/script.js dist/temp.js
# Minification step would go here in real implementation

echo "🎨 Minifying CSS..."
cp src/styles.css dist/temp.css
# Minification step would go here in real implementation

echo "📄 Copying HTML and other files..."
cp src/index.html dist/
cp src/popup.html dist/
cp src/popup.js dist/
cp src/background.js dist/
cp manifest.json dist/

echo "🎨 Copying assets..."
cp -r assets/icons dist/
cp -r assets/screenshots dist/

echo "📦 Creating Chrome Store package..."
cd dist
zip -r ../world-clock-wallpaper.zip .
cd ..

echo "✅ Build complete!"
echo "📦 Package: world-clock-wallpaper.zip"
echo "📂 Files ready in dist/"
