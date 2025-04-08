export async function highlightSentimentElements(currentSentimentData) {
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
          el.style.boxShadow = "";
        });
      }
    });
  });
}

// set border to id element in text with executeScrtipt
export async function highlightSectionInText(id) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (id) => {
        const element = document.querySelector(`[data-sentiment-id="${id}"]`);
        if (element) {
          element.style.boxShadow = "0 0 10px 2px red";
        }
      },
      args: [id],
    });
  });
}
// remove border from all elements in text with executeScrtipt
export async function resetSectionHighlightInText() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        const elements = document.querySelectorAll("[data-sentiment-id]");
        elements.forEach((el) => {
          el.style.boxShadow = "";
        });
      },
    });
  });
}


