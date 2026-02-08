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
        this.domCache = new Map(); // Cache DOM elements for performance
        this.updateQueue = []; // Batch DOM updates
        this.isUpdating = false;
        this.init();
    }
    
    // Input validation methods
    validateColor(color) {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexRegex.test(color) ? color : this.config.bgColor;
    }
    
    validateFontSize(size) {
        const numSize = parseInt(size);
        return (numSize >= 12 && numSize <= 48) ? numSize : 16;
    }
    
    validateTimeFormat(format) {
        return ['12', '24'].includes(format) ? format : '24';
    }
    
    validateDateFormat(format) {
        return ['short', 'medium', 'long'].includes(format) ? format : 'long';
    }
    
    sanitizeTimezone(timezone) {
        // Basic sanitization for timezone strings
        return timezone.replace(/[^a-zA-Z0-9_\/-]/g, '').substring(0, 50);
    }
    
    sanitizeElementId(id) {
        // Sanitize ID for DOM elements
        return id.replace(/[^a-zA-Z0-9_-]/g, '-');
    }
    
    // Performance: Cache DOM elements to avoid repeated queries
    getCachedElement(selector) {
        if (!this.domCache.has(selector)) {
            const element = document.querySelector(selector);
            if (element) {
                this.domCache.set(selector, element);
            }
        }
        return this.domCache.get(selector);
    }
    
    // Performance: Clear DOM cache when needed
    clearDOMCache() {
        this.domCache.clear();
    }
    
    // Performance: Batch DOM updates to reduce reflows
    batchUpdate(updateFn) {
        this.updateQueue.push(updateFn);
        
        if (!this.isUpdating) {
            this.isUpdating = true;
            requestAnimationFrame(() => {
                this.updateQueue.forEach(fn => fn());
                this.updateQueue = [];
                this.isUpdating = false;
            });
        }
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
            // No stored config found, using defaults
        }
    }
    
    async saveConfig() {
        const saveBtn = document.getElementById('saveConfig');
        const originalText = saveBtn.textContent;
        
        try {
            // Add loading state
            saveBtn.classList.add('loading');
            saveBtn.textContent = 'Saving...';
            saveBtn.disabled = true;
            
            await chrome.storage.sync.set({ worldClockConfig: this.config });
            this.showNotification('Configuration saved successfully!');
        } catch (error) {
            this.showNotification('Failed to save configuration', 'error');
        } finally {
            // Remove loading state
            saveBtn.classList.remove('loading');
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }
    }
    
    populateTimezones() {
        const timezoneSelect = document.getElementById('timezoneSelect');
        const addBtn = document.getElementById('addTimezone');
        const originalText = addBtn.textContent;
        
        // Add loading state to timezone select
        timezoneSelect.classList.add('loading');
        addBtn.disabled = true;
        addBtn.textContent = 'Loading...';
        
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
            timezoneSelect.textContent = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select timezone...';
            timezoneSelect.appendChild(defaultOption);
            
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
            // Failed to populate timezones, using fallback list
            
            // Fallback to manual list if Intl API is not supported
            const fallbackTimezones = [
                'America/New_York', 'America/Los_Angeles', 'America/Chicago',
                'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai',
                'Asia/Dubai', 'Australia/Sydney', 'Pacific/Auckland'
            ];
            
            timezoneSelect.textContent = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select timezone...';
            timezoneSelect.appendChild(defaultOption);
            
            fallbackTimezones.forEach(timezone => {
                const option = document.createElement('option');
                option.value = timezone;
                option.textContent = timezone.split('/').pop().replace(/_/g, ' ');
                timezoneSelect.appendChild(option);
            });
        }
        
        // Remove loading state
        timezoneSelect.classList.remove('loading');
        addBtn.disabled = false;
        addBtn.textContent = originalText;
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
        // Cache frequently used elements
        const settingsBtn = this.getCachedElement('#settingsBtn');
        const configPanel = this.getCachedElement('#configPanel');
        const closeConfig = this.getCachedElement('#closeConfig');
        const aboutBtn = this.getCachedElement('#aboutBtn');
        const aboutPopup = this.getCachedElement('#aboutPopup');
        const closeAbout = this.getCachedElement('#closeAbout');
        
        // Settings button
        if (settingsBtn) {
            this.settingsClickHandler = () => this.openConfigPanel();
            settingsBtn.addEventListener('click', this.settingsClickHandler);
        }
        
        // Close config button
        if (closeConfig) {
            this.closeConfigHandler = () => this.closeConfigPanel();
            closeConfig.addEventListener('click', this.closeConfigHandler);
        }
        
        // Background color
        document.getElementById('bgColor').addEventListener('input', (e) => {
            const validatedColor = this.validateColor(e.target.value);
            this.config.bgColor = validatedColor;
            document.body.style.backgroundColor = validatedColor;
        });
        
        // Font color
        document.getElementById('fontColor').addEventListener('input', (e) => {
            const validatedColor = this.validateColor(e.target.value);
            this.config.fontColor = validatedColor;
            document.body.style.color = validatedColor;
        });
        
        // Font family
        document.getElementById('fontFamily').addEventListener('change', (e) => {
            this.config.fontFamily = e.target.value;
            document.body.style.fontFamily = e.target.value;
        });
        
        // Font size
        document.getElementById('fontSize').addEventListener('input', (e) => {
            const validatedSize = this.validateFontSize(e.target.value);
            this.config.fontSize = validatedSize;
            document.body.style.fontSize = validatedSize + 'px';
            
            const valueDisplay = document.getElementById('fontSizeValue');
            const slider = document.getElementById('fontSize');
            valueDisplay.textContent = validatedSize + 'px';
            
            // Update ARIA attributes for screen readers
            slider.setAttribute('aria-valuenow', validatedSize);
            slider.setAttribute('aria-valuetext', `${validatedSize} pixels`);
        });
        
        // Time format
        document.getElementById('timeFormat').addEventListener('change', (e) => {
            const validatedFormat = this.validateTimeFormat(e.target.value);
            this.config.timeFormat = validatedFormat;
            this.updateAllClocks();
        });
        
        // Date format
        document.getElementById('dateFormat').addEventListener('change', (e) => {
            const validatedFormat = this.validateDateFormat(e.target.value);
            this.config.dateFormat = validatedFormat;
            this.updateAllClocks();
        });
        
        // Add timezone
        document.getElementById('addTimezone').addEventListener('click', () => {
            const select = document.getElementById('timezoneSelect');
            const timezone = this.sanitizeTimezone(select.value);
            
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
        if (aboutBtn) {
            this.aboutClickHandler = () => this.openAboutPopup();
            aboutBtn.addEventListener('click', this.aboutClickHandler);
        }
        
        // Close about button
        if (closeAbout) {
            this.closeAboutHandler = () => this.closeAboutPopup();
            closeAbout.addEventListener('click', this.closeAboutHandler);
        }
        
        // Close about popup when clicking outside
        document.getElementById('aboutPopup').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                document.getElementById('aboutPopup').classList.remove('open');
            }
        });
        
        // Set current year for copyright
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        
        // Enhanced keyboard support
        document.addEventListener('keydown', (e) => {
            // Global shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        // Save settings if config is open
                        if (document.getElementById('configPanel').classList.contains('open')) {
                            this.saveConfig();
                        }
                        break;
                    case ',':
                        e.preventDefault();
                        // Open settings
                        document.getElementById('settingsBtn').click();
                        break;
                }
            } else if (e.key === 'Escape') {
                // Close config panel if open
                const configPanel = document.getElementById('configPanel');
                const settingsBtn = document.getElementById('settingsBtn');
                if (configPanel.classList.contains('open')) {
                    configPanel.classList.remove('open');
                    configPanel.setAttribute('aria-hidden', 'true');
                    settingsBtn.setAttribute('aria-expanded', 'false');
                    settingsBtn.focus();
                }
                
                // Close about popup if open
                const aboutPopup = document.getElementById('aboutPopup');
                const aboutBtn = document.getElementById('aboutBtn');
                if (aboutPopup.classList.contains('open')) {
                    aboutPopup.classList.remove('open');
                    aboutPopup.setAttribute('aria-hidden', 'true');
                    aboutBtn.setAttribute('aria-expanded', 'false');
                    aboutBtn.focus();
                }
            } else if (e.key === '?') {
                // Open about dialog with ? key
                document.getElementById('aboutBtn').click();
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
        
        // Use cached elements for better performance
        const timeElement = this.getCachedElement('#mainTime');
        const dateElement = this.getCachedElement('#mainDate');
        const timezoneElement = this.getCachedElement('#mainTimezone');
        
        // Batch DOM updates for performance
        this.batchUpdate(() => {
            if (timeElement) timeElement.textContent = this.formatTime(now);
            if (dateElement) dateElement.textContent = this.formatDate(now);
            
            // Update timezone (only if changed)
            try {
                const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const timezoneName = this.formatTimezoneName(userTimezone);
                if (timezoneElement && timezoneElement.textContent !== timezoneName) {
                    timezoneElement.textContent = timezoneName;
                }
            } catch (error) {
                if (timezoneElement && timezoneElement.textContent !== 'Local Time') {
                    timezoneElement.textContent = 'Local Time';
                }
            }
        });
    }
    
    addAdditionalClock(timezone) {
        const container = document.getElementById('additionalClocks');
        
        // Check if clock already exists
        const safeId = this.sanitizeElementId(`clock-${timezone}`);
        let clockElement = document.getElementById(safeId);
        
        if (!clockElement) {
            clockElement = document.createElement('div');
            clockElement.className = 'additional-clock';
            clockElement.id = safeId;
            
            clockElement.textContent = '';
            const timeDiv = document.createElement('div');
            timeDiv.className = 'time';
            const dateDiv = document.createElement('div');
            dateDiv.className = 'date';
            const timezoneDiv = document.createElement('div');
            timezoneDiv.className = 'timezone';
            
            clockElement.appendChild(timeDiv);
            clockElement.appendChild(dateDiv);
            clockElement.appendChild(timezoneDiv);
            
            // Add accessibility attributes
            clockElement.setAttribute('role', 'timer');
            clockElement.setAttribute('aria-live', 'polite');
            clockElement.setAttribute('aria-atomic', 'true');
            clockElement.setAttribute('aria-label', `Clock for ${this.formatTimezoneName(timezone)}`);
            
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
            
            // Cache formatters to avoid recreation on every update
            if (!this.timezoneFormatters) {
                this.timezoneFormatters = new Map();
            }
            
            const formatterKey = `${timezone}-${this.config.timeFormat}`;
            if (!this.timezoneFormatters.has(formatterKey)) {
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
                this.timezoneFormatters.set(formatterKey, new Intl.DateTimeFormat('en-US', options));
            }
            
            const timeStr = this.formatTimeForTimezone(now, timezone);
            const dateStr = this.formatDateForTimezone(now, timezone);
            const timezoneName = this.formatTimezoneName(timezone);
            
            // Batch DOM updates
            this.batchUpdate(() => {
                const timeElement = clockElement.querySelector('.time');
                const dateElement = clockElement.querySelector('.date');
                const timezoneElement = clockElement.querySelector('.timezone');
                
                if (timeElement) timeElement.textContent = timeStr;
                if (dateElement) dateElement.textContent = dateStr;
                if (timezoneElement) timezoneElement.textContent = timezoneName;
            });
            
        } catch (error) {
            // Error updating clock, will retry on next interval
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
        if (!container) return;
        
        container.innerHTML = '';
        
        this.config.additionalTimezones.forEach(timezone => {
            const item = document.createElement('div');
            item.className = 'timezone-item';
            
            const name = this.formatTimezoneName(timezone);
            
            // Use textContent to prevent XSS
            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;
            nameSpan.setAttribute('aria-label', `Timezone: ${name}`);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = 'Remove';
            removeBtn.dataset.timezone = timezone;
            removeBtn.setAttribute('aria-label', `Remove ${name} timezone`);
            removeBtn.setAttribute('aria-describedby', `timezone-${this.sanitizeElementId(timezone)}`);
            
            item.setAttribute('role', 'listitem');
            item.setAttribute('aria-labelledby', `timezone-${this.sanitizeElementId(timezone)}`);
            item.appendChild(nameSpan);
            item.appendChild(removeBtn);
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
            const safeId = this.sanitizeElementId(`clock-${timezone}`);
            const clockElement = document.getElementById(safeId);
            if (clockElement) {
                clockElement.remove();
            }
            
            this.updateTimezonesDisplay();
        }
    }
    
    updateAllClocks() {
        this.updateMainClock();
        
        this.config.additionalTimezones.forEach(timezone => {
            const safeId = this.sanitizeElementId(`clock-${timezone}`);
            const clockElement = document.getElementById(safeId);
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
        const additionalClocksContainer = document.getElementById('additionalClocks');
        if (additionalClocksContainer) {
            additionalClocksContainer.textContent = '';
        }
        
        // Apply defaults and restart
        this.applyConfig();
        this.startClocks();
        this.saveConfig();
        
        this.showNotification('Settings reset to default!');
    }
    
    showNotification(message, type = 'success') {
        // Performance: Reuse notification container if exists
        let notification = this.activeNotification;
        
        if (!notification) {
            // Create notification element
            notification = document.createElement('div');
            notification.className = 'notification-toast';
            this.activeNotification = notification;
        }
        
        // Set colors and icons based on type
        const config = type === 'error' 
            ? {
                background: 'rgba(220, 38, 38, 0.9)',
                border: 'rgba(220, 38, 38, 1)',
                icon: '⚠️',
                role: 'alert'
            }
            : {
                background: 'rgba(34, 197, 94, 0.9)',
                border: 'rgba(34, 197, 94, 1)',
                icon: '✅',
                role: 'status'
            };
        
        // Batch style updates
        this.batchUpdate(() => {
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(-100px);
                background: ${config.background};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                border: 2px solid ${config.border};
                z-index: 10000;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                font-weight: 500;
                backdrop-filter: blur(10px);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            
            notification.setAttribute('role', config.role);
            notification.setAttribute('aria-live', 'polite');
            notification.innerHTML = `
                <span style="font-size: 18px;">${config.icon}</span>
                <span>${message}</span>
            `;
        });
        
        document.body.appendChild(notification);
        
        // Clear existing timeout
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
        
        // Remove after 4 seconds
        this.notificationTimeout = setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(-100px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
                this.activeNotification = null;
            }, 300);
        }, 4000);
    }
    
    // Memory Management: Clean up event listeners and intervals
    cleanup() {
        // Clear intervals
        this.clockIntervals.forEach(interval => clearInterval(interval));
        this.clockIntervals = [];
        
        // Remove event listeners
        if (this.settingsClickHandler) {
            const settingsBtn = this.getCachedElement('#settingsBtn');
            if (settingsBtn) settingsBtn.removeEventListener('click', this.settingsClickHandler);
        }
        
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        
        if (this.clickOutsideHandler) {
            document.removeEventListener('click', this.clickOutsideHandler);
        }
        
        // Clear timeouts
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
        
        // Clear caches
        this.clearDOMCache();
        if (this.timezoneFormatters) {
            this.timezoneFormatters.clear();
        }
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