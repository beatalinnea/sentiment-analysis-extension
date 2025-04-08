export function createMultipleResChart(sentimentData) {
  const ctxPie = document.getElementById("myPieChart").getContext("2d");
  if (window.myPieChart instanceof Chart) {
    window.myPieChart.destroy();
  }

  const processedData = processSentimentData(sentimentData);

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
          text: "Sentiment Fördelning",
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

  const countWords = (str) => {
    return str.trim().split(/\s+/).length;
  };

  const dataPoints = sentimentData.map((item, index) => ({
    x: item.score,
    y: countWords(item.content),
    id: item?.id || index + 1,
    label: item.label,
    backgroundColor: getColor(item.label, 0.8),
    borderColor: getColor(item.label, 1),
    borderWidth: 1,
  }));

  // Debugging - Print actual min X before applying adjustments
  const rawMinX = Math.min(...dataPoints.map((point) => point.x));
  let minX = Math.max(0.5, Math.floor(rawMinX * 10) / 10);
  if (minX > 0.5) {
    minX = 0.5;
  }

  const rawMaxY = Math.max(...dataPoints.map((point) => point.y));
  const maxY = Math.max(10, Math.ceil(rawMaxY / 10) * 10);

  const data = {
    datasets: [
      {
        data: dataPoints,
        pointBackgroundColor: dataPoints.map(({ backgroundColor }) => backgroundColor),
        pointRadius: 4,
        pointBorderColor: dataPoints.map(({ borderColor }) => borderColor),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const { label, id, x, y } = context.raw;
            return [`${label} ${id}`, `Certainty: ${x.toFixed(2)}`, `Ordantal: ${y}`];
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
        min: minX,  
        max: 1,  
      },
      y: {
        title: {
          display: true,
          text: "Ordantal",
        },
        min: 0,
        max: maxY,
        ticks: {
          stepSize: 1,
        }
      },
    },
  };

  window.scatterPlot = new Chart(ctx, {
    type: "scatter",
    data,
    options,
  });
}

export function createProgressLine(sentimentData) {
  const container = document.getElementById("progressLineContainer");
  if (!container) return;

  container.innerHTML = ""; // Clear previous content
  const totalWords = sentimentData.reduce((sum, item) => sum + countWords(item.content), 0);
  let accumulatedPercentage = 0;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "30");

  sentimentData.forEach((item, index) => {
    const wordCount = countWords(item.content);
    const segmentWidth = (wordCount / totalWords) * 100;
    const xStart = accumulatedPercentage;
    accumulatedPercentage += segmentWidth;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", `${xStart}%`);
    rect.setAttribute("y", "5");
    rect.setAttribute("width", `${segmentWidth}%`);
    rect.setAttribute("height", "20");
    rect.setAttribute("fill", getColor(item.label, 1));

    svg.appendChild(rect);
  });

  container.appendChild(svg);
}

function countWords(str) {
  return str.trim().split(/\s+/).length;
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
