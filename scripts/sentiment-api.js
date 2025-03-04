export function analyzeMultipleSentiment(text) {
  // TODO: Replace this with an API call
  return [
    { label: "NEGATIVE", score: Math.random() },
    { label: "NEUTRAL", score: Math.random() },
    { label: "POSITIVE", score: Math.random() },
    { label: "NEGATIVE", score: Math.random() },
    { label: "NEUTRAL", score: Math.random() },
    { label: "POSITIVE", score: Math.random() },
    { label: "NEGATIVE", score: Math.random() },
    { label: "NEUTRAL", score: Math.random() },
    { label: "POSITIVE", score: Math.random() },
    { label: "NEGATIVE", score: Math.random() },
  ];
}

export function analyzeSingleSentiment(text) {
  // TODO: Replace this with an API call
  return [{ label: "NEUTRAL", score: Math.random() }];
}
