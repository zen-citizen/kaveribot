const button = document.createElement("button");
button.id = "azc-btn";
button.innerHTML = "<span>Ask Spashta</span><span class='arrow'/>"
document.body.appendChild(button);

const browser2workerMessages = {
  toggleSidePanel: "toggleSidePanel",
  getTabId: "getTabId",
};

button.addEventListener("click", async () => {
  button.classList.toggle("open");
  const iframe = document.getElementById("permissionsIFrame") || document.createElement("iframe");
  iframe.setAttribute("hidden", "hidden");
  iframe.setAttribute("id", "permissionsIFrame");
  iframe.setAttribute("allow", "microphone");
  iframe.src = chrome.runtime.getURL("iframe.html");
  document.body.appendChild(iframe);
  if (!chrome) return;
  let response = await chrome.runtime.sendMessage({
    type: browser2workerMessages.getTabId,
  });
  chrome.runtime.sendMessage({
    type: browser2workerMessages.toggleSidePanel,
    tabId: response.tabId,
  });
});

// export const injectMicrophonePermissionIframe = () => {
//   const iframe = document.createElement("iframe");
//   iframe.setAttribute("hidden", "hidden");
//   iframe.setAttribute("id", "permissionsIFrame");
//   iframe.setAttribute("allow", "microphone");
//   iframe.src = chrome.runtime.getURL("/src/pages/permission/index.html");
//   document.body.appendChild(iframe);
// };
