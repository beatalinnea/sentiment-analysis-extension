// src/PieChartComponent.jsx
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ sentiment, score }) => {
  const data = {
    labels: ["POSITIVE", "NEUTRAL", "NEGATIVE"],
    datasets: [
      {
        data: [
          sentiment === "POSITIVE" ? score : 0,
          sentiment === "NEUTRAL" ? score : 0,
          sentiment === "NEGATIVE" ? score : 0
        ],
        backgroundColor: [
          "rgba(0, 255, 0, 0.6)", // Positive color
          "rgba(255, 255, 0, 0.6)", // Neutral color
          "rgba(255, 0, 0, 0.6)" // Negative color
        ],
        hoverOffset: 4
      }
    ]
  };

  return <Pie data={data} />;
};

export default PieChartComponent;
