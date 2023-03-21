const getCurrentTabId = (callback) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

export const sendMessageToContentScript = (message, callback) => {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function (response) {
            if (callback) callback(response);
        });
    });
}

export const openUrlCurrentTab = (url) => {
    getCurrentTabId(tabId => {
        chrome.tabs.update(tabId, {url: url}).then();
    })
}
