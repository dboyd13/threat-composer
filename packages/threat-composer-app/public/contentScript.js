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
            console.log(JSONobject)
            chrome.runtime.sendMessage(JSONobject);
          })
      )
      .catch((err) => {
        throw err;
      });
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
