import { ActionType } from "../types/types";

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({ pageUrl: { hostSuffix: 'github.com', schemes: ['https'] } })
        ],
        actions: [new chrome.declarativeContent.ShowAction()]
      }
    ]);
  });

  chrome.contextMenus.create({
    id: "configuration",
    title: "Configuration",
  });

  chrome.contextMenus.create({
    id: "code-review-page",
    title: "Code Review Page",
  });

  chrome.contextMenus.create({
    id: "need-fix-page",
    title: "Need Fix Page",
  });

  chrome.contextMenus.create({
    id: "open-all-items",
    title: "Open All Items",
    documentUrlPatterns: ["https://github.com/pulls?*"]
  });


  chrome.contextMenus.create({
    id: "finish-review",
    title: "Finish Review",
    documentUrlPatterns: ["https://github.com/*/*/pull/*"]
  });
});

const onCodeReviewPageContextMenuClick = async () => {
  const configuration = await chrome.storage.local.get();

  if (configuration.pat && configuration.teamLabel && configuration.needReviewLabel) {
    await chrome.tabs.create({ url: `https://github.com/pulls?q=label%3A${ configuration.teamLabel }+label%3A%22${ configuration.needReviewLabel }%22+` });
  } else {
    chrome.runtime.openOptionsPage();
  }
};

const onNeedFixPageContextMenuClick = async () => {
  const configuration = await chrome.storage.local.get();

  if (configuration.pat && configuration.teamLabel && configuration.needFixLabel) {
    await chrome.tabs.create({ url: `https://github.com/pulls?q=label%3A${ configuration.teamLabel }+label%3A%22${ configuration.needFixLabel }%22+` });
  } else {
    chrome.runtime.openOptionsPage();
  }
};

const openAllItems = async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  if (tab) {
    await chrome.tabs.sendMessage(tab.id, { actionType: ActionType.OpenAllItems });
  }
}

const finishReview = async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  if (tab) {
    await chrome.tabs.sendMessage(tab.id, { actionType: ActionType.FinishReview });
  }
}

chrome.contextMenus.onClicked.addListener(async (info) => {
  switch (info.menuItemId) {
    case "configuration":
      chrome.runtime.openOptionsPage();
      break;
    case "code-review-page":
      await onCodeReviewPageContextMenuClick();
      break;
    case "need-fix-page":
      await onNeedFixPageContextMenuClick();
      break;
    case "open-all-items":
      await openAllItems();
      break;
    case "finish-review":
      await finishReview();
      break;
    default:
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "open-all-items":
      await openAllItems();
      break;
    default:
  }
});