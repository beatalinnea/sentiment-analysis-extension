import Chart from './libs/Chart.min.js';

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
          // Update title and URL in the sidebar
          document.getElementById("title").innerText = `Title: ${results[0].result.title}`;
          document.getElementById("url").innerText = `URL: ${results[0].result.url}`;

          // Prepare data for the chart
          const data = {
            labels: ['Title Length', 'URL Length'],
            datasets: [{
              label: 'Page Data Lengths',
              data: [results[0].result.title.length, results[0].result.url.length],
              backgroundColor: ['#ff6384', '#36a2eb'],
              borderColor: ['#ff6384', '#36a2eb'],
              borderWidth: 1
            }]
          };

          // Create the chart
          const ctx = document.getElementById('myChart').getContext('2d');
          if (window.myChart) {
            window.myChart.destroy(); // Destroy the old chart if it exists
          }
          window.myChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        } else {
          document.getElementById("title").innerText = "Error fetching data.";
        }
      }
    );
  });
});
