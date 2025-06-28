import { createContext, useContext } from "react";
import { Events } from "./hooks/useEventTracker";
type Message =
  | {
      text: string;
      audio?: never;
    }
  | { audio: string; text?: never };

type AppContext = {
  messages: Array<{ role: string; message: Message }>;
  featureFlags: {
    langSupport: boolean;
  };
  setMessages: (
    messages: Array<{
      role: string;
      message: Message;
    }>
  ) => void;
  sessionId: string;
  trackEvent: (args: { eventName: Events; eventData: any }) => any;
  resetMessages: () => void;
};

const AppState = createContext<AppContext>({
  messages: [],
  featureFlags: {
    langSupport: false,
  },
  setMessages: () => {},
  sessionId: Math.random().toString(36).substring(2, 15),
  trackEvent: () => {},
  resetMessages: () => {},
});

const useAppState = () => {
  const context = useContext(AppState);
  if (!context) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }
  return context;
};

export { AppState, type Message, useAppState, type AppContext };
