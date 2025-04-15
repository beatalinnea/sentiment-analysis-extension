import { highlightSectionInText, resetSectionHighlightInText } from "./highlight.js";
import { getColor } from "../utils/colors.js";
import { mapLabelToSwedish } from "../utils/mapLabels.js";

export function createPieChart(sentimentData) {
  const ctxPie = document.getElementById("myPieChart").getContext("2d");
  if (window.myPieChart instanceof Chart) {
    window.myPieChart.destroy();
  }

  const processedData = processSentimentData(sentimentData);
  const totalAmountOfSentiment = sentimentData.length;

  window.myPieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: [
        mapLabelToSwedish("NEGATIVE"), 
        mapLabelToSwedish("NEUTRAL"), 
        mapLabelToSwedish("POSITIVE")
      ],
      datasets: [
        {
          label: "Sentiment Distribution",
          data: [
            processedData[0].amountOfTexts, // NEGATIVE total
            processedData[1].amountOfTexts, // NEUTRAL total
            processedData[2].amountOfTexts, // POSITIVE total
          ],
          backgroundColor: [
            getColor(processedData[0].label, processedData[0].average),
            getColor(processedData[1].label, processedData[1].average),
            getColor(processedData[2].label, processedData[2].average),
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Textens sentiment",
        },
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;
              const value = context.dataset.data[index];
              const avg = processedData[index].average;
              const avgPercentage = (avg * 100).toFixed(2);

              return [
                `${value} st (${((value / totalAmountOfSentiment) * 100).toFixed(2)}%)`,
                `Genomsnittlig Pålitlighet: ${avgPercentage}%`
              ];
            },
          },
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
    x: item.score * 100,
    y: countWords(item.content),
    id: item?.id || index + 1,
    originalLabel: item.label,
    label: mapLabelToSwedish(item.label),
    backgroundColor: getColor(item.label, item.score),
    borderColor: getColor(item.label, 1),
    borderWidth: 1,
  }));

  const rawMinX = Math.min(...dataPoints.map((point) => point.x));
  // Math ceil to closet 10
  const minX = Math.max(0, Math.floor(rawMinX / 10) * 10);
  const rawMaxY = Math.max(...dataPoints.map((point) => point.y));
  const maxY = (Math.max(10, Math.ceil(rawMaxY / 10) * 10) + 10);

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
            const { originalLabel, label, id, x, y } = context.raw;
            highlightProgressLineBorder(id, originalLabel);
            return [`${label}`, `Pålitlighet: ${x.toFixed(2)}%`, `Antal ord: ${y}`];
          },
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Sentiment per textstycke",
      },
    },
    onHover: (event, elements) => {
      if (elements.length === 0) {
        resetProgressLineBorders();
      }
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        min: minX,  
        max: 100,  
      },
      y: {
        title: {
          display: true,
          text: "Antal ord",
        },
        min: 0,
        max: maxY,
        ticks: {
          stepSize: 10,
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

  container.innerHTML = "";
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
    rect.setAttribute("fill", getColor(item.label, item.score));
    rect.setAttribute("value", item.id);
    rect.addEventListener("mouseover", () => handleProgressLineHover(item.id));
    rect.addEventListener("mouseout", () => resetScatterPlot());
    svg.appendChild(rect);
  });
  container.appendChild(svg);
}

function handleProgressLineHover(id) {
  const scatterPlotData = window.scatterPlot.data.datasets[0].data;
  const pointIndex = scatterPlotData.findIndex((point) => point.id === id);
  
  if (pointIndex === -1) return;

  window.scatterPlot.tooltip.setActiveElements(
    [{
      datasetIndex: 0,
      index: pointIndex
    }],
    { x: 0, y: 0 }
  );

  window.scatterPlot.update();
}

function resetScatterPlot() {
  resetProgressLineBorders();
  window.scatterPlot.tooltip.setActiveElements([], { x: 0, y: 0 });
  window.scatterPlot.update();
}

function highlightProgressLineBorder(id, label) {
  resetProgressLineBorders();
  highlightSectionInText(id, label);
  const progressLineElements = document.querySelectorAll("rect");
  progressLineElements.forEach((rect) => {
    const rectId = rect.getAttribute("value");
    if (rectId === id) {
      rect.setAttribute("stroke", "rgba(0, 0, 0, 0.9)");
      rect.setAttribute("stroke-width", "1");
    }
  });
}

// Function to reset all borders in the progress line
function resetProgressLineBorders() {
  const progressLineElements = document.querySelectorAll("rect");
  resetSectionHighlightInText();
  progressLineElements.forEach((rect) => {
    rect.setAttribute("stroke", "none"); // Remove any borders
  });
}
// ================================================================================
// =============================== HELPER FUNCTIONS ===============================
// ================================================================================
function processSentimentData(sentimentData) {
  const sentimentLabels = ["NEGATIVE", "NEUTRAL", "POSITIVE"];

  return sentimentLabels.map(label => {
    const filtered = sentimentData.filter(d => d.label === label);
    const scores = filtered.map(d => d.score);
    const average = scores.length > 0
      ? scores.reduce((sum, s) => sum + s, 0) / scores.length
      : 0;

    return {
      label,
      amountOfTexts: filtered.length,
      average
    };
  });
}

function countWords(str) {
  return str.trim().split(/\s+/).length;
}