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

document.getElementById("textInputBtn").addEventListener("click", async () => {
  console.log("Text Input button clicked");

  // Hide title and URL and show text input form
  document.getElementById("textInputForm").style.display = "block";
  document.getElementById("title").style.display = "none";
  document.getElementById("url").style.display = "none";

  // Pass the callback for text input analysis
  setupTextInputMode(async (userInput) => {
    console.log("Text input received:", userInput);

    try {
      // Wait for API responses
      const sentimentData = await analyzeMultipleSentiment(userInput);
      const titleSentiment = await analyzeSingleSentiment(userInput);

      // Visualize the sentiment data
      createSingleChart(titleSentiment);
      createMultipleResChart(sentimentData);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
    }
  });
});

async function updateSidebar(title, url) {
  document.getElementById("title").innerText = `Title: ${title}`;
  document.getElementById("url").innerText = `URL: ${url}`;

  if (title === "No data" && url === "No data") {
    document.getElementById("myChart").style.display = "none";
    document.getElementById("myPieChart").style.display = "none";
    document.getElementById("singleChart").style.display = "none";
    return;
  }

  document.getElementById("myChart").style.display = "block";

  try {
    // Wait for API responses
    const sentimentData = await analyzeMultipleSentiment(title);
    const titleSentiment = await analyzeSingleSentiment(title);

    // Visualize the sentiment data
    createSingleChart(titleSentiment);
    createMultipleResChart(sentimentData);
  } catch (error) {
    console.error("Error fetching sentiment analysis:", error);
  }
}
