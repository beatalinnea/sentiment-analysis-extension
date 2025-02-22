// src/ChartComponent.jsx

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = () => {
  // State to store the sentiment label and score
  const [sentiment, setSentiment] = useState(null);
  const [score, setScore] = useState(0);

  // Chart.js data configuration
  const data = {
    labels: ["POSITIVE", "NEUTRAL", "NEGATIVE"],
    datasets: [
      {
        label: "Sentiment Score",
        data: [sentiment === "POSITIVE" ? score : 0, sentiment === "NEUTRAL" ? score : 0, sentiment === "NEGATIVE" ? score : 0],
        backgroundColor: [
          "rgba(0, 255, 0, 0.2)", // Positive color
          "rgba(255, 255, 0, 0.2)", // Neutral color
          "rgba(255, 0, 0, 0.2)" // Negative color
        ],
        borderColor: [
          "rgba(0, 255, 0, 1)", // Positive border color
          "rgba(255, 255, 0, 1)", // Neutral border color
          "rgba(255, 0, 0, 1)" // Negative border color
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart.js options configuration
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 1, // Maximum score of 1
      }
    }
  };

  // Update the sentiment and score based on button click
  const handleSentimentClick = (label) => {
    setSentiment(label);
    setScore(0.5); // Default to neutral score when a sentiment is selected
  };

  // Update score when the slider changes
  const handleSliderChange = (event) => {
    setScore(event.target.value);
  };

  return (
    <div>
      <h2>Sentiment Analysis</h2>

      {/* Buttons for POSITIVE, NEUTRAL, and NEGATIVE */}
      <div>
        <button onClick={() => handleSentimentClick("POSITIVE")}>POSITIVE</button>
        <button onClick={() => handleSentimentClick("NEUTRAL")}>NEUTRAL</button>
        <button onClick={() => handleSentimentClick("NEGATIVE")}>NEGATIVE</button>
      </div>

      {/* Slider to choose a score between 0 and 1 */}
      <div>
        <label>Score: </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={score}
          onChange={handleSliderChange}
        />
        <span>{score}</span>
      </div>

      {/* Chart visualization */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
