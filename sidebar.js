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
    createChart(title, url);
  }
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
      labels: ["Negative", "Neutral", "Positive"],
      datasets: [{
        label: "Certainty",
        data: [title.length, 10, url.length],
        backgroundColor: ["red", "yellow", "green"]
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
