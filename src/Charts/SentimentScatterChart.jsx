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

  // Set color dynamically based on sentiment
  const sentimentColorMapping = {
    POSITIVE: "rgba(0, 255, 0, 1)", // Green for positive
    NEUTRAL: "rgba(255, 255, 0, 1)", // Yellow for neutral
    NEGATIVE: "rgba(255, 0, 0, 1)", // Red for negative
  };

  // Ensure that x updates when sentiment changes
  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: "Sentiment Score",
        data: [{ x: sentimentXMapping[sentiment], y: score }],
        backgroundColor: sentimentColorMapping[sentiment], // Dynamically set the color based on sentiment
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
          backgroundColor: sentimentColorMapping[sentiment], // Dynamically set the color based on sentiment
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
