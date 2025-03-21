export async function analyzeMultipleSentiment({ sections }) {
  try {
    const response = await fetch("http://cscloud7-123.lnu.se:8000/get-sentiment-ultra-sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Error fetching sentiment analysis:", error);
    return [];
  }
}

export async function analyzeSingleSentiment(text) {
  try {
    const response = await fetch("http://cscloud7-123.lnu.se:8000/get-sentiment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Ensure the result is returned as an array
    return Array.isArray(data) ? data : [data]; 
  } catch (error) {
    console.error("Error fetching sentiment analysis:", error);
    return [];
  }
}
