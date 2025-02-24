// src/SentimentControls.jsx

const SentimentControls = ({ setSentiment, score, setScore }) => {
  // Handle the sentiment button click
  const handleSentimentClick = (label) => {
    setSentiment(label);
  };

  // Handle the slider change
  const handleSliderChange = (event) => {
    setScore(event.target.value);
  };

  return (
    <div className="sentiment-controls">
      {/* Sentiment buttons */}
      <div className="sentiment-buttons">
        <button onClick={() => handleSentimentClick("NEGATIVE")}>NEGATIVE</button>
        <button onClick={() => handleSentimentClick("NEUTRAL")}>NEUTRAL</button>
        <button onClick={() => handleSentimentClick("POSITIVE")}>POSITIVE</button>
      </div>

      {/* Slider for score */}
      <div className="score-slider">
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
    </div>
  );
};

export default SentimentControls;
