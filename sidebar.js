import { fetchPageData } from "./scripts/scraper.js";
import { setupTextInputMode } from "./scripts/textInput.js";
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

  // Hide text input form and show scrape mode elements
  document.getElementById("textInputForm").style.display = "none";
  document.getElementById("title").style.display = "block";
  document.getElementById("url").style.display = "block";

  fetchPageData(updateSidebar);
});

document.getElementById("textInputBtn").addEventListener("click", () => {
  console.log("Text Input button clicked");

  // Hide title and URL and show text input form
  document.getElementById("textInputForm").style.display = "block";
  document.getElementById("title").style.display = "none";
  document.getElementById("url").style.display = "none";

  // Pass the callback for text input analysis
  setupTextInputMode((userInput) => {
    console.log("Text input received:", userInput);

    // Analyze the sentiment for the user input text
    const sentimentData = analyzeMultipleSentiment(userInput);
    const titleSentiment = analyzeSingleSentiment(userInput);

    // Visualize the sentiment data
    createSingleChart(titleSentiment);
    createMultipleResChart(sentimentData);
  });
});

function updateSidebar(title, url) {
  document.getElementById("title").innerText = `Title: ${title}`;
  document.getElementById("url").innerText = `URL: ${url}`;

  if (title === "No data" && url === "No data") {
    document.getElementById("myChart").style.display = "none";
    document.getElementById("myPieChart").style.display = "none";
    document.getElementById("singleChart").style.display = "none";
    return;
  }

  document.getElementById("myChart").style.display = "block";
  const sentimentData = analyzeMultipleSentiment(title);
  const titleSentiment = analyzeSingleSentiment(title); 
  createSingleChart(titleSentiment);
  createMultipleResChart(sentimentData);
}