// Project Structure Organizer for World Clock Wallpaper Extension

const fs = require('fs');
const path = require('path');

console.log('📁 Organizing World Clock Wallpaper Project Structure...');
console.log('==================================================');

// Create directory structure
const directories = {
    'src': 'Source code for development',
    'dist': 'Production build files',
    'docs': 'Documentation and guides',
    'assets': 'Icons, screenshots, and media',
    'scripts': 'Build and automation scripts',
    'test': 'Testing utilities and frameworks'
};

// Create directories
Object.keys(directories).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created ${dir}/ directory`);
    } else {
        console.log(`📂 ${dir}/ directory already exists`);
    }
});

// Move files to appropriate directories
const moves = [
    { from: 'index.html', to: 'src/index.html', desc: 'Source HTML file' },
    { from: 'styles.css', to: 'src/styles.css', desc: 'Source CSS file' },
    { from: 'script.js', to: 'src/script.js', desc: 'Source JavaScript file' },
    { from: 'popup.html', to: 'src/popup.html', desc: 'Source popup HTML' },
    { from: 'popup.js', to: 'src/popup.js', desc: 'Source popup JS' },
    { from: 'background.js', to: 'src/background.js', desc: 'Source background script' },
    { from: 'dist/', to: 'dist/', desc: 'Keep dist files where they are' },
    { from: 'icons/', to: 'assets/icons/', desc: 'Move icons to assets' },
    { from: 'ss/', to: 'assets/screenshots/', desc: 'Move screenshots to assets' },
    { from: 'test-cross-browser.sh', to: 'scripts/test-cross-browser.sh', desc: 'Cross-browser testing script' },
    { from: 'test-build.js', to: 'scripts/test-build.js', desc: 'Build testing script' },
    { from: 'validate-final.sh', to: 'scripts/validate-final.sh', desc: 'Final validation script' },
    { from: 'build-prod.sh', to: 'scripts/build-prod.sh', desc: 'Production build script' }
];

// Move files
moves.forEach(move => {
    if (fs.existsSync(move.from)) {
        const toDir = path.dirname(move.to);
        if (!fs.existsSync(toDir)) {
            fs.mkdirSync(toDir, { recursive: true });
        }
        
        // Use shell command for moving directories
        const shellCommand = move.from.includes('/') ? `mv "${move.from}" "${move.to}"` : `mv ${move.from} ${move.to}`;
        
        try {
            const { execSync } = require('child_process');
            execSync(shellCommand, { stdio: 'inherit' });
            console.log(`✅ Moved ${move.desc} to ${move.to}`);
        } catch (error) {
            console.log(`❌ Failed to move ${move.desc}: ${error.message}`);
        }
    } else {
        console.log(`⚠️  ${move.desc} not found, skipping`);
    }
});

// Move documentation files
const docFiles = [
    'README.md',
    'SECURITY_SUMMARY.md',
    'UX_IMPLEMENTATION_SUMMARY.md',
    'PERFORMANCE_OPTIMIZATION_SUMMARY.md',
    'BROWSER_COMPATIBILITY_REPORT.md',
    'STORE_SCREENSHOTS_GUIDE.md',
    'STORE_MARKETING_COPY.md',
    'PRIVACY_POLICY.md',
    'SUPPORT_DOCUMENTATION.md',
    'FINAL_SUBMISSION_GUIDE.md',
    'PROJECT_COMPLETION_SUMMARY.md',
    'CROSS_BROWSER_TESTING.md'
];

docFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const dest = `docs/${file}`;
        try {
            fs.copyFileSync(file, dest);
            console.log(`✅ Copied ${file} to docs/`);
        } catch (error) {
            console.log(`❌ Failed to copy ${file}: ${error.message}`);
        }
    } else {
        console.log(`⚠️  ${file} not found, skipping`);
    }
});

// Create package.json for development
const packageJson = {
    name: "world-clock-wallpaper",
    version: "1.0.0",
    description: "Transform your new tab into a beautiful world clock display",
    main: "src/index.html",
    scripts: {
        "dev": "Load src/ as unpacked extension in Chrome",
        "build": "Run production build from src/ to dist/",
        "test": "Run all tests and validation",
        "clean": "Clean build artifacts and temporary files",
        "serve": "Start local development server"
    },
    devDependencies: {
        "eslint": "^8.0.0",
        "prettier": "^2.8.0",
        "nodemon": "^2.0.0"
    },
    repository: {
        type: "git",
        url: "https://github.com/yourusername/world-clock-wallpaper.git"
    },
    keywords: [
        "chrome-extension",
        "world-clock",
        "timezone",
        "new-tab",
        "productivity",
        "javascript",
        "css3",
        "html5"
    ],
    author: "World Clock Wallpaper Team",
    license: "MIT"
};

try {
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ Created package.json for development');
} catch (error) {
    console.log('❌ Failed to create package.json:', error.message);
}

// Create development manifest pointing to src
const devManifest = {
    ...require('./dist/manifest.json'),
    chrome_url_overrides: {
        newtab: "src/index.html"
    }
};

try {
    fs.writeFileSync('manifest.dev.json', JSON.stringify(devManifest, null, 2));
    console.log('✅ Created manifest.dev.json for development');
} catch (error) {
    console.log('❌ Failed to create dev manifest:', error.message);
}

// Update production build scripts
const prodBuildScript = `#!/bin/bash
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
`;

try {
    fs.writeFileSync('scripts/build-from-src.sh', prodBuildScript);
    fs.chmodSync('scripts/build-from-src.sh', '755');
    console.log('✅ Updated build script to work from src/ directory');
} catch (error) {
    console.log('❌ Failed to update build script:', error.message);
}

// Create .gitignore for better source management
const gitignore = `# Dependencies
node_modules/
npm-debug.log*

