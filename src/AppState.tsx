import { createContext, useContext } from "react";
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
  trackFeedback: (value: "good" | "bad" | null) => void;
  trackMessageSent: () => void;
};

const AppState = createContext<AppContext>({
  messages: [],
  featureFlags: {
    langSupport: false,
  },
  setMessages: () => {},
  trackFeedback: () => {},
  trackMessageSent: () => {},
});

const useAppState = () => {
  const context = useContext(AppState);
  if (!context) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }
  return context;
};

export { AppState, type Message, useAppState, type AppContext };
