chrome.sidePanel
          .setPanelBehavior({ openPanelOnActionClick: true })
          .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" || changeInfo.url) {
    updateUrl(tab.url)
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    updateUrl(tab.url);
  });
});

function updateUrl(url) {
  chrome.runtime.sendMessage({ action: "updateSidebar", url: url })
}