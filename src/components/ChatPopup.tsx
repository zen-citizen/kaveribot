import { useRef, useState } from "react";
import axios from "axios";
import ZcLogo from "../assets/zc-logo.svg?react";

import { Body, Form, Footer } from "./ModalComponents/index";
import { useAppState } from "../AppState";
import ImageResizer from "./ImageResizer";

const baseURL =
  import.meta.env.VITE_ENV === "development"
    ? `http://localhost:8000`
    : `https://zc-gpt.vercel.app`;

const post = async (url: string, message: string) => {
  try {
    const response = await axios.post(
      baseURL + url,
      { message },
      {
        headers: {
          "x-zc-key": import.meta.env.VITE_ZC_KEY,
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
  const [activeTab, setActiveTab] = useState<"chat" | "imageResizer">("chat");
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
    <div
      style={{
        zIndex: 10000000,
        transform: togglePopup ? "translateX(0)" : "translateX(100%)",
        height: "100%",
      }}
      className="chatbot-sidepanel tw:fixed tw:top-0 tw:right-0 tw:bg-gray-100 tw:shadow-lg tw:flex tw:flex-col tw:overflow-hidden tw:transform tw:transition-transform"
    >
      {/* Tab Navigation */}
      <div className="tw:flex tw:pb-2">
        <button
          className={`tw:border-b-3 tw:flex-1 tw:py-2 tw:text-center tw:font-medium tw:cursor-pointer ${
            activeTab === "chat"
              ? "tw:border-zinc-700"
              : "tw:border-transparent tw:text-gray-500"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
        <button
          className={`tw:border-b-3 tw:flex-1 tw:py-3 tw:text-center tw:font-medium tw:cursor-pointer ${
            activeTab === "imageResizer"
              ? "tw:border-zinc-700"
              : "tw:border-transparent tw:text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("imageResizer");
          }}
        >
          Image Resizer
        </button>
      </div>
      <>
        {/* Chat Header */}
        <div className="tw:bg-zinc-700 tw:px-4 tw:py-3 tw:flex tw:items-center tw:gap-3">
          <div className="tw:flex tw:items-center tw:gap-x-2">
            <ZcLogo
              className="tw:text-white tw:min-w-[30px]!"
              width={30}
              strokeWidth={1.5}
            />
            <h2 className="tw:text-md tw:font-semibold tw:text-white tw:mb-0 tw:whitespace-nowrap">
              {activeTab === "chat" ? "Ask Zen Citizen" : "Image Resizer"}
            </h2>
          </div>
          {activeTab === "chat" && (
            <span className="tw:px-2 tw:py-0.5 tw:rounded-sm tw:text-sm tw:text-zinc-700 tw:bg-white">
              Beta
            </span>
          )}
        </div>

        {activeTab === "chat" && (
          <div className="tw:flex tw:flex-col tw:flex-1 tw:justify-between">
            <Body
              chatBodyRef={chatBodyRef}
              formEvent={formEvent}
              messages={messages}
            />
            <div>
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
          </div>
        )}
        {activeTab === "imageResizer" && <ImageResizer />}
      </>
    </div>
  );
};

export default ChatPopup;
