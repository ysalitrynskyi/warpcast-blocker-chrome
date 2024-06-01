document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleBlocking');

    // Function to update the button state
    function updateButton(isBlockingEnabled) {
        if (isBlockingEnabled) {
            toggleButton.textContent = 'Frame Blocker is ON';
            toggleButton.style.backgroundColor = '#4CAF50'; // Green
        } else {
            toggleButton.textContent = 'Frame Blocker is OFF';
            toggleButton.style.backgroundColor = '#F44336'; // Red
        }
    }

    // Get the current state and update the button
    chrome.storage.sync.get('isBlockingEnabled', ({ isBlockingEnabled }) => {
        updateButton(isBlockingEnabled);
    });

    // Add click event listener to toggle the state
    toggleButton.addEventListener('click', () => {
        chrome.storage.sync.get('isBlockingEnabled', ({ isBlockingEnabled }) => {
            const newState = !isBlockingEnabled;
            chrome.storage.sync.set({ isBlockingEnabled: newState }, () => {
                updateButton(newState);

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    const activeTab = tabs[0];
                    if (activeTab && activeTab.url && !activeTab.url.startsWith('chrome://')) {
                        chrome.scripting.executeScript({
                            target: { tabId: activeTab.id },
                            files: ["content.js"]
                        });
                    }
                });
            });
        });
    });
});
