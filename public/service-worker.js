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

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  console.log("updated", tabId, info, tab);
  if (!tab.url && !tab.pendingUrl) {
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false,
    });
    return;
  }
  const url = new URL(tab.pendingUrl || tab.url);
  // Enables the side panel only on the Kaveri portal
  if (url.origin === ORIGIN) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: "index.html",
      enabled: true,
    });
  }
});

chrome.tabs.onActivated.addListener(async (tab) => {
  console.log("activated", tab);
});
