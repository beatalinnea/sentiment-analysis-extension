export function fetchPageData(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => {
          const h1Element = document.querySelector("h1");
          const title = h1Element ? h1Element.innerText.trim() : document.title;
          return { title, url: window.location.href };
        }
      },
      (results) => {
        if (results?.[0]?.result) {
          callback(results[0].result.title, results[0].result.url);
        } else {
          callback("No data", "No data");
        }
      }
    );
  });
}