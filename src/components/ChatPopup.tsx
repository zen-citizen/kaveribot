import { useRef, useState } from "react";
import axios from "axios";
import { ChevronRight } from "lucide-react";

import { Body, Form, Footer } from "./ModalComponents/index";
import { useAppState } from "../AppState";
import ImageResizer from "./ImageResizer";

const baseURL = import.meta.env.VITE_ENV === "development" ? `http://localhost:8000` : `https://zc-gpt.vercel.app`;

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
  const [activeTab, setActiveTab] = useState<'chat' | 'imageResizer'>('chat');
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

  const panelWidth = 'min(calc(100vw - 32px), 360px)';

  return (
    <div 
      style={{ 
        zIndex: 10000000,
        transform: togglePopup ? 'translateX(0)' : 'translateX(100%)',
        width: panelWidth,
        height: '100%'
      }} 
      className="chatbot-sidepanel tw:fixed tw:top-0 tw:right-0 tw:bg-gray-100 tw:shadow-lg tw:flex tw:flex-col tw:overflow-hidden tw:transform tw:transition-transform"
    >
      {/* Close button in the top right */}
      <div className="tw:absolute tw:top-3 tw:right-3 tw:z-50">
        <button 
          onClick={() => setTogglePopup(false)}
          className="tw:text-gray-500 hover:tw:text-gray-700 tw:bg-transparent tw:cursor-pointer"
        >
          <ChevronRight className="tw:w-6 tw:h-6" />
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="tw:flex tw:border-b tw:border-gray-300">
        <button 
          className={`tw:flex-1 tw:py-2 tw:text-center tw:font-medium tw:cursor-pointer ${
            activeTab === 'chat' 
              ? 'tw:border-t-3 tw:border-blue-600' 
              : 'tw:text-gray-500'
          }`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button 
          className={`tw:flex-1 tw:py-3 tw:text-center tw:font-medium tw:cursor-pointer ${
            activeTab === 'imageResizer' 
              ? 'tw:border-t-3 tw:border-blue-600' 
              : 'tw:text-gray-500'
          }`}
          onClick={() => setActiveTab('imageResizer')}
        >
          Image Resizer
        </button>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'chat' ? (
        <>
          {/* Chat Header */}
          <div className="tw:bg-black tw:px-4 tw:py-3 tw:flex tw:items-center tw:gap-3">
            <div className="tw:flex tw:items-center">
              <img 
                src="./src/assets/zc-logo.svg" 
                alt="Zen Citizen"
                className="tw:w-8 tw:h-8 tw:rounded-full tw:mr-2"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzE0MDgyZCIvPjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+WjwvdGV4dD48L3N2Zz4=";
                }}
              />
              <h2 className="tw:text-md tw:font-semibold tw:text-white tw:mb-0 tw:whitespace-nowrap">
                Ask Zen Citizen
              </h2>
            </div>
            <span className="tw:px-2 tw:py-0.5 tw:rounded-sm tw:text-sm tw:text-blue-500 tw:bg-white">
              Beta
            </span>
          </div>
        
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
        </>
      ) : (
        <ImageResizer />
      )}
    </div>
  );
};

export default ChatPopup;
