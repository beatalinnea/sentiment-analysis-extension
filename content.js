(function (history) {
  const originalPushState = history.pushState
  history.pushState = function (...args) {
    const result = originalPushState.apply(history, args)
    window.dispatchEvent(new Event("locationchange"))
    return result
  }

  const originalReplaceState = history.replaceState
  history.replaceState = function (...args) {
    const result = originalReplaceState.apply(history, args)
    window.dispatchEvent(new Event("locationchange"))
    return result
  }
})(window.history)

window.addEventListener("popstate", () =>
  window.dispatchEvent(new Event("locationchange"))
)

window.addEventListener("hashchange", updateUrl)

window.addEventListener("locationchange", updateUrl)

function updateUrl() {
  console.log("Update URL was triggered")
  const pageData = {
    title: document.title,
    url: window.location.href
  }

  chrome.runtime.sendMessage({ action: "updateSidebar", pageData: pageData })
}

updateUrl()

let currentUrl = window.location.href
setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href
    updateUrl()
  }
}, 500)