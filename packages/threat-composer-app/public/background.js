chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const tcViewer = "builtin";
  let tcUrlCreate = "";
  let tcUrlUpdate = "";

  if (tcViewer == "builtin") {
    tcUrlCreate = chrome.runtime.getURL("index.html");
    tcUrlUpdate = chrome.runtime.getURL("*");
  } else if (tcViewer == "gh-pages") {
    tcUrlCreate = "https://awslabs.github.io/threat-composer";
    tcUrlUpdate = tcUrlCreate;
  }

  if (request.schema) {
    //This is likely the JSON from a threat model
    console.log("Message recieved - Threat Model JSON");

    try {
        chrome.storage.local.set({ threatModel: request }).then(() => {
        console.log("Saved to Chrome storage");
      });
    } 
    catch {
      browser.storage.local.set({ threatModel: request }).then(() => {
        console.log("Saved to Browser storage");
      });
    }

    chrome.tabs.query({ url: tcUrlUpdate }, function (tabs) {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true });
      } else {
        chrome.tabs.create({ url: tcUrlCreate });
      }
    });
  }
});