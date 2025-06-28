/**

"Spashta" Copyright (C) 2025 Zen Citizen

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

type MessageWithRole = { role: string; message: Message };
const storageKey = "ask_spashta_messages";

function App() {
  const msgs = localStorage.getItem(storageKey) || "[]";

  const [messages, setMessages] = useState<Array<MessageWithRole>>(() => {
    try {
      return JSON.parse(msgs) as Array<MessageWithRole>;
    } catch (e: any) {
      return [];
    }
  });

  const handleSetMessages = (messages: Array<MessageWithRole>) => {
    setMessages(messages);
    localStorage.setItem(storageKey, JSON.stringify(messages));
  };

  const { trackEvent } = useEventTracker(sessionId);

  return (
    <AppState.Provider
      value={{
        messages,
        setMessages: handleSetMessages,
        featureFlags,
        sessionId,
        trackEvent,
        resetMessages: () => {
          handleSetMessages([]);
        },
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
