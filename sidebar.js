import { fetchAndProcessPageData } from "./scripts/scraper.js";
import { setupTextInputMode } from "./scripts/textInput.js";
import { analyzeMultipleSentiment, analyzeLongFormSentiment } from "./scripts/sentiment-api.js";
import { createMultipleResChart, createScatterPlot, createSingleChart, clearTitleGraph, createProgressLine } from "./scripts/visualisation.js";
import { highlightSentimentElements, clearSentimentHighlightsInTab } from "./scripts/highlight.js";

let currentSentimentData = [];
let textInputMode = false;
let isHighlighted = false;

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateSidebar") {
    isHighlighted = false;
    toggleHighlightButtonText();
    clearSentimentHighlightsInTab();
    if (!textInputMode) {
    fetchAndProcessPageData(updateSidebar);
    }
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
  document.getElementById("highlightSentimentBtn").style.display = boolean ? "none" : "block";
}

async function updateSidebarLongform(text) {
  try {
    const sentimentData = await analyzeLongFormSentiment(text);
    currentSentimentData = [sentimentData]; 
    const title = { content: `Denna text är ${sentimentData.label}`};
    createCharts(title, currentSentimentData);
  } catch (error) {
    console.error("Error fetching sentiment analysis:", error);
  }
}

async function updateSidebar({ title, url, parts }) {
  try {
    currentSentimentData = await analyzeMultipleSentiment({ sections: parts });
    const mhSentiment = currentSentimentData.find((item) => item.id === "mh");
    createCharts(mhSentiment, currentSentimentData);
  } catch (error) {
    console.error("Error fetching sentiment analysis:", error);
  }
}

function createCharts(titleItem, sentimentData) {
  document.getElementById("title").style.display = titleItem ? "block" : "none";
  document.getElementById("title").innerText = titleItem?.content;
  createProgressLine(sentimentData);
  createMultipleResChart(sentimentData);
  createScatterPlot(sentimentData);
}
