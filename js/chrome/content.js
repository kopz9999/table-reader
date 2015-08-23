chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg == "inspectDom") {
    sendResponse(document.all[0].outerHTML);
  }
});
