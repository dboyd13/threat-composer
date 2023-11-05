function loadThreatModel() {
  chrome.storage.local.get("threatModel").then((result) => {
    const answer = result.threatModel;
    window.ThreatComposer.ImportDataIntoCurrentWorkspace(answer);

    Array.from(document.querySelectorAll("span")).find((el) =>
      el.textContent.includes("Insights dashboard")
    ).innerText =
      "Insights dashboard for: " + result.threatModel.applicationInfo.name;
  });

  workspaceArea = document.querySelectorAll('[class^="awsui_breadcrumbs"]')[0];
  if (workspaceArea) {
    workspaceArea.remove();
  }
}

document.addEventListener("visibilitychange", (event) => {
  loadThreatModel();
});

loadThreatModel();
