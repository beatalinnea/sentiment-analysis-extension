export async function analyzeMultipleSentiment({ sections }) {
  try {
    const response = await fetch("http://cscloud6-95.lnu.se:8000/get-sentiment-ultra-sections", {
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
