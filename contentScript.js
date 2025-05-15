// Content script for KaveriBot Side Panel extension

// Initialize variables
let sidePanel = null;
let sidePanelPosition = 'right'; // Default to right side
let sidePanelOpen = false;
let sidebarWidth = 360; // Default width in pixels

// Function to create the toggle button
function createToggleButton() {
  // Create button container for positioning
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'kaveri-side-toggle-container';
  buttonContainer.style.cssText = `
    position: fixed;
    z-index: 10000001;
    top: 30%;
    ${sidePanelPosition === 'left' ? 'left: 0;' : 'right: 0;'}
    display: flex;
    align-items: center;
    ${sidePanelPosition === 'left' ? 'flex-direction: row;' : 'flex-direction: row-reverse;'}
  `;
  
  // Create the slim black rectangle button
  const button = document.createElement('div');
  button.className = 'kaveri-side-toggle';
  button.style.cssText = `
    width: 8px;
    height: 120px;
    background-color: #222;
    border-radius: ${sidePanelPosition === 'left' ? '0 4px 4px 0' : '4px 0 0 4px'};
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  `;
  
  // Create the label that appears on hover
  const label = document.createElement('div');
  label.className = 'kaveri-side-toggle-label';
  label.textContent = sidePanelOpen ? 'Hide Chatbot' : 'Open Chatbot';
  label.style.cssText = `
    background-color: #222;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(${sidePanelPosition === 'left' ? '-10px' : '10px'});
    transition: all 0.3s ease;
    ${sidePanelPosition === 'left' ? 'margin-left: 8px;' : 'margin-right: 8px;'}
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  
  // Add hover effect
  buttonContainer.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#3b82f6';
    button.style.width = '12px';
    label.style.opacity = '1';
    label.style.transform = 'translateX(0)';
  });
  
  buttonContainer.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#222';
    button.style.width = '8px';
    label.style.opacity = '0';
    label.style.transform = `translateX(${sidePanelPosition === 'left' ? '-10px' : '10px'})`;
  });
  
  // Add click event
  buttonContainer.addEventListener('click', toggleSidePanel);
  
  // Assemble the button
  if (sidePanelPosition === 'left') {
    buttonContainer.appendChild(button);
    buttonContainer.appendChild(label);
  } else {
    buttonContainer.appendChild(label);
    buttonContainer.appendChild(button);
  }
  
  document.body.appendChild(buttonContainer);
  
  return buttonContainer;
}

// Function to create the side panel
function createSidePanel() {
  const panel = document.createElement('iframe');
  panel.id = 'kaveri-side-panel';
  panel.src = chrome.runtime.getURL('index.html');
  panel.style.cssText = `
    position: fixed;
    top: 0;
    ${sidePanelPosition === 'left' ? 'left: 0;' : 'right: 0;'}
    width: ${sidebarWidth}px;
    height: 100%;
    border: none;
    background-color: #f3f4f6;
    box-shadow: ${sidePanelPosition === 'left' ? '2px 0 5px rgba(0, 0, 0, 0.1)' : '-2px 0 5px rgba(0, 0, 0, 0.1)'};
    transform: ${sidePanelOpen ? 'translateX(0)' : (sidePanelPosition === 'left' ? 'translateX(-100%)' : 'translateX(100%)')};
  `;
  
  document.body.appendChild(panel);
  return panel;
}

// Function to adjust main content
function adjustMainContent() {
  if (sidePanelOpen) {
    // Use CSS classes for styling
    document.body.classList.remove('kaveri-panel-open-left', 'kaveri-panel-open-right');
    document.body.classList.add(`kaveri-panel-open-${sidePanelPosition}`);
  } else {
    // Remove CSS classes when closed
    document.body.classList.remove('kaveri-panel-open-left', 'kaveri-panel-open-right');
  }
}

// Function to toggle the side panel
function toggleSidePanel() {
  sidePanelOpen = !sidePanelOpen;
  
  // Update side panel visibility
  if (sidePanel) {
    sidePanel.style.transform = sidePanelOpen ? 
      'translateX(0)' : 
      (sidePanelPosition === 'left' ? 'translateX(-100%)' : 'translateX(100%)');
  }
  
  // Update toggle button label
  const label = toggleButton.querySelector('.kaveri-side-toggle-label');
  if (label) {
    label.textContent = sidePanelOpen ? 'Hide Chatbot' : 'Open Chatbot';
  }
  
  // Adjust the main content
  adjustMainContent();
  
  // Save panel state to storage
  chrome.storage.sync.set({ sidePanelOpen });
  
  // Notify the background script about panel state
  chrome.runtime.sendMessage({
    action: sidePanelOpen ? 'openSidePanel' : 'closeSidePanel'
  });
}

// Function to initialize the side panel
function initSidePanel() {
  // Load user preferences if available
  chrome.storage.sync.get(['sidePanelPosition', 'sidePanelOpen', 'sidebarWidth'], (result) => {
    if (result.sidePanelPosition) sidePanelPosition = result.sidePanelPosition;
    if (result.sidePanelOpen !== undefined) sidePanelOpen = result.sidePanelOpen;
    if (result.sidebarWidth) sidebarWidth = result.sidebarWidth;
    
    // Create UI elements
    toggleButton = createToggleButton();
    sidePanel = createSidePanel();
    
    // Adjust content if panel is open by default
    if (sidePanelOpen) {
      adjustMainContent();
    }
  });
}

// Initialize the side panel when content script loads
let toggleButton = null;
initSidePanel();

// Listen for messages from the iframe
window.addEventListener('message', (event) => {
  // Make sure the message is from our iframe
  if (sidePanel && event.source === sidePanel.contentWindow) {
    const { action, position, width } = event.data;
    
    if (action === 'toggleSidePanel') {
      toggleSidePanel();
    } else if (action === 'changePanelPosition' && (position === 'left' || position === 'right')) {
      sidePanelPosition = position;
      
      // Update UI elements
      document.body.removeChild(toggleButton);
      document.body.removeChild(sidePanel);
      
      // Save preference
      chrome.storage.sync.set({ sidePanelPosition });
      
      // Recreate elements with new position
      toggleButton = createToggleButton();
      sidePanel = createSidePanel();
      
      // Readjust content
      adjustMainContent();
    } else if (action === 'changePanelWidth' && width) {
      sidebarWidth = width;
      
      // Update panel width
      sidePanel.style.width = `${sidebarWidth}px`;
      
      // Save preference
      chrome.storage.sync.set({ sidebarWidth });
      
      // Readjust content
      adjustMainContent();
    }
  }
}); 