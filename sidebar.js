chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateSidebar") {
    console.log("Received message from background script");
    fetchPageData();
  }
});

document.getElementById("scrapeBtn").addEventListener("click", () => {
  console.log("Scrape button clicked");
  fetchPageData();
});

function fetchPageData() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => {
          const h1Element = document.querySelector("h1");
          const title = h1Element ? h1Element.innerText.trim() : document.title;
          return { title, url: window.location.href };
        }
      },
      (results) => {
        if (results?.[0]?.result) {
          updateSidebar(results[0].result.title, results[0].result.url);
        } else {
          updateSidebar("No data", "No data");
        }
      }
    );
  });
}


function updateSidebar(title, url) {
  document.getElementById("title").innerText = `Title: ${title}`;
  document.getElementById("url").innerText = `URL: ${url}`;
  if (title === "No data" && url === "No data") {
    document.getElementById("myChart").style.display = "none";
    return;
  } else {
    document.getElementById("myChart").style.display = "block";
    const sentimentData = analyzeSentiment(title);
    createChart(sentimentData);
  }
}

function analyzeSentiment(text) {
  // Placeholder: Random sentiment scores for now
  return [
    { label: "NEGATIVE", score: Math.random() },
    { label: "NEUTRAL", score: Math.random() },
    { label: "POSITIVE", score: Math.random() },
    { label: "NEGATIVE", score: Math.random() },
    { label: "NEUTRAL", score: Math.random() },
    { label: "POSITIVE", score: Math.random() },
    { label: "NEGATIVE", score: Math.random() },
    { label: "NEUTRAL", score: Math.random() },
    { label: "POSITIVE", score: Math.random() },
    { label: "NEGATIVE", score: Math.random() },
  ];
}

function processSentimentData(sentimentData) {
  const sentimentLabels = ["NEGATIVE", "NEUTRAL", "POSITIVE"];

  return sentimentLabels.map(label => ({
    label,
    low: sentimentData.filter(d => d.label === label && d.score <= 0.5).length,
    medium: sentimentData.filter(d => d.label === label && d.score > 0.5 && d.score <= 0.7).length,
    high: sentimentData.filter(d => d.label === label && d.score > 0.7).length,
  }));
}

function getColor(label, threshold) {
  const baseColors = {
    NEGATIVE: [255, 99, 132], // Red
    NEUTRAL: [54, 162, 235], // Blue
    POSITIVE: [75, 192, 132]  // Green
  };

  const [r, g, b] = baseColors[label];
  const intensity = threshold * 0.8 + 0.2; // Adjust intensity based on threshold
  return `rgba(${r}, ${g}, ${b}, ${intensity})`;
}

function createChart(sentimentData) {
  const ctx = document.getElementById("myChart").getContext("2d");

  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  const processedData = processSentimentData(sentimentData);

  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["NEGATIVE", "NEUTRAL", "POSITIVE"],
      datasets: [
        {
          label: "Low Certainty (0-0.5)",
          data: processedData.map(d => d.low),
          backgroundColor: processedData.map(d => getColor(d.label, 0.5)),
        },
        {
          label: "Medium Certainty (0.5-0.7)",
          data: processedData.map(d => d.medium),
          backgroundColor: processedData.map(d => getColor(d.label, 0.7)),
        },
        {
          label: "High Certainty (0.7-1.0)",
          data: processedData.map(d => d.high),
          backgroundColor: processedData.map(d => getColor(d.label, 1.0)),
        },
      ],
    },
    options: {
      responsive: true,
      scales: { x: { stacked: true }, y: { stacked: true } },
      plugins: { title: { display: true, text: "Sentiment Certainty Distribution" }, legend: { display: false } },
    },
  });
}
