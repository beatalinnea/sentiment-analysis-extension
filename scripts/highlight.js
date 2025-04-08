export async function highlightSentimentElements(currentSentimentData) {
  console.log("Sending sentiment data to content script:", currentSentimentData);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: applySentimentHighlighting,
      args: [currentSentimentData],
    });
  });
}

function applySentimentHighlighting(currentSentimentData) {
  console.log("Applying sentiment highlighting on the webpage", currentSentimentData);

  document.querySelectorAll("[data-sentiment-id]").forEach((element) => {
    const sentimentId = element.getAttribute("data-sentiment-id");
    const sentimentObj = currentSentimentData.find((item) => item.id === sentimentId);

    if (!sentimentObj) return;

    let color;
    switch (sentimentObj.label) {
      case "POSITIVE":
        color = "rgb(75, 192, 132, 0.7)"; // Light green
        break;
      case "NEUTRAL":
        color = "rgb(54, 162, 235, 0.7)"; // Light blue
        break;
      case "NEGATIVE":
        color = "rgb(255, 99, 132, 0.7)"; // Light red
        break;
      default:
        color = "transparent";
    }

    element.style.backgroundColor = color;
  });
}

export async function clearSentimentHighlightsInTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        document.querySelectorAll("[data-sentiment-id]").forEach((el) => {
          el.style.backgroundColor = "transparent";
        });
        console.log("Cleared highlights on the page");
      }
    });
  });
}
