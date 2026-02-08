# Chrome Web Store Screenshots Guide

## 📸 Screenshot Requirements

### **Chrome Web Store Specifications**
- **Minimum Size**: 1280x800 pixels
- **Maximum Size**: 1280x800 pixels  
- **Format**: PNG or JPG
- **Quality**: High resolution, no compression artifacts
- **Content**: Must show actual extension functionality
- **Text**: Must be readable and not pixelated
- **Background**: Clean, professional appearance

### **Required Screenshots**
1. **Primary Screenshot** (1280x800) - Main extension view
2. **Additional Screenshots** (Optional, up to 4) - Features showcase

## 🖼️ Screenshot Templates & Layouts

### **Screenshot 1: Main Clock Display**
```
┌─────────────────────────────────────────────────────────────┐
│                                                     │
│  🌍 WORLD CLOCK WALLPAPER                           │
│                                                     │
│              14:30:45                                  │
│         Monday, January 7, 2024                        │
│            Local Time                                    │
│                                                     │
│  🕐 New York   🕐 London    🕐 Tokyo            │
│   09:30:45      14:30:45    23:30:45          │
│   Jan 7         Jan 7        Jan 8               │
│                                                     │
│   [⚙️]                                    [ℹ️]       │
│                                                     │
└─────────────────────────────────────────────────────────────┘
```

### **Screenshot 2: Settings Panel**
```
┌─────────────────────────────────────────────────────────────┐
│  ⚙️ Configuration                                    │
│                                                     │
│  🎨 Background Color:  [■] #1a1a2e                │
│  🎨 Font Color:       [■] #ffffff                │
│  🔤 Font Family:      [Arial ▼]                  │
│  📏 Font Size:        16 ————●———— 48            │
│  🕐 Time Format:      [24-hour ▼]                │
│  📅 Date Format:      [Long ▼]                    │
│                                                     │
│  🌍 Additional Timezones:                             │
│  [New York ▼] [Add] ✅ New York [Remove]        │
│  ✅ London      [Remove]                              │
│                                                     │
│  [💾 Save] [🔄 Reset]                              │
└─────────────────────────────────────────────────────────────┘
```

### **Screenshot 3: Multiple Timezones**
```
┌─────────────────────────────────────────────────────────────┐
│                                                     │
│         🕐 New York          🕐 Los Angeles        │
│      09:30:45 AM           06:30:45 AM            │
│   Monday, Jan 7          Monday, Jan 7             │
│                                                     │
│         🕐 London            🕐 Paris              │
│      14:30:45 PM           15:30:45 PM            │
│   Monday, Jan 7          Monday, Jan 7             │
│                                                     │
│         🕐 Tokyo             🕐 Sydney             │
│      23:30:45 AM           10:30:45 AM            │
│    Tuesday, Jan 8         Tuesday, Jan 8           │
│                                                     │
└─────────────────────────────────────────────────────────────┘
```

### **Screenshot 4: Dark Theme Variant**
```
┌─────────────────────────────────────────────────────────────┐
│                                                     │
│               21:45:30                                  │
│         Monday, January 7, 2024                        │
│            Local Time                                    │
│                                                     │
│  🎨 Customized Theme Example                            │
│                                                     │
│  Background: Deep Navy Blue                           │
│  Text: Soft White                                      │
│  Font: Georgia (Serif)                              │
│                                                     │
└─────────────────────────────────────────────────────────────┘
```

### **Screenshot 5: Mobile Responsive**
```
┌─────────────────────────────────────────────────────────────┐
│                                                     │
│              14:30:45                                 │
│         Monday, January 7, 2024                        │
│            Local Time                                    │
│                                                     │
│  🕐 New York                                       │
│   09:30:45                                           │
│   Jan 7                                              │
│                                                     │
│  🕐 London                                         │
│   14:30:45                                           │
│   Jan 7                                              │
│                                                     │
│  [⚙️]                                         [ℹ️]  │
│                                                     │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Visual Design Guidelines

### **Color Schemes**
```css
/* Default Theme */
background: #1a1a2e (Deep Navy)
text: #ffffff (Pure White)
accent: #3498db (Soft Blue)

/* Alternative Themes */
background: #2c3e50 (Dark Blue)
text: #ecf0f1 (Light Gray)
accent: #3498db (Soft Blue)
```

### **Typography**
```css
/* Main Clock */
font-family: Arial, sans-serif
font-size: clamp(48px, 8vw, 120px)
font-weight: 300

