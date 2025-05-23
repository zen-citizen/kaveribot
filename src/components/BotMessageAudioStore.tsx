import axios from "axios";
import { createContext, useContext, useState } from "react"
import { baseURL } from "../constants";

const BotMessageAudioStoreContext = createContext<{
  addToAudioStore: (text: string, audio: string) => void;
  getFromAudioStore: (text: string) => Promise<string | null>;
}>({
  addToAudioStore: () => {},
  getFromAudioStore: () => Promise.resolve(null),
});

const doTTS = async (text: string) => {
  try {
    const response = await axios.post(`${baseURL}/api/tts`, { text }, {
      headers: {
        "x-zc-key": import.meta.env.VITE_ZC_KEY,
      }
    });
    return { data: response?.data?.audio, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

const BotMessageAudioStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [audioStore, setAudioStore] = useState(new Map<string, string>());

  const addToAudioStore = (text: string, audio: string) => {
    const hash = text
    setAudioStore(audioStore => audioStore.set(hash, audio));
  }

  const getFromAudioStore = async (text: string) => {
    const hash = text;
    if (!audioStore.has(hash)) {
      const { data: audio, error } = await doTTS(text);
      if (error) {
        return null;
      }
      setAudioStore(audioStore => audioStore.set(hash, audio));
      return audio as string;
    }
    return audioStore.get(hash) || null;
  }
  
  return (
    <BotMessageAudioStoreContext.Provider value={{addToAudioStore, getFromAudioStore}}>
      {children}
    </BotMessageAudioStoreContext.Provider>
  )
}

const useBotMessageAudioStore = () => {
  const context = useContext(BotMessageAudioStoreContext);
  if (!context) {
    throw new Error("useBotMessageAudioStore must be used within a BotMessageAudioStoreProvider");
  }
  return context;
}

export { BotMessageAudioStoreProvider, useBotMessageAudioStore };