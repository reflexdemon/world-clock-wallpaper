# World Clock Wallpaper Chrome Extension

A customizable Chrome extension that displays multiple digital world clocks as your new tab wallpaper.

## Features

- **Main Central Clock**: Displays your current timezone with a larger font
- **Additional Clocks**: Add multiple clocks from different timezones
- **Full Customization**:
  - Background color
  - Font color
  - Font family and size
  - Time format (12/24 hour)
  - Date format (long/medium/short)
- **Responsive Design**: Works perfectly on desktops, tablets, and mobile devices
- **Persistent Settings**: Configuration saved using Chrome storage API

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will be installed and ready to use

## Usage

1. Open a new tab - the world clock display will appear
2. Click the settings button (⚙️) in the top right corner
3. Customize your display:
   - Choose background and font colors
   - Select font family and size
   - Set time and date formats
   - Add additional timezones from the dropdown
4. Click "Save Configuration" to persist your settings

## File Structure

```
world-clock-wallpaper/
├── manifest.json          # Extension configuration
├── index.html             # Main new tab page
├── popup.html             # Extension popup
├── styles.css             # Responsive CSS styling
├── script.js              # Main functionality
├── popup.js               # Popup script
├── background.js          # Background service worker
└── icons/                 # Extension icons (16x16, 48x48, 128x128)
```

## Technical Details

- **Built with**: Vanilla JavaScript, HTML5, CSS3
- **Chrome Extension Manifest**: V3
- **Storage**: Chrome Storage Sync API
- **Timezones**: Intl.DateTimeFormat API
- **Responsive**: CSS media queries for all screen sizes

## Customization Options

### Display Settings
- Background color picker
- Font color picker
- Font family selection (Arial, Helvetica, Georgia, etc.)
- Font size slider (12px - 48px)

### Time/Date Formats
- 12-hour or 24-hour time format
- Long, medium, or short date formats

### Timezone Management
- Add multiple timezones from major world cities
- Remove unwanted timezones
- Automatic timezone detection for main clock

## Browser Compatibility

- Chrome 88+
- Edge 88+ (Chromium-based)
- Other Chromium-based browsers

## License

MIT License - feel free to modify and distribute.