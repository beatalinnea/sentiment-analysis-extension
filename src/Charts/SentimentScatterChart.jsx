import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, Tooltip } from "chart.js";
import { useEffect, useState } from "react";

// Register Chart.js components
ChartJS.register(LinearScale, CategoryScale, PointElement, Tooltip);

const SentimentScatterChart = ({ sentiment, score }) => {
  // Define X-axis mappings for sentiment
  const sentimentXMapping = {
    NEGATIVE: -1,
    NEUTRAL: 0,
    POSITIVE: 1,
  };

  // Ensure that x updates when sentiment changes
  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: "Sentiment Score",
        data: [{ x: sentimentXMapping[sentiment], y: score }],
        backgroundColor: "rgba(0, 123, 255, 1)",
      },
    ],
  });

  // Update chart data whenever sentiment or score changes
  useEffect(() => {
    setChartData({
      datasets: [
        {
          label: `Sentiment: ${sentiment}`, // Dynamic label
          data: [{ x: sentimentXMapping[sentiment], y: score }],
          backgroundColor: "rgba(0, 123, 255, 1)",
        },
      ],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentiment, score]);

  // Chart options
  const options = {
    scales: {
      x: {
        type: "linear",
        min: -1,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            return value === -1
              ? "NEGATIVE"
              : value === 0
              ? "NEUTRAL"
              : "POSITIVE";
          },
        },
      },
      y: {
        min: 0,
        max: 1,
      },
    },
  };

  return <Scatter data={chartData} options={options} />;
};

export default SentimentScatterChart;
