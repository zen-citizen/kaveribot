import { useRef, useState } from "react";
import axios from "axios";

import { Body, Header, Form, Footer } from "./ModalComponents/index";

const baseURL = `https://zc-gpt.vercel.app`;

const post = async (url: string, message: string) => {
  try {
    const response = await axios.post(baseURL + url, { message });
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
  const [formEvent, setFormEvent] = useState<{
    error: unknown;
    response: unknown;
    loading: boolean;
  }>({
    error: null,
    response: null,
    loading: false,
  });
  const [apiEndpoint, setApiEndpoint] = useState("/api/chat");

  const sendMessage = async (message: string) => {
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
      error: error ? new Error(error?.toString()) : null,
      response: data,
    }));
    focusOnInput();
    if (data) {
      messages.current.push({ message: data, role: "model" });
    } else {
      setMessage(messages.current[messages.current.length - 1]?.message);
    }
  };
  const [message, setMessage] = useState("");
  const messages = useRef([]);
  const inputRef = useRef(null);

  const chatBodyRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight + 320,
      behavior: "smooth",
    });
  };

  const focusOnInput = () => {
    scrollToBottom();
    setTimeout(() => {
      inputRef?.current?.focus();
      const el = document.getElementById("chat-input");
      el?.focus();
    }, 100);
  };

  const models = [
    { label: "Gemini SDK", value: "/api/gemini" },
    { label: "Gemini API", value: "/api/chat" },
    { label: "OpenAI", value: "/api/openai", disabled: true },
  ];

  return (
    <div
      className="chatbot-popup fixed bottom-20 right-4 bg-gray-100 rounded-2xl shadow-lg flex flex-col overflow-hidden h-3/4 w-4/5 sm:w-3/5
    md:w-2/5  lg:w-4/12 xl:w-3/12 transition-all duration-300 ease-in-out opacity-100 scale-100"
    >
      <Header
        apiEndpoint={apiEndpoint}
        setApiEndpoint={setApiEndpoint}
        models={models}
        setTogglePopup={setTogglePopup}
        togglePopup={togglePopup}
      />
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
