// Background script for World Clock Wallpaper extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('World Clock Wallpaper extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
});