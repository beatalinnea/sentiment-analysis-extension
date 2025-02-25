// Extract the title and URL
const pageData = {
  title: document.title,
  url: window.location.href
};

// Send data to the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getPageData") {
    sendResponse(pageData);
  }
});
