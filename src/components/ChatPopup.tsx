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
  const apiEndpoint = "/api/chat";

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

  return (
    <div
      className="chatbot-popup fixed bottom-20 right-4 bg-gray-100 rounded-2xl shadow-lg flex flex-col overflow-hidden max-h-[70vh] max-w-[80%] sm:max-w-[60%] md:max-w-[40%] lg:max-w-[33%] xl:max-w-[25%]"
    >
      <Header
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
