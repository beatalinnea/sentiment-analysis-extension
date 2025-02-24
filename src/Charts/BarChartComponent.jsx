import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartComponent = ({ sentiment, score }) => {
  // Define the colors based on sentiment
  const sentimentColors = {
    POSITIVE: {
      backgroundColor: "rgba(0, 255, 0, 0.2)", // Green
      borderColor: "rgba(0, 255, 0, 1)", // Green border
    },
    NEUTRAL: {
      backgroundColor: "rgba(255, 255, 0, 0.2)", // Yellow
      borderColor: "rgba(255, 255, 0, 1)", // Yellow border
    },
    NEGATIVE: {
      backgroundColor: "rgba(255, 0, 0, 0.2)", // Red
      borderColor: "rgba(255, 0, 0, 1)", // Red border
    }
  };

  // Get the color scheme based on the sentiment
  const colorScheme = sentimentColors[sentiment] || sentimentColors.NEUTRAL;

  // Chart.js data configuration
  const data = {
    // Swap the order of the labels here
    labels: ["NEGATIVE", "NEUTRAL", "POSITIVE"], // Negative first, then Neutral, Positive last
    datasets: [
      {
        label: "Sentiment Score", // Label for the dataset
        // Update the data to match the new label order
        data: [
          sentiment === "NEGATIVE" ? score : 0, // Negative score
          sentiment === "NEUTRAL" ? score : 0,  // Neutral score
          sentiment === "POSITIVE" ? score : 0 // Positive score
        ],
        backgroundColor: [
          sentiment === "NEGATIVE" ? colorScheme.backgroundColor : "rgba(255, 0, 0, 0.2)",
          sentiment === "NEUTRAL" ? colorScheme.backgroundColor : "rgba(255, 255, 0, 0.2)",
          sentiment === "POSITIVE" ? colorScheme.backgroundColor : "rgba(0, 255, 0, 0.2)"
        ],
        borderColor: [
          sentiment === "NEGATIVE" ? colorScheme.borderColor : "rgba(255, 0, 0, 1)",
          sentiment === "NEUTRAL" ? colorScheme.borderColor : "rgba(255, 255, 0, 1)",
          sentiment === "POSITIVE" ? colorScheme.borderColor : "rgba(0, 255, 0, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart.js options configuration
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          // Dynamically update the legend color
          generateLabels: (chart) => {
            const originalLabels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);

            // Loop through the original legend items and update their color based on the sentiment
            return originalLabels.map((label) => {
              // Update only the 'Sentiment Score' label
              if (label.text === "Sentiment Score") {
                label.fillStyle = colorScheme.backgroundColor;
                label.strokeStyle = colorScheme.borderColor;
              }
              return label;
            });
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Score: ${tooltipItem.raw}`; // Custom tooltip text
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1, // Maximum score of 1
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default BarChartComponent;
