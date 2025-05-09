import { useRef, useState } from "react";
import axios from "axios";

import { Body, Header, Form, Footer } from "./ModalComponents/index";
import { useAppState } from "../AppState";

const baseURL = import.meta.env.VITE_ENV === "development" ? `http://localhost:8000` : `https://zc-gpt.vercel.app`;

const post = async (url: string, message: string) => {
  try {
    const response = await axios.post(
      baseURL + url,
      { message },
      {
        headers: {
          "zc-key": import.meta.env.VITE_ZC_KEY,
        },
      }
    );
    return { data: response?.data?.reply, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

interface ChatPopupProps {
  setTogglePopup: React.Dispatch<React.SetStateAction<boolean>>;
  togglePopup: boolean;
}

const ChatPopup = ({ setTogglePopup, togglePopup }: ChatPopupProps) => {
  const { setMessages, messages: storedMessages } = useAppState();
  const [formEvent, setFormEvent] = useState<{
    error: unknown;
    response: unknown;
    loading: boolean;
    errorMsg: string;
  }>({
    error: null,
    response: null,
    loading: false,
    errorMsg: "",
  });
  const apiEndpoint = "/api/chat";

  const sendMessage = async (message: string) => {
    scrollToBottom();
    setMessage("");
    messages.current.push({ role: "user", message });
    setFormEvent((prev) => ({
      ...prev,
      loading: true,
      error: null,
      response: null,
    }));
    const { data, error } = await post(
      apiEndpoint,
      `${messages.current.map((m) => m.message).join("\n\n")}\n\n${message}`
    );
    setFormEvent((prev) => ({
      ...prev,
      loading: false,
      error: error ? error : null,
      errorMsg: error ? error?.response?.data?.error || error?.message : "",
      response: data,
    }));
    focusOnInput();
    scrollToBottom();
    if (data) {
      messages.current.push({ message: data, role: "model" });
    }
    setMessages([...messages.current]);
  };
  const [message, setMessage] = useState("");
  const messages = useRef(storedMessages);
  const inputRef = useRef(null);

  const chatBodyRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // chatBodyRef.current?.scrollTo({
    //   top: chatBodyRef.current.scrollHeight + 320,
    //   behavior: "smooth",
    // });
    if (chatBodyRef.current) {
      setTimeout(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }, 10);
    }
  };

  const focusOnInput = () => {
    setTimeout(() => {
      inputRef?.current?.focus();
      const el = document.getElementById("chat-input");
      el?.focus();
    }, 100);
  };

  return (
    <div className="chatbot-popup tw:fixed tw:bottom-20 tw:right-4 tw:bg-gray-100 tw:rounded-2xl tw:shadow-lg tw:flex tw:flex-col tw:overflow-hidden tw:max-h-[70vh] tw:w-[min(calc(100vw-32px),360px)]">
      <Header setTogglePopup={setTogglePopup} togglePopup={togglePopup} />
      <Body
        chatBodyRef={chatBodyRef}
        formEvent={formEvent}
        messages={messages}
      />
      <Form
        message={message}
        sendMessage={sendMessage}
        setMessage={setMessage}
        formEvent={formEvent}
        inputRef={inputRef}
        loading={formEvent.loading}
      />
      <Footer />
    </div>
  );
};

export default ChatPopup;
