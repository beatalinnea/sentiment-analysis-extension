import { fetchPageData } from "./scripts/scraper.js";
import { analyzeMultipleSentiment, analyzeSingleSentiment } from "./scripts/sentiment-api.js";
import { createMultipleResChart, createSingleChart } from "./scripts/visualisation.js";

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateSidebar") {
    console.log("Received message from background script");
    fetchPageData(updateSidebar);
  }
});

document.getElementById("scrapeBtn").addEventListener("click", () => {
  console.log("Scrape button clicked");
  fetchPageData(updateSidebar);
});

function updateSidebar(title, url) {
  document.getElementById("title").innerText = `Title: ${title}`;
  document.getElementById("url").innerText = `URL: ${url}`;

  if (title === "No data" && url === "No data") {
    document.getElementById("myChart").style.display = "none";
    return;
  }

  document.getElementById("myChart").style.display = "block";
  const sentimentData = analyzeMultipleSentiment(title);
  const titleSentiment = analyzeSingleSentiment(title); 
  createSingleChart(titleSentiment);
  createMultipleResChart(sentimentData);
}