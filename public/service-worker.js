// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const ORIGIN = "https://kaveri.karnataka.gov.in";

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

const browser2workerMessages = {
  toggleSidePanel: "toggleSidePanel",
  getTabId: "getTabId",
};

const sendTabInfo = async (sendResponse) => {
  let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs.length) return;
  let currentTab = tabs[0];
  let sidePanelOptions = await chrome.sidePanel.getOptions({
    tabId: currentTab.id,
  });
  sendResponse({ tabId: currentTab.id, sidePanelOptions });
};
// Listen for messages from content script
let sidePanelOpen = false;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === browser2workerMessages.getTabId) {
    sendTabInfo(sendResponse);
  }
  if (message?.type === browser2workerMessages.toggleSidePanel) {
    if (sidePanelOpen) {
      chrome.sidePanel.setOptions({
        tabId: message.tabId,
        enabled: false,
      });
    } else {
      chrome.sidePanel.setOptions(
        {
          tabId: message.tabId,
          path: "index.html",
          enabled: true,
        },
        () => chrome.sidePanel.open({ tabId: message.tabId })
      );
    }
    sidePanelOpen = !sidePanelOpen;
  }
  return true;
});
