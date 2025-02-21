export async function createSentimentChart(sentimentScore, sentimentLabel) {
  
    if (typeof window.Chart !== 'undefined') {
      console.log("Chart.js is available");
      const ctx = document.getElementById('sentimentChart').getContext('2d');
  
      // Destroy any previous chart before creating a new one
      if (window.myChart) {
        window.myChart.destroy();
      }
  
      // Create a new chart
      window.myChart = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Sentiment'],
          datasets: [{
            label: sentimentLabel,
            data: [sentimentScore],
            backgroundColor: sentimentScore > 0 ? 'green' : 'red',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    } else {
      console.error('Chart.js is not loaded.');
    }
}
