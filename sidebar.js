chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateSidebar") {
    console.log("Received message from content script:", message);
    const { title, url } = message.pageData;

    // Update the sidebar with the new title and URL
    document.getElementById("title").innerText = `Title: ${title}`;
    document.getElementById("url").innerText = `URL: ${url}`;

    // Optionally, update the chart with the new data
    createChart(title, url);
  }
});

document.getElementById("scrapeBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => ({
          title: document.title,
          url: window.location.href
        })
      },
      (results) => {
        if (results && results[0] && results[0].result) {
          const titleText = results[0].result.title;
          const urlText = results[0].result.url;

          document.getElementById("title").innerText = `Title: ${titleText}`;
          document.getElementById("url").innerText = `URL: ${urlText}`;

          // Generate a sample chart using Chart.js
          createChart(titleText, urlText);
        } else {
          document.getElementById("title").innerText = "Error fetching data.";
        }
      }
    );
  });
});

function createChart(title, url) {
  const ctx = document.getElementById("myChart").getContext("2d");

  // Destroy existing chart instance if it exists (to avoid duplication)
  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Title Length", "URL Length"],
      datasets: [{
        label: "Character Count",
        data: [title.length, url.length],
        backgroundColor: ["blue", "red"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allow dynamic height
      layout: {
        padding: 10 // Reduce padding
      },
      scales: {
        y: {
          ticks: {
            font: { size: 12 } // Smaller font size
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false // Hide legend for a cleaner look
        }
      }
    }
  });
}
