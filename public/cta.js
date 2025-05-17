const button = document.createElement("button");
button.id = "azc-btn";
button.textContent = "Ask Zen Citizen";
document.body.appendChild(button);

const browser2workerMessages = {
  openSidePanel: "openSidePanel",
  getTabId: "getTabId",
};

button.addEventListener("click", async () => {
  if (!chrome) return;
  await chrome.runtime.sendMessage(
    { type: browser2workerMessages.getTabId },
    (response) => {
      chrome.runtime.sendMessage({
        type: browser2workerMessages.openSidePanel,
        tabId: response.tabId,
      });
    }
  );
});
