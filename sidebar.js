import { fetchAndProcessPageData } from "./scripts/scraper.js";
import { setupTextInputMode } from "./scripts/textInput.js";
import { analyzeMultipleSentiment, analyzeLongFormSentiment } from "./scripts/sentiment-api.js";
import { createMultipleResChart, createScatterPlot, createSingleChart, clearTitleGraph, createProgressLine } from "./scripts/visualisation.js";
import { highlightSentimentElements } from "./scripts/highlight.js";

let currentSentimentData = [];

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateSidebar") {
    fetchAndProcessPageData(updateSidebar);
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
  await highlightSentimentElements(currentSentimentData);
});

function toggleTextModeOn(boolean) {
  document.getElementById("textInputForm").style.display = boolean ? "block" : "none";
  document.getElementById("highlightSentimentBtn").style.display = boolean ? "none" : "block";
}

async function updateSidebarLongform(text) {
  try {
    const sentimentData = await analyzeLongFormSentiment(text);
    currentSentimentData = [sentimentData]; 
    createCharts(currentSentimentData[0], currentSentimentData);
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
  console.log('creating charts', sentimentData)
  document.getElementById("title").style.display = titleItem ? "block" : "none";
  document.getElementById("title").innerText = titleItem?.content;
  createProgressLine(sentimentData);
  createMultipleResChart(sentimentData);
  createScatterPlot(sentimentData);
}
