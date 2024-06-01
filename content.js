(() => {
    let isBlockingEnabled = false;

    chrome.storage.sync.get('isBlockingEnabled', (result) => {
        isBlockingEnabled = result.isBlockingEnabled || false;
        hideDivsWithButtons();
    });

    function hideDivsWithButtons() {
        if (isBlockingEnabled) {
            const fadeInDivs = document.querySelectorAll('div.h-full > div.fade-in > div');
            fadeInDivs.forEach(div => {
                const containsLineClamp = div.querySelector('.line-clamp-1') !== null && div.querySelector('.max-h-24') === null;
                if (containsLineClamp && !div.dataset.hidden) {
                    const placeholder = document.createElement('div');
                    placeholder.textContent = '1 cast was hidden here, click to show';
                    placeholder.style.cursor = 'pointer';
                    placeholder.style.color = '#c848ff';
                    placeholder.style.margin = '10px 20px';
                    placeholder.style.fontSize = '10px';
                    placeholder.addEventListener('click', () => {
                        div.style.display = 'block';
                        placeholder.style.display = 'none';
                    });

                    div.parentNode.insertBefore(placeholder, div);
                    div.style.display = 'none';
                    div.dataset.hidden = 'true';
                }
            });
        }
    }

    // Observe for new elements due to lazy loading
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            hideDivsWithButtons();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
