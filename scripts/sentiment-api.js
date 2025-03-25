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
    return sections.map(section => {
      const sentiment = data.find(item => item.id === section.id);

      if (sentiment) {
        return {
          ...section,
          score: sentiment.score,
          label: sentiment.label,
        };
      }
      return section;
    });
  } catch (error) {
    console.error("Error fetching sentiment analysis:", error);
    return [];
  }
}
