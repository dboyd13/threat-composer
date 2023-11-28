var browser = window.browser ? window.browser : window.chrome;

function loadThreatModel() {
  if (window.ThreatComposer != undefined) {
    browser.storage.local.get("threatModel").then((result) => {
      const answer = result.threatModel;
      window.ThreatComposer.ImportDataIntoCurrentWorkspace(answer);
      observerWindowObject.disconnect();
      handleDashboard(result.threatModel.applicationInfo.name)
    });
  }
}

let observerWindowObject = new MutationObserver(loadThreatModel);

document.addEventListener("visibilitychange", (event) => {
  loadThreatModel();
});

let handleDashboard = async function (tcApplicationName) {
  if (window.location.href.match(/dashboard/)) {
    Array.from(document.querySelectorAll("span")).find((el) =>
      el.textContent.includes("Insights dashboard")
    ).innerText =
      "Insights dashboard for: " + tcApplicationName;
  }
};

observerWindowObject.observe(document.body, {
  childList: true,
  subtree: true,
});
