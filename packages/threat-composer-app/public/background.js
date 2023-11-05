chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.schema) {
    //This is likely the JSON from a threat model
    console.log("Message recieved - Threat Model JSON");
    chrome.storage.local.set({ threatModel: request }).then(() => {
      console.log("Saved to Chrome storage");
    });
    chrome.tabs.query(
      { url: chrome.runtime.getURL("*") },
      function (tabs) {
        if (tabs.length > 0) {
          chrome.tabs.update(tabs[0].id, { active: true });
        } else {
          chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
        }
      }
    );
  }
});
