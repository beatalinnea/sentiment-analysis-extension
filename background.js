chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" || changeInfo.url) {
    updateUrl(tab.url)
  }
});

function updateUrl(url) {
  chrome.runtime.sendMessage({ action: "updateSidebar", url: url })
}