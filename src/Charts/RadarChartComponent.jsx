import { useRef } from "react";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, Tooltip, Legend, LineElement, Filler } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(RadialLinearScale, Tooltip, Legend, LineElement, Filler);

const RadarChart = ({ sentiment, score }) => {
  // Initialize default certainty values for each sentiment
  const sentimentCertainty = {
    POSITIVE: 0,
    NEUTRAL: 0,
    NEGATIVE: 0
  };

  // Set the score for the selected sentiment
  sentimentCertainty[sentiment] = score;

  // Define data for the radar chart based on sentiment and score
  const data = {
    labels: ["POSITIVE", "NEUTRAL", "NEGATIVE"],
    datasets: [
      {
        label: "Sentiment Certainty",
        data: [
          sentimentCertainty.POSITIVE, // Certainty for Positive
          sentimentCertainty.NEUTRAL,  // Certainty for Neutral
          sentimentCertainty.NEGATIVE  // Certainty for Negative
        ],
        backgroundColor: [
          "rgba(0, 255, 0, 0.2)", // Positive (Green)
          "rgba(255, 255, 0, 0.2)", // Neutral (Yellow)
          "rgba(255, 0, 0, 0.2)" // Negative (Red)
        ],
        borderColor: [
          "rgba(0, 255, 0, 1)", // Positive border (Green)
          "rgba(255, 255, 0, 1)", // Neutral border (Yellow)
          "rgba(255, 0, 0, 1)" // Negative border (Red)
        ],
        borderWidth: 1,
        pointBackgroundColor: [
          "rgba(0, 255, 0, 1)", // Green for positive
          "rgba(255, 255, 0, 1)", // Yellow for neutral
          "rgba(255, 0, 0, 1)" // Red for negative
        ],
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  // Chart.js options configuration
  const options = {
    responsive: true,
    scales: {
      r: { // This is the radial scale for the radar chart
        min: 0,  // Set the minimum value to 0
        max: 1,  // Set the maximum value to 1
        ticks: {
          stepSize: 0.1  // Set the step size for the ticks
        }
      }
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `Certainty: ${tooltipItem.raw}`;
          }
        }
      }
    }
  };

  const chartRef = useRef(null);

  return <Radar data={data} options={options} ref={chartRef} />;
};

export default RadarChart;
