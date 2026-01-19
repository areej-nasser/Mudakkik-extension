// Create context menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'factCheck',
        title: 'تحقق من "%s" مع مُدَقِّق',
        contexts: ['selection']
    });
});

// Handle API calls from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'verifyNews') {
        const { text, token, period } = request;
        const API_URL = "https://mudakkik.ddns.net/api";

        fetch(`${API_URL}/verify-news`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text, period })
        })
            .then(async res => {
                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    sendResponse({
                        success: false,
                        status: res.status,
                        message: data.message || res.statusText
                    });
                } else {
                    sendResponse({ success: true, data });
                }
            })
            .catch(err => {
                sendResponse({ success: false, message: err.message });
            });

        return true;
    }
});

