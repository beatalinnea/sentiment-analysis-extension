# Sentimentīs - Sentiment Analysis Browser Extension

This repository contains the **client-side code** for a browser extension designed to perform **sentiment analysis** on **Swedish news articles**. The tool is currently built and localized entirely in **Swedish**.

## Overview

This browser extension allows users to analyze the sentiment of news articles directly in the browser. Whether you're scraping a live article or inputting custom text, the tool provides immediate sentiment feedback and highlights tone directly in the article for easy interpretation.

## Features

- **Language Support**:  
  Tailored for **Swedish-language** content; all text and interactions are in Swedish.

- **One-Click Sentiment Analysis**  
  Click the extension icon in your browser toolbar, this will open the application and automatically extract and analyze content from the current webpage.

- **Interactive Side Panel**  
  View sentiment analysis results and navigate the tool via an intuitive side panel UI.

- **Custom Text Input**  
  Use the input feature to manually enter Swedish text for analysis.

- **Sentiment Highlighting**  
  Activate the highlight mode to overlay colour-coded sentiment directly on article text:
  - 🟢 **Green** = Positive  
  - 🔴 **Red** = Negative  
  - 🔵 **Blue** = Neutral

## How to Use

(Currently not deployed, the application folder needs to be manually uploaded to Chrome Extensions)
1. **Open the Extension**  
   Click the extension icon in your browser toolbar.

2. **Scrape Article Content**  
   Enter "Scrape" mode (default) to extract text from the current webpage.

3. **Analyze Custom Text**  
   Use the "Input" button to analyze your own Swedish text.

4. **Highlight Sentiment**  
   Enable the sentiment-based highlighting directly on the article text.

5. **Read Results**  
   The sentiment analysis output is shown within the application’s side panel.
   * Horizontal Bar - Represents the sentiment distribution from start to finish, where each section is represented by the corresponding sentiment colour. The transparency is determined by the certainty score, and the width is based on the word count of the given paragraph.
   * Scatter Plot - Each scatter represents a paragraph. The x-axis represents the certainty of the labels, whereas the y-axis represents the word count. The colour is dependent on the sentiment and the certainty of the label.
   * Pie Chart - Each pie segment represents the number of paragraphs with the corresponding label, and the colour is based on the average certainty of that label across the whole text.

## About This Repo

- This repository includes **only the client-side code** of the browser extension.
- Backend or API services are maintained separately [here](https://github.com/TeaElming/robust-sentiment-swedish-api-limited).
- This is part of a bachelor's degree Design Science Research Project in Computer Science by Tea Sallstedt Elming and Beata Eriksson at Linnaeus University, spring 2025.
