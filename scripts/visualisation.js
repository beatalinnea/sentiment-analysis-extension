export function clearTitleGraph() {
  if (window.singleChart instanceof Chart) {
    window.singleChart.destroy();
  }
  const canvas = document.getElementById("singleChart");
  if (canvas) {
    canvas.style.display = "none"; // Hide the canvas element
  }
}

export function createSingleChart(sentimentData) {
  const canvas = document.getElementById("singleChart");
  if (canvas) {
    canvas.style.display = "block";
  }
  const ctx = canvas.getContext("2d");

  if (window.singleChart instanceof Chart) {
    window.singleChart.destroy();
  }

  // Ensure sentimentData is a single object, not an array
  const sentimentLabels = ["NEGATIVE", "NEUTRAL", "POSITIVE"];
  const scores = sentimentLabels.map(label => (sentimentData.label === label ? sentimentData.score : 0));

  window.singleChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: sentimentLabels,
      datasets: [
        {
          label: "Sentiment Score",
          data: scores,
          backgroundColor: sentimentLabels.map(label => getColor(label, 1)),
          borderWidth: 0,
        }
      ]
    },
    options: {
      responsive: true,
      indexAxis: "y", // Horizontal bars
      scales: {
        x: {
          min: 0,
          max: 1,
          ticks: {
            stepSize: 0.1,
            beginAtZero: true,
          },
          grid: { display: false },
        },
        y: {
          grid: { display: false },
        }
      },
      plugins: {
        title: {
          display: true,
          text: `Sentiment Score for Heading`,
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `Score: ${tooltipItem.raw.toFixed(2)}`;
            }
          }
        },
        legend: { display: false },
      }
    }
  });
}


export function createMultipleResChart(sentimentData) {
  const ctx = document.getElementById("myChart").getContext("2d");
  const ctxPie = document.getElementById("myPieChart").getContext("2d");

  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  if (window.myPieChart instanceof Chart) {
    window.myPieChart.destroy();
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

  window.myPieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: ["NEGATIVE", "NEUTRAL", "POSITIVE"],
      datasets: [
        {
          label: "Sentiment Distribution",
          data: [
            processedData[0].low + processedData[0].medium + processedData[0].high, // NEGATIVE total
            processedData[1].low + processedData[1].medium + processedData[1].high, // NEUTRAL total
            processedData[2].low + processedData[2].medium + processedData[2].high, // POSITIVE total
          ],
          backgroundColor: [
            getColor("NEGATIVE", 0.5),
            getColor("NEUTRAL", 0.7),
            getColor("POSITIVE", 1.0),
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Sentiment Distribution",
        },
        legend: {
          display: false,
        },
      },
    },
  });
}

export function createScatterPlot(sentimentData) {
  const ctx = document.getElementById("scatterPlot").getContext("2d");

  if (window.scatterPlot instanceof Chart) {
    window.scatterPlot.destroy();
  }

  const dataPoints = sentimentData.map((item, index) => ({
    x: item.score,
    y: Math.floor(Math.random() * (512 - 10 + 1)) + 10,
    id: index + 1,
    label: item.label,
    backgroundColor: getColor(item.label, 0.8),
  }));

  const data = {
    datasets: [
      {
        data: dataPoints,
        pointBackgroundColor: dataPoints.map(({ backgroundColor }) => backgroundColor),
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => context[0].raw.label,
          label: (context) => {
            const { x, y } = context.raw;
            return [`Certainty: ${x.toFixed(2)}`, `Word Count: ${y}`];
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        min: 0,
        max: 1,
      },
      y: {
        min: 10,
        max: 600,
        title: {
          display: true,
          text: "Word Count",
        },
      },
    },
  };

  window.scatterPlot = new Chart(ctx, {
    type: "scatter",
    data,
    options,
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
