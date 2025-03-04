export function createSingleChart(sentimentData) {
  const ctx = document.getElementById("singleChart").getContext("2d");

  // Destroy the previous chart if it exists
  if (window.singleChart instanceof Chart) {
    window.singleChart.destroy();
  }

  // Process sentiment data: Get the highest score for each label
  const sentimentLabels = ["NEGATIVE", "NEUTRAL", "POSITIVE"];
  const scores = sentimentLabels.map(label => {
    const items = sentimentData.filter(d => d.label === label);
    return items.length > 0 ? Math.max(...items.map(d => d.score)) : 0;
  });

  window.singleChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: sentimentLabels,
      datasets: [
        {
          label: "Sentiment Score",
          data: scores,
          backgroundColor: sentimentLabels.map(label => getColor(label, 1)),
          borderWidth: 1,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 0, max: 1, title: { display: true, text: "Sentiment Score" } },
        x: { title: { display: false } }
      },
      plugins: { title: { display: true, text: "Title Sentiment Score" }, legend: { display: false } },
    }
  });
}


export function createMultipleResChart(sentimentData) {
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
      scales: { x: { stacked: true }, y: { stacked: true, title: { display: true, text: "Sentiment Results" } } },
      plugins: { title: { display: true, text: "Sentiment Certainty Distribution" }, legend: { display: false } },
    },
  });
}

// ================================================================================
// =============================== HELPER FUNCTIONS ===============================
// ================================================================================
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
  const intensity = threshold * 0.8 + 0.2;
  return `rgba(${r}, ${g}, ${b}, ${intensity})`;
}
