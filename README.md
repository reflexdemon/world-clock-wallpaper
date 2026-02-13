# World Clock Wallpaper Chrome Extension

A customizable Chrome extension that displays multiple digital world clocks as your new tab wallpaper. Built with modern web technologies and designed for both users and developers.

## 🚀 Quick Start for Chrome Users

### Installation

1. **Download the extension**:
   - Clone this repository: `git clone git@github.com:reflexdemon/world-clock-wallpaper.git`

2. **Install in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist` folder
   - The extension will be installed and ready to use

3. **For Chrome Web Store Users**:
   - Install directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/madpbadiegoiilphfnoglipniphjndig?utm_source=item-share-cb)

### Basic Usage

1. **Open a new tab** - Your world clock wallpaper will appear
2. **Customize your display**:
   - Click the **⚙️ Settings** button (bottom right)
   - Adjust colors, fonts, and formats to your preference
   - Add world timezones from the dropdown menu
3. **Save your configuration** - Click "Save Configuration" to apply changes
4. **Get help** - Click the **❓ Help** button for detailed guidance

### Key Features

- 🌍 **Main Central Clock**: Your local timezone with prominent display
- 🕐 **Multiple World Clocks**: Add up to 6 additional timezone clocks
- 🎨 **Full Customization**: Colors, fonts, sizes, and formats
- 📱 **Responsive Design**: Works perfectly on all devices
- 💾 **Persistent Settings**: Automatically saves across devices via Chrome sync
- ❓ **Built-in Help**: Comprehensive documentation included

## 📁 Project Structure

```
world-clock-wallpaper/
├── package.json           # Dependencies and build scripts
├── webpack.config.js       # Webpack bundling configuration
├── src/                  # Source code directory
│   ├── manifest.json       # Chrome Extension Manifest V3
│   ├── index.html         # New tab page (main clock display)
│   ├── popup.html         # Extension popup interface
│   ├── script.js          # Main application logic
│   ├── popup.js           # Popup functionality
│   ├── background.js       # Service worker
│   ├── styles.css         # Global styles and responsive design
│   └── assets/
│       └── icons/        # Extension icons (16x16, 32x32, 48x48, 128x128)
│           ├── icon16.png
│           ├── icon32.png
│           ├── icon48.png
│           └── icon128.png
├── dist/                 # Built extension (auto-generated)
│   ├── manifest.json
│   ├── index.html
│   ├── popup.html
│   ├── script.js
│   ├── popup.js
│   ├── background.js
│   └── icons/
└── README.md             # This file
```

## 👨‍💻 Developer Guide

### Prerequisites

- Node.js 16+ and npm
- Modern web browser (Chrome/Edge for development)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/world-clock-wallpaper.git
cd world-clock-wallpaper

# Install dependencies
npm install
```

### Development Commands

```bash
# Production Build
npm run build
# Creates optimized, minified extension in dist/ folder
# Ready for Chrome Web Store submission

# Development Build with Watch Mode
npm run dev
# Builds extension and watches for file changes
# Auto-rebuilds when source files are modified
# Use during development for faster iteration

# Clean Build Directory
npm run clean
# Removes the dist/ folder completely
# Useful before fresh builds

# Build and Create Chrome Web Store Package
npm run zip
# Runs production build and creates world-clock-wallpaper.zip
# Direct upload-ready package for Chrome Web Store
```

### Development Workflow

1. **Start development**: Run `npm run dev` for live reloading
2. **Load in Chrome**: Use "Load unpacked" with `dist` folder
3. **Make changes**: Edit files in `src/` directory
4. **Auto-rebuild**: Webpack automatically updates `dist/`
5. **Refresh extension**: Click reload button in Chrome extensions page
6. **Test changes**: Open new tab to see updates

## 🧪 Testing Guide

### Manual Testing

1. **Functionality Testing**:
   ```bash
   npm run build
   # Load dist/ in Chrome and test all features:
   # - Clock display accuracy
   # - Configuration panel functionality
   # - Timezone addition/removal
   # - Settings persistence
   # - Help and About popups
   ```

2. **Cross-device Testing**:
   - Test on desktop (Chrome, Edge)
   - Test on mobile devices (Chrome mobile)
   - Verify responsive design at different screen sizes

