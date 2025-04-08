import { fetchAndProcessPageData } from "./scripts/scraper.js";
import { setupTextInputMode } from "./scripts/textInput.js";
import { analyzeMultipleSentiment, analyzeLongFormSentiment } from "./scripts/sentiment-api.js";
import { createMultipleResChart, createScatterPlot, createSingleChart, clearTitleGraph, createProgressLine } from "./scripts/visualisation.js";
import { highlightSentimentElements, clearSentimentHighlightsInTab } from "./scripts/highlight.js";

let currentSentimentData = [];
let textInputMode = false;
let isHighlighted = false;

const runEverything = async () => {
  isHighlighted = false;
  toggleHighlightButtonText();
  clearSentimentHighlightsInTab();
  if (!textInputMode) {
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
  toggleTextModeOn(false);
  fetchAndProcessPageData(updateSidebar);
});

document.getElementById("textInputBtn").addEventListener("click", async () => {
  toggleTextModeOn(true);

  setupTextInputMode(async (userInput) => {
    try {
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

const toggleHighlightButtonText = () => {
  document.getElementById("highlightSentimentBtn").innerText = isHighlighted ? "Ta bort markeringar" : "Färgmarkera";
}

function toggleTextModeOn(boolean) {
  textInputMode = boolean;
  document.getElementById("textInputForm").style.display = boolean ? "block" : "none";
  document.getElementById("highlightSentimentBtn").style.display = boolean || (!boolean && currentSentimentData.length === 0) ? "none" : "block";
}

async function updateSidebarLongform(text) {
  try {
    const sentimentData = await analyzeLongFormSentiment(text);
    currentSentimentData = [sentimentData]; 
    const title = { content: `Denna text är ${sentimentData.label}`};
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
  createMultipleResChart(sentimentData);
  createScatterPlot(sentimentData);
}
