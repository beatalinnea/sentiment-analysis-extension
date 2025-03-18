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
function extractAndProcessContent() {
  const h1Element = document.querySelector("h1");
  const title = h1Element ? h1Element.innerText.trim() : document.title;
  const url = window.location.href;

  // Clear previous sentiment attributes
  document.querySelectorAll("[data-sentiment-id]").forEach((el) => {
    el.removeAttribute("data-sentiment-id");
  });

  const parts = [];
  const container = document.querySelector("article") || document.body;
  
  if (!h1Element) {
    console.warn("No H1 found on the page.");
    return { title, url, parts };
  }

  // Assign sentiment ID to H1
  h1Element.setAttribute("data-sentiment-id", "mh");
  parts.push({ id: "mh", content: h1Element.textContent.trim() });

  // Extract subheadings and paragraphs
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

  const contentNodes = Array.from(container.querySelectorAll("h2, h3, h4, h5, h6, p"));
  for (let node of contentNodes) {
    if (/^H[2-6]$/.test(node.tagName)) {
      flushParagraphs();
      currentHeading = node;
    } else if (node.tagName === "P" && node.textContent.trim()) {
      paragraphBuffer.push(node);
    }
  }
  flushParagraphs();

  return { title, url, parts };
}
