import { useState } from "react";
import ChatButton from "./components/ChatButton";
import ChatPopup from "./components/ChatPopup";
import { AppContext, AppState } from "./AppState";


function App() {
  const [togglePopup, setTogglePopup] = useState(true);
  const [messages, setMessages] = useState<Array<{ role: string; message: string }>>([]);
  const featureFlags: AppContext["featureFlags"] = { langSupport: false }
  return (
    <AppState.Provider value={{ messages, setMessages, featureFlags }}>
      <div id="kaveri-bot-app" className="app-container relative! z-[10000000]">
        <ChatButton togglePopup={togglePopup} setTogglePopup={setTogglePopup} />
        {togglePopup && <ChatPopup setTogglePopup={setTogglePopup} togglePopup={togglePopup}/>}
      </div>
    </AppState.Provider>
  );
}
export default App;
