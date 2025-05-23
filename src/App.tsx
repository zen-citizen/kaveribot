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
import usePostHog from "./hooks/usePosthog";
import RecordingProvider from "./components/RecordingContext";
import { BotMessageAudioStoreProvider } from "./components/BotMessageAudioStore";
import "./assets/kaveri-logo.png";
// import { PostHogProvider } from "posthog-js/react";

function App() {
  const [messages, setMessages] = useState<
    Array<{ role: string; message: Message }>
  >([]);
  const featureFlags: AppContext["featureFlags"] = { langSupport: false };

  // useEffect(() => {
  //   // Add or remove class from html element to shift content
  //   const htmlElement = document.documentElement;
  //   if (togglePopup) {
  //     htmlElement.classList.add('kaveri-bot-active');
  //   } else {
  //     htmlElement.classList.remove('kaveri-bot-active');
  //   }
  // }, [togglePopup]);
  // useEffect(() => {
  //   if (!window?.posthog) return;
  //   const posthog = window.posthog;
  //   console.log({ posthog });
  //   if (import.meta.env.VITE_ENV === "production") {
  //     posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  //       api_host: import.meta.env.VITE_POSTHOG_HOST,
  //       disable_persistence: true,
  //       persistence: "memory",
  //     });
  //   }
  // }, []);
  const { trackFeedback, trackMessageSent } = usePostHog();
  const trackFeedback_ = (value: "good" | "bad" | null) => {
    trackFeedback(value, { messages: messages.slice(-2) });
  };
  return (
    <AppState.Provider
      value={{
        messages,
        setMessages,
        featureFlags,
        trackFeedback: trackFeedback_,
        trackMessageSent,
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