/* Secondary Clocks */
font-family: Arial, sans-serif  
font-size: clamp(18px, 2.5vw, 28px)
font-weight: 400
```

### **Layout Principles**
- **Center alignment** for main clock
- **Horizontal layout** for additional clocks
- **Consistent spacing** and alignment
- **Clear visual hierarchy** (main > secondary)
- **Accessible contrast** (WCAG AA compliant)

## 📷 Screenshot Capture Checklist

### **Before Capturing**
- [ ] Open extension in Chrome Developer Mode
- [ ] Set up multiple timezones for variety
- [ ] Choose different themes for visual interest
- [ ] Ensure clean browser window (no bookmarks)
- [ ] Set browser to 1280x800 resolution
- [ ] Disable browser extensions that might interfere

### **During Capture**
- [ ] Use high-DPI display for retina quality
- [ ] Capture full window including chrome
- [ ] Ensure no UI elements are cut off
- [ ] Verify all text is readable
- [ ] Check color accuracy
- [ ] Save as PNG for best quality

### **After Capture**
- [ ] Verify dimensions are exactly 1280x800
- [ ] Check file size is reasonable (<500KB)
- [ ] Ensure no personal information visible
- [ ] Test on different displays for quality
- [ ] Create variations for A/B testing

## 🛠️ Tools & Resources

### **Screenshot Tools**
- **Chrome Developer Tools**: Device mode for precise sizing
- **Snagit**: Professional capture software
- **Lightshot**: Free screenshot tool
- **GIMP**: Free image editor for post-processing
- **Photoshop**: Professional editing

### **Browser Setup**
```bash
# Chrome Developer Mode
1. Go to chrome://extensions/
2. Enable "Developer mode"
3. Load unpacked extension from ./dist/
4. Open new tab to test
5. Use Chrome DevTools for responsive testing
```

### **Automation Script**
```bash
#!/bin/bash
# Screenshot automation (requires Chrome headless)
google-chrome --headless --disable-gpu \
  --window-size=1280,800 \
  --screenshot=store-screenshot-1.png \
  chrome-extension://$(extension-id)/index.html
```

## 📝 Image Optimization

### **PNG Optimization**
```bash
# Optimize screenshots for web
pngquant --quality=85 --output store-screenshot-1-opt.png store-screenshot-1.png
optipng -o7 store-screenshot-1-opt.png

# Target file size: <300KB per screenshot
# Target quality: No visible artifacts
```

### **Compression Targets**
- **File Size**: <300KB per screenshot
- **Format**: PNG-8 or PNG-24
- **Color Profile**: sRGB
- **Compression**: Lossless, optimized

## 🎯 Naming Convention

### **File Names**
```
store-screenshot-1-main-clock.png
store-screenshot-2-settings-panel.png  
store-screenshot-3-multiple-timezones.png
store-screenshot-4-dark-theme.png
store-screenshot-5-mobile-responsive.png
```

### **Alt Text for Store**
```
1. "Main world clock display showing local time with additional timezone clocks"
2. "Settings panel showing customization options for colors, fonts, and timezones"
3. "Multiple timezone clocks displaying New York, London, Tokyo, and Sydney times"
4. "Dark theme variant showing customizable color scheme options"
5. "Mobile responsive design displaying clock on smaller screen"
```

## 📋 Production Checklist

### **Final Review**
- [ ] All screenshots are 1280x800 pixels
- [ ] Images are in PNG format
- [ ] File sizes are under 300KB each
- [ ] No personal data visible in screenshots
- [ ] Text is readable and not pixelated
- [ ] Colors match the actual extension appearance
- [ ] All features are showcased across screenshots
- [ ] Professional quality and appearance
- [ ] Accessibility features are visible where appropriate

### **Store Upload Ready**
- [ ] Screenshots organized and named correctly
- [ ] Image optimization completed
- [ ] Alt text prepared for store listing
- [ ] Quality assurance validated
- [ ] No trademark or copyright violations

## 🚀 Next Steps

After screenshot creation:
1. ✅ **Upload to Chrome Web Store Developer Console**
2. ✅ **Add descriptive alt text** for each image
3. ✅ **Arrange screenshot order** for storytelling
4. ✅ **Test store preview** before publishing
5. ✅ **Prepare localized versions** if needed

The screenshots should tell a story of the extension's capabilities and user experience.