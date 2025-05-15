// Background script for the KaveriBot Side Panel extension

// Open the side panel when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// Set default side panel state to closed
chrome.runtime.onInstalled.addListener(() => {
  console.log('KaveriBot Side Panel extension installed');
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openSidePanel') {
    chrome.sidePanel.open({ tabId: sender.tab.id });
    sendResponse({ success: true });
  } else if (message.action === 'closeSidePanel') {
    chrome.sidePanel.close({ tabId: sender.tab.id });
    sendResponse({ success: true });
  }
  return true; // Keep the message channel open for async response
}); 