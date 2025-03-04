export function analyzeMultipleSentiment(text) {
  // TODO: Replace this with an API call
  return [
    { label: "NEGATIVE", score: Math.random().toFixed(2) },
    { label: "NEUTRAL", score: Math.random().toFixed(2) },
    { label: "POSITIVE", score: Math.random().toFixed(2) },
    { label: "NEGATIVE", score: Math.random().toFixed(2) },
    { label: "NEUTRAL", score: Math.random().toFixed(2) },
    { label: "POSITIVE", score: Math.random().toFixed(2) },
    { label: "NEGATIVE", score: Math.random().toFixed(2) },
    { label: "NEUTRAL", score: Math.random().toFixed(2) },
    { label: "POSITIVE", score: Math.random().toFixed(2) },
    { label: "NEGATIVE", score: Math.random().toFixed(2) },
  ];
}

export function analyzeSingleSentiment(text) {
  // TODO: Replace this with an API call
  let randomScore = Math.random();
  if (randomScore < 0.50) {
    randomScore += 0.40;
  }
  return [{ label: "POSITIVE", score: randomScore.toFixed(2) }];
}
