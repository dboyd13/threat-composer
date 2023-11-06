(async () => {
  console.log("Threat Composer viewer - Content script - Triggered");

  if (document.querySelector('[aria-label="Copy raw content"]')) {
    //Check if GitHub
    console.log(
      "Threat Composer viewer - Content script - Looks like GitHub code view, adding Button"
    );

    var raw_button = document.querySelector('[aria-label="Copy raw content"]');

    var tc_button = document.createElement("button");
    tc_button.textContent = "View in Threat Composer";
    tc_button.setAttribute("type", "button");
    tc_button.setAttribute("class", "types__StyledButton-sc-ws60qy-0 kEGrgm");
    tc_button.setAttribute("data-size", "small");

    raw_button.before(tc_button);

    let url = window.location + "?raw=1";

    fetch(url)
      .then((res) => res.json())
      .then(
        (JSONobject) =>
          (tc_button.onclick = function () {
            console.log("sending message");
            console.log(JSONobject);
            chrome.runtime.sendMessage(JSONobject);
          })
      )
      .catch((err) => {
        throw err;
      });
  } else if (window.location.href.includes("code.amazon.com")) {
    //Check if Code Browser
    console.log(
      "Threat Composer viewer - Content script - Looks like Code Browser view, adding Button"
    );

    var file_actions_div = document.getElementById("file_actions");
    var file_actions_button_group =
      file_actions_div.getElementsByClassName("button_group")[0];

    var tc_listitem = document.createElement("li");
    var tc_anchor = document.createElement("a");
    tc_anchor.setAttribute("class", "minibutton");
    tc_anchor.textContent = "View in Threat Composer";
    tc_listitem.appendChild(tc_anchor);
    file_actions_button_group.appendChild(tc_listitem);

    let url = window.location + "?raw=1";

    fetch(url)
      .then((res) => res.json())
      .then(
        (JSONobject) =>
          (tc_anchor.onclick = function () {
            console.log("sending message");
            console.log(JSONobject);
            chrome.runtime.sendMessage(JSONobject);
          })
      )
      .catch((err) => {
        throw err;
      });
  } else if (window.location.href.includes("codecatalyst.aws")) {
    console.log(
      "Threat Composer viewer - Content script - Appears to be a Code Catalyst view , adding Button"
    );

    var tc_anchor = document.createElement("a");
    tc_anchor.setAttribute(
      "class",
      "awsui_button_vjswe_6ozw9_101 awsui_variant-normal_vjswe_6ozw9_126"
    );

    var tc_span = document.createElement("span");
    tc_span.setAttribute("class", "awsui_content_vjswe_6ozw9_97");
    tc_span.textContent = "Edit in Threat Composer";

    tc_anchor.appendChild(tc_span);

    tc_anchor.onclick = function () {
      rawText = document.getElementById("raw-div").textContent;
      jsonObj = JSON.parse(rawText);
      console.log("sending message");
      console.log(jsonObj);
      chrome.runtime.sendMessage(jsonObj);
    };

    setTimeout(() => {
      console.log("Delayed for 8 seconds.");
      var actions_div = document.getElementsByClassName(
        "cs-Tabs__tab-header-actions"
      )[0];
      actions_div.appendChild(tc_anchor);
      var s = document.createElement("script");
      s.src = chrome.runtime.getURL("code_catalyst_inject_script.js");
      s.onload = function () {
        this.remove();
      };
      (document.head || document.documentElement).appendChild(s);
    }, "8000");
  } else {
    //Assume it's a 'raw' view

    var rawText = "";
    var textNodes = [...window.document.childNodes];
    textNodes.forEach((tn) => (rawText += tn.textContent));

    var JSONobject = JSON.parse(rawText);

    if (JSONobject.schema) {
      console.log(
        'Threat Composer viewer - Content script - Appears to be a "RAW" Threat Composer JSON file, adding Button'
      );
      var button = document.createElement("button");
      var text = document.createTextNode("View in Threat Composer");
      button.appendChild(text);
      document.body.prepend(button);

      button.onclick = function () {
        console.log("sending message");
        chrome.runtime.sendMessage(JSONobject);
      };
    } else {
      console.log(
        'Threat Composer viewer - Content script - Appears NOT to be a "RAW" Threat Composer JSON file, NOT adding Button'
      );
    }
  }
})();
