import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement } from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, LineElement);

const PieChartComponent = ({ sentiment, score }) => {
  // Define colors for each sentiment type
  const sentimentColors = {
    POSITIVE: "rgba(0, 255, 0, 0.6)", // Green
    NEUTRAL: "rgba(255, 255, 0, 0.6)", // Yellow
    NEGATIVE: "rgba(255, 0, 0, 0.6)",  // Red
  };

  // The color for the remaining "uncertainty" section
  const uncertaintyColor = "rgba(200, 200, 200, 0.6)"; // Light grey

  // Logic to determine the dataset based on the selected sentiment
  let data = {
    labels: ["Certainty", "Uncertainty"],
    datasets: [],
  };

  switch (sentiment) {
    case "POSITIVE":
      data.datasets = [
        {
          data: [score, 1 - score], // Certainty vs uncertainty based on score
          backgroundColor: [
            sentimentColors.POSITIVE, // Positive part (certainty)
            uncertaintyColor,         // Uncertainty part
          ],
          borderWidth: 1,
          borderColor: "transparent",
        },
      ];
      break;
    case "NEUTRAL":
      data.datasets = [
        {
          data: [score, 1 - score], // Certainty vs uncertainty based on score
          backgroundColor: [
            sentimentColors.NEUTRAL, // Neutral part (certainty)
            uncertaintyColor,        // Uncertainty part
          ],
          borderWidth: 1,
          borderColor: "transparent",
        },
      ];
      break;
    case "NEGATIVE":
      data.datasets = [
        {
          data: [score, 1 - score], // Certainty vs uncertainty based on score
          backgroundColor: [
            sentimentColors.NEGATIVE, // Negative part (certainty)
            uncertaintyColor,         // Uncertainty part
          ],
          borderWidth: 1,
          borderColor: "transparent",
        },
      ];
      break;
    default:
      break;
  }

  return (
    <div>
      {/* Pie chart */}
      <Pie data={data} />
    </div>
  );
};

export default PieChartComponent;
