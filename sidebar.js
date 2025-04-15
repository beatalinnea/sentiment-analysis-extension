import { fetchAndProcessPageData } from "./scripts/scraper.js";
import { setupTextInputMode } from "./scripts/textInput.js";
import { analyzeMultipleSentiment, analyzeLongFormSentiment } from "./scripts/sentiment-api.js";
import { createPieChart, createScatterPlot, createProgressLine } from "./scripts/visualisation.js";
import { highlightSentimentElements, clearSentimentHighlightsInTab } from "./scripts/highlight.js";
import { mapLabelToSwedish } from "./utils/mapLabels.js";

let currentSentimentData = [];
let textInputMode = false;
let isHighlighted = false;
let isLoading = true;

const runEverything = async () => {
  isHighlighted = false;
  toggleHighlightButtonText();
  clearSentimentHighlightsInTab();
  if (!textInputMode) {
    isLoading = true;
    toggleLoadingOverlay();
    fetchAndProcessPageData(updateSidebar);
  }
}

// query on initial load:
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (tab && tab.url) {
    runEverything();
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateSidebar") {
    runEverything();
  }
});

document.getElementById("scrapeBtn").addEventListener("click", () => {
  if (!textInputMode) {
    return;
  }
  toggleTextModeOn(false);
  isLoading = true;
  toggleLoadingOverlay();
  fetchAndProcessPageData(updateSidebar);
});

document.getElementById("textInputBtn").addEventListener("click", async () => {
  toggleTextModeOn(true);

  setupTextInputMode(async (userInput) => {
    try {
      isLoading = true;
      toggleLoadingOverlay();
      await updateSidebarLongform(userInput);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
    }
  });
});

document.getElementById("highlightSentimentBtn").addEventListener("click", async () => {
  isHighlighted ? isHighlighted = false : isHighlighted = true;
  toggleHighlightButtonText();
  if (!isHighlighted) {
    await clearSentimentHighlightsInTab();
  } else {
    await highlightSentimentElements(currentSentimentData);
  }
});

function toggleLoadingOverlay() {
  const overlay = document.getElementById("loadingOverlay");
  overlay.style.display = isLoading ? "flex" : "none";
}

const toggleHighlightButtonText = () => {
  document.getElementById("highlightSentimentBtn").innerText = isHighlighted ? "Ta bort markeringar" : "Färgmarkera";
}

function toggleTextModeOn(boolean) {
  textInputMode = boolean;
  document.getElementById("textInputForm").style.display = boolean ? "block" : "none";
  document.getElementById("highlightSentimentBtn").style.display = boolean || (!boolean && currentSentimentData.length === 0) ? "none" : "block";
  document.getElementById("scrapeBtn").classList.toggle("active", !boolean);
  document.getElementById("textInputBtn").classList.toggle("active", boolean);
}

async function updateSidebarLongform(text) {
  try {
    const sentimentData = await analyzeLongFormSentiment(text);
    currentSentimentData = [sentimentData]; 
    const sentimentLabel = mapLabelToSwedish(sentimentData.label);
    const title = { content: `Denna text är ${sentimentLabel}`};
    visualiseInSidepanel(title, currentSentimentData);
  } catch (error) {
    console.error("Error fetching sentiment analysis:", error);
  }
}

async function updateSidebar({ title, url, parts }) {
  try {
    currentSentimentData = await analyzeMultipleSentiment({ sections: parts });
    const mhSentiment = currentSentimentData.find((item) => item.id === "mh");
    visualiseInSidepanel(mhSentiment, currentSentimentData);
  } catch (error) {
    console.error("Error fetching sentiment analysis:", error);
  }
}

function visualiseInSidepanel(titleItem, sentimentData) {
  const emptyMessageElement = document.getElementById("emptyMessage");
  if (sentimentData.length === 0) {
    // Show empty message if no sentiment data found
    document.getElementById("highlightSentimentBtn").style.display = "none";
    emptyMessageElement.style.display = "flex";  // Show the overlay
  } else {
    if (!textInputMode) {
      document.getElementById("highlightSentimentBtn").style.display = "block";
    }
    emptyMessageElement.style.display = "none"; // Hide the overlay
  }
  document.getElementById("title").style.display = titleItem ? "block" : "none";
  document.getElementById("title").innerText = titleItem?.content;
  createProgressLine(sentimentData);
  createPieChart(sentimentData);
  createScatterPlot(sentimentData);
  isLoading = false;
  toggleLoadingOverlay();
}

document.getElementById("instructionsBtn").addEventListener("click", () => {
  document.getElementById("infoBtn").classList.remove("active");
  document.getElementById("instructionsBtn").classList.toggle("active");
  document.getElementById("infoText").style.display = "none";
  document.getElementById("instructionsText").style.display = document.getElementById("instructionsBtn").classList.contains("active") ? "block" : "none";
  if (document.getElementById("instructionsBtn").classList.contains("active") || document.getElementById("infoBtn").classList.contains("active")) {
    document.getElementById("textDisplay").style.display = "block";
  } else {
    document.getElementById("textDisplay").style.display = "none";
  }
});

document.getElementById("infoBtn").addEventListener("click", () => {
  document.getElementById("instructionsBtn").classList.remove("active");
  document.getElementById("infoBtn").classList.toggle("active");
  document.getElementById("instructionsText").style.display = "none";
  document.getElementById("infoText").style.display = document.getElementById("infoBtn").classList.contains("active") ? "block" : "none";
  if (document.getElementById("instructionsBtn").classList.contains("active") || document.getElementById("infoBtn").classList.contains("active")) {
    document.getElementById("textDisplay").style.display = "block";
  } else {
    document.getElementById("textDisplay").style.display = "none";
  }
});