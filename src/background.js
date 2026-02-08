// Background script for World Clock Wallpaper extension
chrome.runtime.onInstalled.addListener(() => {
    // World Clock Wallpaper extension installed
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
});