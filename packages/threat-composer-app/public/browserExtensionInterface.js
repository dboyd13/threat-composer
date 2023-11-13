var browser = (window.browser)? window.browser : window.chrome;

function loadThreatModel() {
  browser.storage.local.get("threatModel").then((result) => {
    const answer = result.threatModel;
    window.ThreatComposer.ImportDataIntoCurrentWorkspace(answer);

    Array.from(document.querySelectorAll("span")).find((el) =>
      el.textContent.includes("Insights dashboard")
    ).innerText =
      "Insights dashboard for: " + result.threatModel.applicationInfo.name;
  });
}

document.addEventListener("visibilitychange", (event) => {
  loadThreatModel();
});

loadThreatModel();
