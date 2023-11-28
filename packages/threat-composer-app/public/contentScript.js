let stop = false;
let gitHubPreviousURL = "";

//Prep global variables
const tcFileExtension = ".tc.json";
const tcDebug = true;
const tcIntegrationRawEnabled = true;
const tcIntegrationGitHubCodeBrowserEnabled = true;
const tcIntegrationCodeCatalystCodeBrowserEnabled = true;
const tcIngegrationAmazonCodeBrowserEnabled = true;

var tcJSONCandidate = undefined;
var tcButton = document.createElement("button");
tcButton.textContent = "View in Threat Composer";
tcButton.disabled = true;

let logDebugMessage = function (msg) {
  const debugPrefix = "ThreatComposerExtension: ";
  if (tcDebug) console.log(debugPrefix + msg);
};

let isLikelyThreatComposerSchema = function (JSONobj) {
  return JSONobj.schema ? true : false;
};

let getTCJSONCandidate = async function (url, element) {
  tcJSONCandidate = await fetch(url)
    .then(function (response) {
      logDebugMessage("Able to get a JSON candidate");
      return response.json();
    })
    .catch(function (error) {
      logDebugMessage("Error during fetch: " + error.message);
    });

  if (tcJSONCandidate && isLikelyThreatComposerSchema(tcJSONCandidate)) {
    logDebugMessage(
      "Looks like it could be a Threat Composer file, enabling " +
        element.textContent +
        " button"
    );
    element.onclick = function () {
      logDebugMessage(
        "Sending message with candicate JSON object back service worker / background script"
      );
      chrome.runtime.sendMessage(tcJSONCandidate);
    };
    element.disabled = false;
  } else {
    logDebugMessage(
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
  logDebugMessage("Proactively attempting to retrieve candidate");
  let url = window.location;
  getTCJSONCandidate(url, tcButton);
};

let handleGitHubCodeViewer = async function () {
  var regExCheck = new RegExp(tcFileExtension);
  if (window.location.href.match(regExCheck)) {
    let element = document.querySelector('[aria-label="Copy raw content"]');
    if (window.location.href != gitHubPreviousURL) {
      //Handle GitHub being a SPA
      gitHubPreviousURL = window.location.href;
      stop = false;
    }
    if (element && !stop) {
      stop = true;
      var rawButton = document.querySelector('[aria-label="Copy raw content"]');
      tcButton.setAttribute("type", "button");
      tcButton.setAttribute("class", "types__StyledButton-sc-ws60qy-0 kEGrgm");
      tcButton.setAttribute("data-size", "small");
      rawButton.before(tcButton);

      logDebugMessage("Proactively attempting to retrieve candidate");
      let url = window.location + "?raw=1";
      tcElement = tcButton;
      getTCJSONCandidate(url, tcButton);
    }
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
    logDebugMessage("Proactively attempting to retrieve candidate");
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
    tcSpan.textContent = "View in Threat Composer";

    tcAnchor.appendChild(tcSpan);

    tcAnchor.onclick = function () {
      rawText = document.getElementById("raw-div").textContent;
      jsonObj = JSON.parse(rawText);
      logDebugMessage(
        "Sending message with candicate JSON object back service worker / background script"
      );
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
    tcIntegrationRawEnabled &&
    (window.location.href.match(/raw.githubusercontent.com/) ||
      window.location.href.match(/raw=1/))
  ) {
    logDebugMessage("Based on URL or parameters, assuming raw file view");
    handleRawFile();
  } else if (
    tcIntegrationGitHubCodeBrowserEnabled &&
    window.location.href.match(/github.com/)
  ) {
    logDebugMessage(
      "URL is GitHub.com - Setting up mutation observer scoped to *://*.github.com/*" +
        tcFileExtension +
        "*"
    );
    handleGitHubCodeViewer();
    let observerForGitHubCodeViewer = new MutationObserver(
      handleGitHubCodeViewer
    );
    observerForGitHubCodeViewer.observe(document, config);
  } else if (
    tcIntegrationCodeCatalystCodeBrowserEnabled &&
    window.location.href.match(/codecatalyst.aws/)
  ) {
    logDebugMessage("URL is codecatalyst.aws - Assuming code viewer");
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
  } else if (
    tcIngegrationAmazonCodeBrowserEnabled &&
    window.location.href.match(/code.amazon.com/)
  ) {
    logDebugMessage("URL is code.amazon.com - Assuming code browser");
    handleAmazonCodeBrowser();
    let observerForAmazonCodeBrowser = new MutationObserver(
      handleAmazonCodeBrowser
    );
    observerForAmazonCodeBrowser.observe(document.body, config);
  }
})();
