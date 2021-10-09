function openPage() {
	browser.runtime.openOptionsPage();
}

// browser.browserAction.onClicked.addListener(openPage);

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "xhttp") {
        var xhttp = new XMLHttpRequest();
        var method = request.method ? request.method.toUpperCase() : 'GET';

        xhttp.onload = function() {
            callback(xhttp.responseText);
        };
        xhttp.onerror = function() {
            // Do whatever you want on error. Don't forget to invoke the
            // callback to clean up the communication port.
            callback();
        };
        xhttp.open(method, request.url, true);
        if (method == 'POST') {
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhttp.send(request.data);
        return true; // prevents the callback from being called too early on return
    }
});

var isCSPDisabled = true;

var onHeadersReceived = function(details) {
  if (!isCSPDisabled) {
      return;
  }

  for (var i = 0; i < details.responseHeaders.length; i++) {
    if ('content-security-policy' === details.responseHeaders[i].name.toLowerCase()) {
      details.responseHeaders[i].value = '';
    }
  }

  return {
    responseHeaders: details.responseHeaders
  };
};



var filter = {
  urls: ["*://*/*"],
  types: ["main_frame", "sub_frame"]
};

chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, filter, ["blocking", "responseHeaders"]);

chrome.runtime.onInstalled.addListener(function() {
     chrome.browsingData.remove({}, {"serviceWorkers": true}, function () {});
  });



