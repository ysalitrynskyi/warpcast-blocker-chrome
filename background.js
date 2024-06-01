let isBlockingEnabled = false;

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setIcon({ path: "icons/icon-off-48.png" });
    chrome.storage.sync.set({ isBlockingEnabled: false });
});

chrome.storage.sync.get('isBlockingEnabled', ({ isBlockingEnabled: storedIsBlockingEnabled }) => {
    isBlockingEnabled = storedIsBlockingEnabled || false;
    chrome.action.setIcon({ path: isBlockingEnabled ? "icons/icon-off-48.png" : "icons/icon-on-48.png" });
});

chrome.action.onClicked.addListener((tab) => {
    chrome.storage.sync.get('isBlockingEnabled', ({ isBlockingEnabled }) => {
        isBlockingEnabled = !isBlockingEnabled;
        chrome.storage.sync.set({ isBlockingEnabled });
    });
});

// Listen for changes to the isBlockingEnabled value in storage
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.isBlockingEnabled) {
        isBlockingEnabled = changes.isBlockingEnabled.newValue;
        chrome.action.setIcon({ path: isBlockingEnabled ? "icons/icon-off-48.png" : "icons/icon-on-48.png" });

        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                if (tab.url.includes("warpcast.com")) {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ["content.js"]
                    });
                }
            });
        });
    }
});
