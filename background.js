chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" || changeInfo.url) {
    updateUrl()
  }
});

function updateUrl() {
  console.log("Update URL was triggered")
  chrome.runtime.sendMessage({ action: "updateSidebar" })
}