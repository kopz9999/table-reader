chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg == "inspectTable") {
    sendResponse(document.all[0].outerHTML);
  }
});
