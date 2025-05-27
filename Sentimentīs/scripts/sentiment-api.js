export async function analyzeMultipleSentiment({ sections }) {
  try {
    const response = await fetch("http://cscloud6-95.lnu.se/api/v2/sentimentis/get-sentiment-ultra-sections", {
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

export async function analyzeLongFormSentiment(content) {
  try {
    const response = await fetch("http://cscloud6-95.lnu.se/api/v2/sentimentis/get-sentiment-long-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "text": content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length === 2) {
      const score = data[0]; // e.g., 0.9716501832008362
      const label = data[1]; // e.g., "NEUTRAL"
      
      return { content, score, label };
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error("Error fetching sentiment analysis:", error);
    return [];
  }
}
