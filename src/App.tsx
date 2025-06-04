/**

"Ask Zen Citizen" Copyright (C) 2025 Zen Citizen

This program comes with ABSOLUTELY NO WARRANTY.
This is free software, and you are welcome to redistribute it
under certain conditions.
 */
import { useEffect, useState } from "react";
// import ChatButton from "./components/ChatButton";
import ChatPopup from "./components/ChatPopup";
import { AppContext, AppState, Message } from "./AppState";
import useEventTracker from "./hooks/useEventTracker";
import RecordingProvider from "./components/RecordingContext";
import { BotMessageAudioStoreProvider } from "./components/BotMessageAudioStore";
import "./assets/kaveri-logo.png";

const featureFlags: AppContext["featureFlags"] = { langSupport: false };
const sessionId = Math.random().toString(36).substring(2, 15);

function App() {

  const [messages, setMessages] = useState<
    Array<{ role: string; message: Message }>
  >([]);
  
  const { trackEvent } = useEventTracker(sessionId);
  
  return (
    <AppState.Provider
      value={{
        messages,
        setMessages,
        featureFlags,
        sessionId,
        trackEvent,
      }}
    >
      <BotMessageAudioStoreProvider>
        <RecordingProvider>
          <div
            id="kaveri-bot-app"
            className="app-container relative! z-[10000000]"
          >
            {/* <ChatButton togglePopup={togglePopup} setTogglePopup={setTogglePopup} /> */}
            <ChatPopup />
          </div>
        </RecordingProvider>
      </BotMessageAudioStoreProvider>
    </AppState.Provider>
  );
}
export default App;
