document.getElementById("scrapeBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => ({
          title: document.title,
          url: window.location.href
        })
      },
      (results) => {
        if (results && results[0] && results[0].result) {
          document.getElementById("title").innerText = `Title: ${results[0].result.title}`;
          document.getElementById("url").innerText = `URL: ${results[0].result.url}`;
        } else {
          document.getElementById("title").innerText = "Error fetching data.";
        }
      }
    );
  });
});
