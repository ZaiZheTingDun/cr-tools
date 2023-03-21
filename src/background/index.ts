import { openUrlCurrentTab } from "../common";

chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'github.com'}})
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});

chrome.contextMenus.create({
    title: "Configuration",
    onclick: function () {
        window.open(chrome.extension.getURL('configuration.html'))
    }
});

chrome.contextMenus.create({
    title: "Hot Key",
    onclick: function () {
        window.open(chrome.extension.getURL('hot-key.html'))
    }
});

chrome.contextMenus.create({
    title: "Code Review Page",
    onclick: function () {
        const settings = JSON.parse(localStorage.getItem("settings"));
        if (settings.basicSetting && settings.basicSetting.githubToken)
            window.open(`https://github.com/pulls?fromCranberry=true&utf8=%E2%9C%93&q=is%3Aclosed+is%3Apr+label%3A${settings.basicSetting.groupName}+label%3A%22${settings.basicSetting.needReviewLabel}%22`)
        else
            window.open(chrome.extension.getURL('configuration.html'))
    }
});

chrome.contextMenus.create({
    title: "Need Fix Page",
    onclick: function () {
        const settings = JSON.parse(localStorage.getItem("settings"));
        if (settings.basicSetting && settings.basicSetting.githubToken)
            window.open(`https://github.com/pulls?q=is%3Aclosed+is%3Apr+label%3A${settings.basicSetting.groupName}+label%3A%22${settings.basicSetting.needFixLabel}%22+assignee%3A${settings.basicSetting.githubUserName}`)
        else
            window.open(chrome.extension.getURL('configuration.html'))
    }
});


chrome.runtime.onMessage.addListener(function (_request, _sender, sendResponse) {
    sendResponse(localStorage.getItem("settings"));
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    if (text.trim() === '') {
        suggest([
            {content: 'cranberry-config', description: 'Cranberry Config'},
            {content: 'code-review-page', description: 'Code Review Page'},
            {content: 'need-fix-page', description: 'Need Fix Page'},
            {content: 'hot-key', description: 'Hot Key'},
        ])
        return
    }

    const queryRegex = new RegExp(`.*${text.split(' ').join('.*')}.*`, 'i')
    if ('code review page'.match(queryRegex)) {
        suggest([
            {content: 'code-review-page', description: 'Code Review Page'}
        ])
    }
    if ('config'.match(text)) {
        suggest([
            {content: 'cranberry-config', description: 'Cranberry Config'}
        ])
    }
    if ('need fix page'.match(text)) {
        suggest([
            {content: 'need-fix-page', description: 'Need Fix Page'}
        ])
    }
    if ('hot key'.match(text)) {
        suggest([
            {content: 'hot-key', description: 'Hot Key'}
        ])
    }
});

chrome.omnibox.onInputEntered.addListener((text) => {
    const settings = JSON.parse(localStorage.getItem("settings"));
    if (!text) return
    let href = ''
    if ('code-review-page' === text) {
        href = `https://github.com/pulls?fromCranberry=true&isFutf8=%E2%9C%93&q=is%3Aclosed+is%3Apr+label%3A${settings.basicSetting.groupName}+label%3A%22${settings.basicSetting.needReviewLabel}%22`
        openUrlCurrentTab(href)
    }
    if ('need-fix-page' === text) {
        href = `https://github.com/pulls?fromCranberry=true&q=is%3Aclosed+is%3Apr+label%3A${settings.basicSetting.groupName}+label%3A%22${settings.basicSetting.needFixLabel}%22+assignee%3A${settings.basicSetting.githubUserName}`
        openUrlCurrentTab(href)
    }
    if ('cranberry-config' === text) {
        href = 'chrome://extensions/'
        openUrlCurrentTab(`chrome-extension://${chrome.runtime.id}/configuration.html`)
    }
    if ('hot-key' === text) {
        href = 'chrome://extensions/'
        openUrlCurrentTab(`chrome-extension://${chrome.runtime.id}/hot-key.html`)
    }
});
