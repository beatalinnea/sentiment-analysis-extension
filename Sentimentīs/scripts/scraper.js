export function fetchAndProcessPageData(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: extractAndProcessContent,
      },
      (results) => {
        try {
          if (results?.[0]?.result) {
            callback(results[0].result);
          } else {
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
    const url = window.location.href;
    let title = "";

    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const container = doc.querySelector("article") || doc.body
    const parts = [];
    const h1Element = container.querySelector("h1");

    if (!h1Element) {
      console.warn("No H1 found on the page.");
      return { title, url, parts };
    }

    document.querySelectorAll("[data-sentiment-id]").forEach((el) => {
      el.removeAttribute("data-sentiment-id");
    });

    h1Element.setAttribute("data-sentiment-id", "mh");
    parts.push({ id: "mh", content: h1Element.textContent.trim() });
    title = h1Element.textContent.trim();

    let subheadingCounter = 1;
    let paragraphCounter = 1;
    let currentHeading = null;
    let paragraphBuffer = [];

    async function flushParagraphs() {
      if (currentHeading && paragraphBuffer.length > 0) {
        currentHeading.setAttribute("data-sentiment-id", `sh${subheadingCounter}`);
        parts.push({ id: `sh${subheadingCounter}`, content: currentHeading.textContent.trim() });
        subheadingCounter++;

        for (let pNode of paragraphBuffer) {
          pNode.setAttribute("data-sentiment-id", `p${paragraphCounter}`);
          parts.push({ id: `p${paragraphCounter}`, content: pNode.textContent.trim() });
          paragraphCounter++;
        }
        paragraphBuffer = [];
      }
    }

    const contentNodes = Array.from(container.querySelectorAll("h2, h3, h4, h5, h6, p"));
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
        const fetchedElements = doc.querySelectorAll("[data-sentiment-id]");
    
        fetchedElements.forEach((fetchedElement) => {
          const sentimentId = fetchedElement.getAttribute("data-sentiment-id");
          const textContent = fetchedElement.textContent.trim();
    
          const matchingElement = Array.from(liveDoc.querySelectorAll(fetchedElement.tagName))
            .find((el) => el.textContent.trim() === textContent);
    
          if (matchingElement) {
            matchingElement.setAttribute("data-sentiment-id", sentimentId);
          }
        });
    
      } catch (err) {
        console.error('Error in applyAttributesToLiveDOM:', err);
      }
    }
    await applyAttributesToLiveDOM(doc, document);
    return { title, url, parts };
  } catch (err) {
    console.error('Error in extractAndProcessContent:', err);
    return { title: "Error", url: window.location.href, parts: [] };
  }
}