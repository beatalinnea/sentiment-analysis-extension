/**
 * Fetches and processes article content from the active webpage.
 * Extracts headings and paragraphs while preserving sentiment attributes.
 */
export function fetchAndProcessPageData(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: extractAndProcessContent,
      },
      (results) => {
        if (results?.[0]?.result) {
          console.log('results', results[0].result)
          callback(results[0].result);
        } else {
          console.log('No data')
          callback({ title: "No data", url: "No data", parts: [] });
        }
      }
    );
  });
}

/**
 * Extracts article content from the live webpage and applies sentiment attributes.
 * @returns {Object} - Contains title, URL, and extracted article parts.
 */
async function extractAndProcessContent() {
  const url = window.location.href;
  const title = document.title;

  // Fetch the HTML of the page at the current URL
  const response = await fetch(url);
  const html = await response.text();

  // Use DOMParser to parse the HTML content
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Now process the parsed document (not the live document)
  const parts = [];
  const h1Element = doc.querySelector("h1");
  
  if (!h1Element) {
    console.warn("No H1 found on the page.");
    return { title, url, parts };
  }

  // Clear previous sentiment attributes from live document
  document.querySelectorAll("[data-sentiment-id]").forEach((el) => {
    el.removeAttribute("data-sentiment-id");
  });

  // Assign sentiment ID to H1 (in the fetched document)
  h1Element.setAttribute("data-sentiment-id", "mh");
  parts.push({ id: "mh", content: h1Element.textContent.trim() });

  // Extract subheadings and paragraphs from the fetched document
  let subheadingCounter = 1;
  let paragraphCounter = 1;
  let currentHeading = null;
  let paragraphBuffer = [];

  function flushParagraphs() {
    if (currentHeading && paragraphBuffer.length > 0) {
      currentHeading.setAttribute("data-sentiment-id", `sh${subheadingCounter}`);
      parts.push({ id: `sh${subheadingCounter}`, content: currentHeading.textContent.trim() });
      subheadingCounter++;

      paragraphBuffer.forEach((pNode) => {
        pNode.setAttribute("data-sentiment-id", `p${paragraphCounter}`);
        parts.push({ id: `p${paragraphCounter}`, content: pNode.textContent.trim() });
        paragraphCounter++;
      });
      paragraphBuffer = [];
    }
  }

  // Extract headings and paragraphs from the fetched document
  const contentNodes = Array.from(doc.querySelectorAll("h2, h3, h4, h5, h6, p"));
  for (let node of contentNodes) {
    if (/^H[2-6]$/.test(node.tagName)) {
      flushParagraphs();
      currentHeading = node;
    } else if (node.tagName === "P" && node.textContent.trim()) {
      paragraphBuffer.push(node);
    }
  }
  flushParagraphs();

  // Return the processed data
  return { title, url, parts };
}