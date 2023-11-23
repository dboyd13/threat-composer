const debugPrefix = "ThreatComposerExtension: ";
let stop = false;
console.log(debugPrefix + "Content script triggered");

//Prep global variables
var tcJSONCandidate = undefined;
var tcButton = document.createElement("button");
tcButton.textContent = "View in Threat Composer";
tcButton.disabled = true;

let isLikelyThreatComposerSchema = function (JSONobj) {
  return JSONobj.schema ? true : false;
};

let getTCJSONCandidate = async function (url, element) {
  tcJSONCandidate = await fetch(url)
    .then(function (response) {
      console.log(debugPrefix + "Able to get a JSON candidate");
      return response.json();
    })
    .catch(function (error) {
      console.log(debugPrefix + "Error during fetch: " + error.message);
    });

  if (tcJSONCandidate && isLikelyThreatComposerSchema(tcJSONCandidate)) {
    console.log(
      debugPrefix +
        "Looks like it could be a Threat Composer file, enabling " +
        element.textContent +
        " button"
    );
    element.onclick = function () {
      console.log(
        debugPrefix +
          "Sending message with candicate JSON object back service worker / background script"
      );
      chrome.runtime.sendMessage(tcJSONCandidate);
    };
    element.disabled = false;
  } else {
    console.log(
      debugPrefix +
        "Does NOT look like it's a Threat Composer file, NOT enabling " +
        element.textContent +
        " button"
    );
  }
};

let handleRawFile = async function () {
  let element = document.getElementsByTagName("pre");
  if (element && !stop) {
    stop = true;
    document.body.prepend(tcButton);
    window.scrollTo(0, 0); //Scroll to top
  }
  console.log(debugPrefix + "Proactively attempting to retrieve candidate");
  let url = window.location;
  getTCJSONCandidate(url, tcButton);
};

let handleGitHubCodeViewer = async function () {
  let element = document.querySelector('[aria-label="Copy raw content"]');
  if (element && !stop) {
    stop = true;
    var rawButton = document.querySelector('[aria-label="Copy raw content"]');
    tcButton.setAttribute("type", "button");
    tcButton.setAttribute("class", "types__StyledButton-sc-ws60qy-0 kEGrgm");
    tcButton.setAttribute("data-size", "small");
    rawButton.before(tcButton);

    console.log(debugPrefix + "Proactively attempting to retrieve candidate");
    let url = window.location + "?raw=1";
    tcElement = tcButton;
    getTCJSONCandidate(url, tcButton);
  }
};

let handleAmazonCodeBrowser = async function () {
  let element = document.getElementsByClassName("cs-Tabs__tab-header-actions");
  if (element && !stop) {
    stop = true;
    fileActionsDiv = document.getElementById("file_actions");
    var fileActionsButtonGroup =
      fileActionsDiv.getElementsByClassName("button_group")[0];
    var tcListItem = document.createElement("li");
    var tcAnchor = document.createElement("a");
    tcAnchor.setAttribute("class", "minibutton");
    tcAnchor.textContent = "View in Threat Composer";
    tcAnchor.disabled = true;
    tcListItem.appendChild(tcAnchor);
    fileActionsButtonGroup.appendChild(tcListItem);
    console.log(debugPrefix + "Proactively attempting to retrieve candidate");
    let url = window.location + "?raw=1";
    getTCJSONCandidate(url, tcAnchor);
  }
};

let handleCodeCatalystCodeViewer = async function (event) {
  let element = document.getElementsByClassName(
    "cs-Tabs__tab-header-actions"
  )[0];
  if (element && element.hasChildNodes() && !stop) {
    stop = true;
    var tcAnchor = document.createElement("a");
    tcAnchor.setAttribute(
      "class",
      "awsui_button_vjswe_6ozw9_101 awsui_variant-normal_vjswe_6ozw9_126"
    );

    var tcSpan = document.createElement("span");
    tcSpan.setAttribute("class", "awsui_content_vjswe_6ozw9_97");
    tcSpan.textContent = "Edit in Threat Composer";

    tcAnchor.appendChild(tcSpan);

    tcAnchor.onclick = function () {
      rawText = document.getElementById("raw-div").textContent;
      jsonObj = JSON.parse(rawText);
      console.log("sending message");
      console.log(jsonObj);
      chrome.runtime.sendMessage(jsonObj);
    };

    var actionsDiv = document.getElementsByClassName(
      "cs-Tabs__tab-header-actions"
    )[0];
    actionsDiv.appendChild(tcAnchor);
  }
};

(function () {
  const config = {
    childList: true,
    subtree: true,
  };

  if (
    window.location.href.match(/raw.githubusercontent.com/) ||
    window.location.href.match(/raw=1/)
  ) {
    console.log(
      debugPrefix + "Based on URL or parameters, assuming raw file view"
    );
    handleRawFile();
  } else if (window.location.href.match(/github.com/)) {
    console.log(debugPrefix + "URL is GitHub.com - Assuming code viewer");
    handleGitHubCodeViewer();
    let observerForGitHubCodeViewer = new MutationObserver(
      handleGitHubCodeViewer
    );
    observerForGitHubCodeViewer.observe(document.body, config);
  } else if (window.location.href.match(/codecatalyst.aws/)) {
    console.log(debugPrefix + "URL is codecatalyst.aws - Assuming code viewer");
    //Inject script
    var s = document.createElement("script");
    s.src = chrome.runtime.getURL("code_catalyst_inject_script.js");
    s.onload = function () {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
    let observerForCodeCatalystCodeViewer = new MutationObserver(
      handleCodeCatalystCodeViewer
    );
    observerForCodeCatalystCodeViewer.observe(document.body, config);
  } else if (window.location.href.match(/code.amazon.com/)) {
    console.log(debugPrefix + "URL is code.amazon.com - Assuming code browser");
    handleAmazonCodeBrowser();
    let observerForAmazonCodeBrowser = new MutationObserver(
      handleAmazonCodeBrowser
    );
    observerForAmazonCodeBrowser.observe(document.body, config);
  }
})();
