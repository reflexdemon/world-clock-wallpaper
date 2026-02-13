import './styles.css';

// Popup script for World Clock Wallpaper extension
document.addEventListener('DOMContentLoaded', () => {
    // Open new tab button
    document.getElementById('openNewTab').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    });
    
    // Configure settings button
    document.getElementById('configure').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    });
});