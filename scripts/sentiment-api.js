export async function analyzeMultipleSentiment(text) {
  try {
    const response = await fetch("http://127.0.0.1:8000/get-sentiment", {
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

    // Ensure data is in array format
    const resultArray = Array.isArray(data) ? data : [data];

    // Add some default sentiment data
    resultArray.push(
      { label: "NEGATIVE", score: 0.25 },
      { label: "NEUTRAL", score: 0.50 },
      { label: "POSITIVE", score: 0.75 }
    );

    return resultArray;
  } catch (error) {
    console.error("Error fetching sentiment analysis:", error);
    return []; // Return an empty array on failure
  }
}

export async function analyzeSingleSentiment(text) {
  try {
    const response = await fetch("http://127.0.0.1:8000/get-sentiment", {
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
