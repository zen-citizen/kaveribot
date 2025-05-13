import { useState, useEffect } from "react";
import ChatButton from "./components/ChatButton";
import ChatPopup from "./components/ChatPopup";
import { AppContext, AppState } from "./AppState";


function App() {
  const [togglePopup, setTogglePopup] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; message: string }>>([]);
  const featureFlags: AppContext["featureFlags"] = { langSupport: false }
  
  useEffect(() => {
    // Add or remove class from html element to shift content
    const htmlElement = document.documentElement;
    if (togglePopup) {
      htmlElement.classList.add('kaveri-bot-active');
    } else {
      htmlElement.classList.remove('kaveri-bot-active');
    }
  }, [togglePopup]);
  
  return (
    <AppState.Provider value={{ messages, setMessages, featureFlags }}>
      <div id="kaveri-bot-app" className="app-container relative! z-[10000000]">
        <ChatButton togglePopup={togglePopup} setTogglePopup={setTogglePopup} />
        <ChatPopup setTogglePopup={setTogglePopup} togglePopup={togglePopup}/>
      </div>
    </AppState.Provider>
  );
}
export default App;
