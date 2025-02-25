chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateSidebar") {
    console.log("Received message from background script");
    updateSidebar(document.title, window.location.href);
  }
});

document.getElementById("scrapeBtn").addEventListener("click", () => {
  console.log("Scrape button clicked");
  updateSidebar();
});

/**
 * Updates the sidebar content with the given title and URL.
 */
function updateSidebar() {
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
          document.getElementById("title").innerText = `Title: ${results[0].result.title}`;
          document.getElementById("url").innerText = `URL: ${results[0].result.url}`;
          createChart(results[0].result.title, results[0].result.url);
        } else {
          updateSidebar("Error fetching data.", "");
        }
      }
    );
  });
}

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
