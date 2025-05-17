const button = document.createElement("button");
button.id = "azc-btn";
button.textContent = "Ask Zen Citizen";
document.body.appendChild(button);

const browser2workerMessages = {
  toggleSidePanel: "toggleSidePanel",
  getTabId: "getTabId",
};

let panelOpen = false;

button.addEventListener("click", async () => {
  if (!chrome) return;
  let response = await chrome.runtime.sendMessage({
    type: browser2workerMessages.getTabId,
  });
  chrome.runtime.sendMessage({
    type: browser2workerMessages.toggleSidePanel,
    tabId: response.tabId,
  });
});
