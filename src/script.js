import './styles.css';

// World Clock Wallpaper Extension Script
class WorldClockWallpaper {
    constructor() {
        this.config = {
            bgColor: '#1a1a2e',
            fontColor: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            timeFormat: '24',
            dateFormat: 'long',
            additionalTimezones: []
        };
        
        this.clockIntervals = [];
        this.init();
    }
    
    async init() {
        await this.loadConfig();
        this.populateTimezones();
        this.applyConfig();
        this.setupEventListeners();
        this.startClocks();
    }
    
    async loadConfig() {
        try {
            const stored = await chrome.storage.sync.get('worldClockConfig');
            if (stored.worldClockConfig) {
                this.config = { ...this.config, ...stored.worldClockConfig };
            }
        } catch (error) {
            console.log('No stored config found, using defaults');
        }
    }
    
    async saveConfig() {
        try {
            await chrome.storage.sync.set({ worldClockConfig: this.config });
            console.log('Configuration saved');
        } catch (error) {
            console.error('Failed to save config:', error);
        }
    }
    
    populateTimezones() {
        const timezoneSelect = document.getElementById('timezoneSelect');
        
        try {
            // Get all supported timezones from Intl API
            const timezones = Intl.supportedValuesOf('timeZone');
            
            // Sort timezones by region and city for better organization
            const sortedTimezones = timezones.sort((a, b) => {
                const aRegion = a.split('/')[0];
                const bRegion = b.split('/')[0];
                
                if (aRegion !== bRegion) {
                    return aRegion.localeCompare(bRegion);
                }
                
                return a.localeCompare(b);
            });
            
            // Clear existing options except the first one
            timezoneSelect.innerHTML = '<option value="">Select timezone...</option>';
            
            // Group timezones by region
            const regions = {};
            sortedTimezones.forEach(timezone => {
                const region = timezone.split('/')[0];
                if (!regions[region]) {
                    regions[region] = [];
                }
                regions[region].push(timezone);
            });
            
            // Create optgroups for each region
            Object.keys(regions).sort().forEach(region => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = region;
                
                regions[region].forEach(timezone => {
                    const option = document.createElement('option');
                    option.value = timezone;
                    
                    // Create a more readable display name
                    const city = timezone.split('/').slice(1).join('/').replace(/_/g, ' ');
                    option.textContent = city;
                    
                    optgroup.appendChild(option);
                });
                
                timezoneSelect.appendChild(optgroup);
            });
            
        } catch (error) {
            console.error('Failed to populate timezones:', error);
            
            // Fallback to manual list if Intl API is not supported
            const fallbackTimezones = [
                'America/New_York', 'America/Los_Angeles', 'America/Chicago',
                'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai',
                'Asia/Dubai', 'Australia/Sydney', 'Pacific/Auckland'
            ];
            
            timezoneSelect.innerHTML = '<option value="">Select timezone...</option>';
            fallbackTimezones.forEach(timezone => {
                const option = document.createElement('option');
                option.value = timezone;
                option.textContent = timezone.split('/').pop().replace(/_/g, ' ');
                timezoneSelect.appendChild(option);
            });
        }
    }
    
    applyConfig() {
        // Apply background color
        document.body.style.backgroundColor = this.config.bgColor;
        
        // Apply font settings
        document.body.style.color = this.config.fontColor;
        document.body.style.fontFamily = this.config.fontFamily;
        document.body.style.fontSize = this.config.fontSize + 'px';
        
        // Update form values
        document.getElementById('bgColor').value = this.config.bgColor;
        document.getElementById('fontColor').value = this.config.fontColor;
        document.getElementById('fontFamily').value = this.config.fontFamily;
        document.getElementById('fontSize').value = this.config.fontSize;
        document.getElementById('fontSizeValue').textContent = this.config.fontSize + 'px';
        document.getElementById('timeFormat').value = this.config.timeFormat;
        document.getElementById('dateFormat').value = this.config.dateFormat;
        
        // Update additional timezones display
        this.updateTimezonesDisplay();
    }
    
    setupEventListeners() {
        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            document.getElementById('configPanel').classList.add('open');
        });
        
        // Close config button
        document.getElementById('closeConfig').addEventListener('click', () => {
            document.getElementById('configPanel').classList.remove('open');
        });
        
        // Background color
        document.getElementById('bgColor').addEventListener('input', (e) => {
            this.config.bgColor = e.target.value;
            document.body.style.backgroundColor = e.target.value;
        });
        
        // Font color
        document.getElementById('fontColor').addEventListener('input', (e) => {
            this.config.fontColor = e.target.value;
            document.body.style.color = e.target.value;
        });
        
        // Font family
        document.getElementById('fontFamily').addEventListener('change', (e) => {
            this.config.fontFamily = e.target.value;
            document.body.style.fontFamily = e.target.value;
        });
        
        // Font size
        document.getElementById('fontSize').addEventListener('input', (e) => {
            this.config.fontSize = parseInt(e.target.value);
            document.body.style.fontSize = e.target.value + 'px';
            document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
        });
        
        // Time format
        document.getElementById('timeFormat').addEventListener('change', (e) => {
            this.config.timeFormat = e.target.value;
            this.updateAllClocks();
        });
        
        // Date format
        document.getElementById('dateFormat').addEventListener('change', (e) => {
            this.config.dateFormat = e.target.value;
            this.updateAllClocks();
        });
        
        // Add timezone
        document.getElementById('addTimezone').addEventListener('click', () => {
            const select = document.getElementById('timezoneSelect');
            const timezone = select.value;
            
            if (timezone && !this.config.additionalTimezones.includes(timezone)) {
                this.config.additionalTimezones.push(timezone);
                this.updateTimezonesDisplay();
                this.addAdditionalClock(timezone);
                select.value = '';
            }
        });
        
        // Save configuration
        document.getElementById('saveConfig').addEventListener('click', () => {
            this.saveConfig();
            this.showNotification('Configuration saved successfully!');
        });
        
        // Reset configuration
        document.getElementById('resetConfig').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset to default settings?')) {
                this.resetToDefault();
            }
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('configPanel');
            const settingsBtn = document.getElementById('settingsBtn');
            
            if (!panel.contains(e.target) && e.target !== settingsBtn && panel.classList.contains('open')) {
                panel.classList.remove('open');
            }
        });
        
        // About button
        document.getElementById('aboutBtn').addEventListener('click', () => {
            document.getElementById('aboutPopup').classList.add('open');
        });
        
        // Close about button
        document.getElementById('closeAbout').addEventListener('click', () => {
            document.getElementById('aboutPopup').classList.remove('open');
        });
        
        // Close about popup when clicking outside
        document.getElementById('aboutPopup').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                document.getElementById('aboutPopup').classList.remove('open');
            }
        });
        
        // Set current year for copyright
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close config panel if open
                const configPanel = document.getElementById('configPanel');
                if (configPanel.classList.contains('open')) {
                    configPanel.classList.remove('open');
                }
                
                // Close about popup if open
                const aboutPopup = document.getElementById('aboutPopup');
                if (aboutPopup.classList.contains('open')) {
                    aboutPopup.classList.remove('open');
                }
            }
        });
    }
    
    startClocks() {
        // Clear existing intervals
        this.clockIntervals.forEach(interval => clearInterval(interval));
        this.clockIntervals = [];
        
        // Start main clock
        this.updateMainClock();
        const mainInterval = setInterval(() => this.updateMainClock(), 1000);
        this.clockIntervals.push(mainInterval);
        
        // Start additional clocks
        this.config.additionalTimezones.forEach(timezone => {
            this.addAdditionalClock(timezone);
        });
    }
    
    updateMainClock() {
        const now = new Date();
        const timeElement = document.getElementById('mainTime');
        const dateElement = document.getElementById('mainDate');
        const timezoneElement = document.getElementById('mainTimezone');
        
        // Update time
        timeElement.textContent = this.formatTime(now);
        
        // Update date
        dateElement.textContent = this.formatDate(now);
        
        // Update timezone
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        timezoneElement.textContent = this.formatTimezoneName(userTimezone);
    }
    
    addAdditionalClock(timezone) {
        const container = document.getElementById('additionalClocks');
        
        // Check if clock already exists
        let clockElement = document.getElementById(`clock-${timezone.replace(/[\/]/g, '-')}`);
        
        if (!clockElement) {
            clockElement = document.createElement('div');
            clockElement.className = 'additional-clock';
            clockElement.id = `clock-${timezone.replace(/[\/]/g, '-')}`;
            
            clockElement.innerHTML = `
                <div class="time"></div>
                <div class="date"></div>
                <div class="timezone"></div>
            `;
            
            container.appendChild(clockElement);
        }
        
        // Update clock immediately
        this.updateAdditionalClock(timezone, clockElement);
        
        // Set up interval for updates
        const interval = setInterval(() => {
            this.updateAdditionalClock(timezone, clockElement);
        }, 1000);
        
        this.clockIntervals.push(interval);
    }
    
    updateAdditionalClock(timezone, clockElement) {
        try {
            const now = new Date();
            const options = {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: this.config.timeFormat === '12'
            };
            
            const formatter = new Intl.DateTimeFormat('en-US', options);
            const parts = formatter.formatToParts(now);
            
            const timeStr = this.formatTimeForTimezone(now, timezone);
            const dateStr = this.formatDateForTimezone(now, timezone);
            
            clockElement.querySelector('.time').textContent = timeStr;
            clockElement.querySelector('.date').textContent = dateStr;
            clockElement.querySelector('.timezone').textContent = this.formatTimezoneName(timezone);
            
        } catch (error) {
            console.error('Error updating additional clock:', error);
        }
    }
    
    formatTime(date) {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: this.config.timeFormat === '12'
        };
        
        return date.toLocaleTimeString('en-US', options);
    }
    
    formatDate(date) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        if (this.config.dateFormat === 'medium') {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } else if (this.config.dateFormat === 'short') {
            return date.toLocaleDateString('en-US');
        }
        
        return date.toLocaleDateString('en-US', options);
    }
    
    formatTimeForTimezone(date, timezone) {
        const options = {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: this.config.timeFormat === '12'
        };
        
        return date.toLocaleTimeString('en-US', options);
    }
    
    formatDateForTimezone(date, timezone) {
        const options = {
            timeZone: timezone,
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        if (this.config.dateFormat === 'short') {
            return date.toLocaleDateString('en-US', { timeZone: timezone });
        } else if (this.config.dateFormat === 'long') {
            options.weekday = 'long';
            options.month = 'long';
        }
        
        return date.toLocaleDateString('en-US', options);
    }
    
    formatTimezoneName(timezone) {
        const city = timezone.split('/').pop().replace(/_/g, ' ');
        return city;
    }
    
    updateTimezonesDisplay() {
        const container = document.getElementById('addedTimezones');
        container.innerHTML = '';
        
        this.config.additionalTimezones.forEach(timezone => {
            const item = document.createElement('div');
            item.className = 'timezone-item';
            
            const name = this.formatTimezoneName(timezone);
            
            item.innerHTML = `
                <span>${name}</span>
                <button class="remove-btn" data-timezone="${timezone}">Remove</button>
            `;
            
            container.appendChild(item);
        });
        
        // Add remove event listeners
        container.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const timezone = e.target.dataset.timezone;
                this.removeTimezone(timezone);
            });
        });
    }
    
    removeTimezone(timezone) {
        const index = this.config.additionalTimezones.indexOf(timezone);
        if (index > -1) {
            this.config.additionalTimezones.splice(index, 1);
            
            // Remove clock element
            const clockElement = document.getElementById(`clock-${timezone.replace(/[\/]/g, '-')}`);
            if (clockElement) {
                clockElement.remove();
            }
            
            this.updateTimezonesDisplay();
        }
    }
    
    updateAllClocks() {
        this.updateMainClock();
        
        this.config.additionalTimezones.forEach(timezone => {
            const clockElement = document.getElementById(`clock-${timezone.replace(/[\/]/g, '-')}`);
            if (clockElement) {
                this.updateAdditionalClock(timezone, clockElement);
            }
        });
    }
    
    resetToDefault() {
        this.config = {
            bgColor: '#1a1a2e',
            fontColor: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            timeFormat: '24',
            dateFormat: 'long',
            additionalTimezones: []
        };
        
        // Clear all additional clocks
        document.getElementById('additionalClocks').innerHTML = '';
        
        // Apply defaults and restart
        this.applyConfig();
        this.startClocks();
        this.saveConfig();
        
        this.showNotification('Settings reset to default!');
    }
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 255, 0, 0.3);
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            border: 1px solid rgba(0, 255, 0, 0.4);
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new WorldClockWallpaper();
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);