export function fetchAndProcessPageData(callback) {
  console.log('fetchAndProcessPageData is called');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('Active tab found:', tabs[0].id);
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: extractAndProcessContent,
      },
      (results) => {
        try {
          if (results?.[0]?.result) {
            console.log('results', results[0].result);
            callback(results[0].result);
          } else {
            console.log('No data');
            callback({ title: "No data", url: "No data", parts: [] });
          }
        } catch (err) {
          console.error('Error during script execution callback:', err);
        }
      }
    );
  });
}

async function extractAndProcessContent() {
  try {
    console.log('extractAndProcessContent is running...');
    const url = window.location.href;
    let title = "";
    console.log('Fetching URL:', url);

    // Fetch the HTML of the page at the current URL
    const response = await fetch(url);
    const html = await response.text();
    console.log('Fetched HTML:', html);

    // Use DOMParser to parse the HTML content into a new document
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    console.log('Parsed document:', doc);
    const container = doc.querySelector("article") || doc.body

    // Process the parsed document to extract content and add sentiment attributes
    const parts = [];
    const h1Element = container.querySelector("h1");

    if (!h1Element) {
      console.warn("No H1 found on the page.");
      return { title, url, parts };
    }

    // Clear previous sentiment attributes from live document
    document.querySelectorAll("[data-sentiment-id]").forEach((el) => {
      el.removeAttribute("data-sentiment-id");
    });

    // Apply sentiment ID to H1 in the parsed document
    h1Element.setAttribute("data-sentiment-id", "mh");
    parts.push({ id: "mh", content: h1Element.textContent.trim() });
    title = h1Element.textContent.trim();

    // Extract subheadings and paragraphs and apply sentiment attributes in doc
    let subheadingCounter = 1;
    let paragraphCounter = 1;
    let currentHeading = null;
    let paragraphBuffer = [];

    async function flushParagraphs() {
      if (currentHeading && paragraphBuffer.length > 0) {
        console.log('Flushing paragraphs...');
        currentHeading.setAttribute("data-sentiment-id", `sh${subheadingCounter}`);
        parts.push({ id: `sh${subheadingCounter}`, content: currentHeading.textContent.trim() });
        subheadingCounter++;

        for (let pNode of paragraphBuffer) {
          console.log('Assigning sentiment ID to paragraph:', pNode);
          pNode.setAttribute("data-sentiment-id", `p${paragraphCounter}`);
          parts.push({ id: `p${paragraphCounter}`, content: pNode.textContent.trim() });
          paragraphCounter++;
        }
        paragraphBuffer = [];
      }
    }

    // Extract headings and paragraphs from the fetched document
    const contentNodes = Array.from(container.querySelectorAll("h2, h3, h4, h5, h6, p"));
    console.log('Extracting content nodes...');
    for (let node of contentNodes) {
      if (/^H[2-6]$/.test(node.tagName)) {
        await flushParagraphs();
        currentHeading = node;
      } else if (node.tagName === "P" && node.textContent.trim()) {
        paragraphBuffer.push(node);
      }
    }
    await flushParagraphs();

    async function applyAttributesToLiveDOM(doc, liveDoc) {
      try {
        console.log('Applying attributes to live DOM...');
        const fetchedElements = doc.querySelectorAll("[data-sentiment-id]");
    
        fetchedElements.forEach((fetchedElement) => {
          const sentimentId = fetchedElement.getAttribute("data-sentiment-id");
          const textContent = fetchedElement.textContent.trim();
    
          // Find the matching element in the live DOM based on tag and content
          const matchingElement = Array.from(liveDoc.querySelectorAll(fetchedElement.tagName))
            .find((el) => el.textContent.trim() === textContent);
    
          if (matchingElement) {
            matchingElement.setAttribute("data-sentiment-id", sentimentId);
          }
        });
    
        console.log("Updated live DOM with new sentiment attributes.");
      } catch (err) {
        console.error('Error in applyAttributesToLiveDOM:', err);
      }
    }
    // Apply the sentiment attributes from the parsed doc to the live document
    await applyAttributesToLiveDOM(doc, document);

    console.log('Processed parts:', parts);
    // Return the processed data
    return { title, url, parts };
  } catch (err) {
    console.error('Error in extractAndProcessContent:', err);
    return { title: "Error", url: window.location.href, parts: [] };
  }
}