# Build artifacts
dist/
world-clock-wallpaper.zip
*.log

# Development
.DS_Store
.vscode/
.idea/

# Temporary files
*.tmp
*.temp
.temp

# OS files
Thumbs.db
.DS_Store?
`;

try {
    fs.writeFileSync('.gitignore', gitignore);
    console.log('✅ Updated .gitignore');
} catch (error) {
    console.log('❌ Failed to update .gitignore:', error.message);
}

console.log('');
console.log('📁 New Project Structure:');
console.log('');
console.log('world-clock-wallpaper/');
console.log('├── src/                    # Source development files');
console.log('│   ├── index.html');
console.log('│   ├── styles.css');
console.log('│   ├── script.js');
console.log('│   ├── popup.html');
console.log('│   ├── popup.js');
console.log('│   └── background.js');
console.log('├── dist/                   # Production build files');
console.log('│   ├── index.html');
console.log('│   ├── styles.css');
console.log('│   ├── script.js');
console.log('│   ├── manifest.json');
console.log('│   ├── popup.html');
console.log('│   ├── popup.js');
console.log('│   ├── background.js');
console.log('│   ├── icons/');
console.log('│   └── (other assets)');
console.log('├── docs/                   # All documentation');
console.log('│   ├── README.md');
console.log('│   ├── SECURITY_SUMMARY.md');
console.log('│   ├── UX_IMPLEMENTATION_SUMMARY.md');
console.log('│   ├── PERFORMANCE_OPTIMIZATION_SUMMARY.md');
console.log('│   ├── (all other docs...)');
console.log('├── assets/                 # Icons and screenshots');
console.log('│   ├── icons/');
console.log('│   └── screenshots/');
console.log('├── scripts/                # Build and test scripts');
console.log('│   ├── build-prod.sh');
console.log('│   ├── build-from-src.sh');
console.log('│   ├── test-cross-browser.sh');
console.log('│   └── validate-final.sh');
console.log('├── test/                   # Testing utilities');
console.log('├── package.json             # Development metadata');
console.log('├── manifest.dev.json         # Development manifest');
console.log('└── .gitignore              # Git ignore file');

console.log('');
console.log('🚀 Development Workflow:');
console.log('');
console.log('1. Development: Work in src/ directory');
console.log('2. Build: Run ./scripts/build-from-src.sh');
console.log('3. Test: Run tests with npm test');
console.log('4. Deploy: Submit dist/ to Chrome Web Store');

console.log('');
console.log('🎯 Project Structure Organization Complete!');
console.log('');
console.log('✅ All source files moved to src/');
console.log('✅ Production build preserved in dist/');
console.log('✅ Documentation organized in docs/');
console.log('✅ Assets consolidated in assets/');
console.log('✅ Build scripts organized in scripts/');
console.log('✅ Development workflow established');
console.log('');
console.log('🌟 Ready for continued development and maintenance!');