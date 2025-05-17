import { useEffect, useState } from "react";
// import ChatButton from "./components/ChatButton";
import ChatPopup from "./components/ChatPopup";
import { AppContext, AppState } from "./AppState";
// import { PostHogProvider } from "posthog-js/react";

function App() {
  const [_, setTogglePopup] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: string; message: string }>
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
  useEffect(() => {
    if (!window?.posthog) return;
    const posthog = window.posthog;
    console.log({posthog});
    if (import.meta.env.VITE_ENV === "production") {
      posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
        api_host: import.meta.env.VITE_POSTHOG_HOST,
        disable_persistence: true,
        persistence: "memory",
      });
    }
  }, []);

  return (
    <AppState.Provider value={{ messages, setMessages, featureFlags }}>
      <div id="kaveri-bot-app" className="app-container relative! z-[10000000]">
        {/* <ChatButton togglePopup={togglePopup} setTogglePopup={setTogglePopup} /> */}
        <ChatPopup setTogglePopup={setTogglePopup} togglePopup={true} />
      </div>
    </AppState.Provider>
  );
}
export default App;
