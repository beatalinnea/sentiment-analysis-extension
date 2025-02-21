/** @format */

chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ["libs/chart.min.js", "contentScript.js"],
	})
})