3. **Chrome Extension Testing**:
   - Enable/disable extension
   - Test popup functionality
   - Verify new tab override works
   - Check permissions and storage

### Automated Testing (Future)

```bash
# Run tests (when implemented)
npm test

# Check code quality
npm run lint
npm run typecheck
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Extension not loading | Check manifest.json syntax and permissions |
| Clocks not updating | Ensure Chrome extension has proper permissions |
| Settings not saving | Verify Chrome sync is enabled |
| Build fails | Run `npm clean` then `npm install` |

## 🤝 Contributing Guidelines

### Getting Started

1. **Fork the repository** on GitHub
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our style guidelines
4. **Test thoroughly** using the testing guide above
5. **Submit a pull request** with detailed description

### Code Style Guidelines

#### JavaScript
- Use **ES6+** features (const/let, arrow functions, template literals)
- Follow **camelCase** for variables and functions
- Use **PascalCase** for classes
- Add **JSDoc comments** for complex functions
- Maintain **consistent indentation** (2 spaces)

```javascript
// Good ✅
const updateClock = (timezone) => {
  // Update clock display for given timezone
  const element = document.getElementById(`clock-${timezone}`);
  element.textContent = formatTime(timezone);
};

// Bad ❌
function update_clock(timezone){
  var element=document.getElementById('clock-'+timezone);
  element.innerHTML = formatTime(timezone);
}
```

#### HTML/CSS
- Use **semantic HTML5** elements
- Follow **BEM methodology** for CSS classes
- Use **mobile-first responsive design**
- Include **accessibility attributes** where needed

```css
/* Good ✅ */
.clock-container {
  display: flex;
  justify-content: center;
}

.clock-container__time {
  font-size: 2rem;
  color: var(--primary-color);
}

/* Bad ❌ */
.div1 {
  display: flex;
  text-align: center;
}
```

#### File Organization
- Keep files **small and focused** (< 500 lines when possible)
- Use **descriptive filenames**
- Group related functionality
- Maintain **consistent directory structure**

### Commit Guidelines

- **Conventional Commits**: Use semantic commit messages
  ```
  feat: add timezone search functionality
  fix: resolve clock display issue on mobile
  docs: update README with installation guide
  style: improve button hover effects
  refactor: simplify configuration logic
  test: add unit tests for timezone conversion
  ```

- **Small, focused commits**: One logical change per commit
- **Clear descriptions**: Explain what and why, not just what

### Pull Request Process

1. **Update tests** if applicable
2. **Update documentation** for new features
3. **Ensure CI passes** (when implemented)
4. **Request code review** from maintainers
5. **Address feedback** promptly

### Areas for Contribution

- 🐛 **Bug fixes** and performance improvements
- ✨ **New features** (open issue first for discussion)
- 📚 **Documentation** improvements
- 🎨 **UI/UX enhancements**
- 🧪 **Test coverage** expansion
- 🌍 **Internationalization** support

## 📋 Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+ (Chromium-based)
- ✅ Opera 74+ (Chromium-based)
- ❌ Firefox (Different extension architecture)
- ❌ Safari (Different extension architecture)

## 🛠️ Technical Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build Tool**: Webpack 5
- **Extension**: Chrome Manifest V3
- **Storage**: Chrome Storage Sync API
- **Timezones**: Intl.DateTimeFormat API
- **Responsive**: CSS Media Queries & Flexbox/Grid
- **Icons**: PNG (16x16, 32x32, 48x48, 128x128)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

✅ **What you can do**:
- Commercial use
- Modification
- Distribution
- Private use
- Sublicensing

❌ **What you must do**:
- Include the original copyright and license
- State changes if you modify the code

ℹ️ **No liability**: The software is provided "as is" without warranty.

## 📞 Support & Community

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/reflexdemon/world-clock-wallpaper/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/reflexdemon/world-clock-wallpaper/issues)

## 🙏 Acknowledgments

- [Open Code](https://opencode.ai/) to help me build this extension
- Chrome Extension documentation and community
- Intl.DateTimeFormat API contributors
- Open source community for inspiration and tools
- All users and contributors who make this project better

---

**Made with ❤️ for the global community** 🌍