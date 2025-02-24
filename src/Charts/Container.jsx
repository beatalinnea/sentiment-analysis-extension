import { useState } from "react";
import SentimentControls from "./SentimentControls";
import BarChartComponent from "./BarChartComponent";
import PieChartComponent from "./PieChartComponent";
import ScatterChart from "./SentimentScatterChart";
import RadarChart from "./RadarChartComponent";

const Container = () => {
  const [sentiment, setSentiment] = useState(null); // Sentiment could be Positive, Neutral, Negative
  const [score, setScore] = useState(0); // The sentiment score ranges between 0 and 1

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <SentimentControls
        setSentiment={setSentiment}
        score={score}
        setScore={setScore}
      />

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", maxWidth: "800px", marginTop: "30px" }}>
        <BarChartComponent sentiment={sentiment} score={score} />
        <RadarChart sentiment={sentiment} score={score} />
        <PieChartComponent sentiment={sentiment} score={score} />
        <ScatterChart sentiment={sentiment} score={score} />
      </div>
    </div>
  );
};

export default Container;
