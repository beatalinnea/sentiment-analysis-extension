import { fetchAndProcessPageData } from "./scripts/scraper.js";
import { setupTextInputMode } from "./scripts/textInput.js";
import { analyzeMultipleSentiment } from "./scripts/sentiment-api.js";
import { createMultipleResChart, createScatterPlot, createSingleChart, clearTitleGraph } from "./scripts/visualisation.js";
import { highlightSentimentElements } from "./scripts/highlight.js";

let currentSentimentData = [];

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateSidebar") {
    console.log("Received message from background script");
    fetchAndProcessPageData(updateSidebar);
  }
});

document.getElementById("scrapeBtn").addEventListener("click", () => {
  console.log("Scrape button clicked");
  document.getElementById("textInputForm").style.display = "none";
  fetchAndProcessPageData(updateSidebar);
});

document.getElementById("textInputBtn").addEventListener("click", async () => {
  console.log("Text Input button clicked");
  document.getElementById("textInputForm").style.display = "block";
  document.getElementById("highlightSentimentBtn").style.display = "none";

  setupTextInputMode(async (userInput) => {
    console.log("Text input received:", userInput);
    try {
      const sections = [{ id: "1", content: userInput }];
      const sentimentData = await analyzeMultipleSentiment({ sections });
      clearTitleGraph();
      createMultipleResChart(sentimentData);
      createScatterPlot(sentimentData);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
    }
  });
});

document.getElementById("highlightSentimentBtn").addEventListener("click", async () => {
  console.log("Highlight Sentiments button clicked");
  await highlightSentimentElements(currentSentimentData);
});

async function updateSidebar({ title, url, parts }) {
  document.getElementById("myChart").style.display = "block";
  document.getElementById("highlightSentimentBtn").style.display = "block";
  try {
    currentSentimentData = await analyzeMultipleSentiment({ sections: parts });
    const mhSentiment = currentSentimentData.find((item) => item.id === "mh");
    createSingleChart(mhSentiment);
    createMultipleResChart(currentSentimentData);
    createScatterPlot(currentSentimentData);
  } catch (error) {
    console.error("Error fetching sentiment analysis:", error);
  }
}
