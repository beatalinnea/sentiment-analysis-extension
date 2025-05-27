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
  const BASE_COLORS = {
    NEGATIVE: [255, 99, 132], // Red
    NEUTRAL: [54, 162, 235], // Blue
    POSITIVE: [75, 192, 132], // Green
  };

  function getBaseColor(label) {
    return BASE_COLORS[label] || [128, 128, 128];
  }

  function getColor(label, alpha = 1) {
    const [r, g, b] = getBaseColor(label);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  document.querySelectorAll("[data-sentiment-id]").forEach((element) => {
    const sentimentId = element.getAttribute("data-sentiment-id");
    const sentimentObj = currentSentimentData.find((item) => item.id === sentimentId);

    if (!sentimentObj) return;

    let color;
    switch (sentimentObj.label) {
      case "POSITIVE":
        color = getColor("POSITIVE", sentimentObj.score); // Light green
        break;
      case "NEUTRAL":
        color = getColor("NEUTRAL", sentimentObj.score); // Light blue
        break;
      case "NEGATIVE":
        color = getColor("NEGATIVE", sentimentObj.score); // Light red
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
export async function highlightSectionInText(id, label) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (id, label) => {
        const BASE_COLORS = {
          NEGATIVE: [255, 99, 132], // Red
          NEUTRAL: [54, 162, 235], // Blue
          POSITIVE: [75, 192, 132], // Green
        };
      
        function getBaseColor(label) {
          return BASE_COLORS[label] || [128, 128, 128];
        }
      
        function getColor(label, alpha = 1) {
          const [r, g, b] = getBaseColor(label);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        
        const element = document.querySelector(`[data-sentiment-id="${id}"]`);
        if (element) {
          element.style.boxShadow = `0 0 10px 2px ${getColor(label, 1)}`;
        }
      },
      args: [id, label],
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


