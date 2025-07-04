/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ZcLogo from "../assets/zc-logo.svg?react";

import { Body, Form, Footer } from "./ModalComponents/index";
import { Message, useAppState } from "../AppState";
import ImageResizer from "./ImageResizer";
import { baseURL } from "../constants";
import { FormEvent } from "../types";
import { Events } from "../hooks/useEventTracker";
import { RotateCw } from "lucide-react";

const post = async (
  url: string,
  messages: { role: string; message: Message }[],
  abortController: AbortController
) => {
  try {
    const response = await axios.post(
      baseURL + url,
      {
        contents: messages?.map((m) => ({
          role: m.role,
          parts: [
            {
              ...(m.message.text && { text: m.message.text }),
              ...(m.message.audio && {
                inlineData: {
                  mimeType: "audio/webm",
                  data: m.message.audio,
                },
              }),
            },
          ],
        })),
      },
      {
        headers: {
          "x-zc-key": import.meta.env.VITE_ZC_KEY,
        },
        signal: abortController.signal,
      }
    );
    return { data: response?.data?.reply, error: null };
  } catch (e: any) {
    if (e.code === "ERR_CANCELED") {
      return { data: null, error: new Error("Request cancelled.") };
    }
    return { data: null, error: e };
  }
};

const ChatPopup = () => {
  const {
    setMessages,
    messages: storedMessages,
    resetMessages,
  } = useAppState();
  const [formEvent, setFormEvent] = useState<FormEvent>({
    error: null,
    response: null,
    loading: false,
    errorMsg: "",
    abortRequest: () => void 0,
  });
  const [activeTab, setActiveTab] = useState<"chat" | "imageResizer">("chat");
  const apiEndpoint = "/api/chat2";
  const { trackEvent } = useAppState();

  const sendMessage = async (message: Message) => {
    scrollToBottom();
    setMessage("");
    messages.current.push({ role: "user", message });
    const abortController = new AbortController();
    setFormEvent((prev) => ({
      ...prev,
      loading: true,
      error: null,
      response: null,
      abortRequest: () => abortController.abort(),
    }));

    if (message.text) {
      trackEvent({
        eventName: Events.messageSent,
        eventData: { message: message.text },
      });
    }
    const { data, error } = await post(
      apiEndpoint,
      messages.current,
      abortController
    );
    setFormEvent((prev) => ({
      ...prev,
      loading: false,
      error: error ? error : null,
      errorMsg: error
        ? error?.response?.data?.error?.toString() || error?.message
        : "",
      response: data,
    }));
    if (!error) {
      trackEvent({
        eventName: Events.messageReceived,
        eventData: { message: data },
      });
    }
    focusOnInput();
    scrollToBottom();
    if (data) {
      messages.current.push({ message: { text: data }, role: "model" });
    }
    setMessages([...messages.current]);
  };
  const [message, setMessage] = useState("");
  const messages = useRef(storedMessages);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const chatBodyRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      setTimeout(() => {
        const userMsgDivs = Array.from(
          document.querySelectorAll(".user-message")
        );
        if (!userMsgDivs.length) return;
        const lastUserMsgDiv = userMsgDivs[userMsgDivs.length - 1];
        if (!lastUserMsgDiv) return;
        // @ts-expect-error ts thinks chatBodyRef.current is null
        chatBodyRef.current.scrollTop =
          // @ts-expect-error offsetTop is not defined on the element
          lastUserMsgDiv.offsetTop;
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
    <div className="chatbot-sidepanel tw:bg-gray-100 tw:flex tw:flex-col tw:h-screen tw:overflow-hidden">
      {/* First child - Header */}
      <div className="tw:bg-neutral-600 tw:px-4 tw:py-3 tw:flex tw:items-center tw:justify-between tw:gap-3">
        <div className="tw:flex tw:items-center tw:gap-x-3">
          <div className="tw:flex tw:items-center tw:gap-x-2">
            <ZcLogo
              className="tw:text-white tw:min-w-[30px]!"
              width={30}
              strokeWidth={1.5}
            />
            <h2 className="tw:text-md tw:font-semibold tw:text-white tw:mb-0 tw:whitespace-nowrap">
              Ask Spashta
            </h2>
          </div>
          <span className="tw:px-2 tw:py-0.5 tw:rounded-sm tw:text-sm tw:text-zinc-700 tw:bg-white">
            Beta
          </span>
        </div>
        {!!storedMessages?.length && activeTab === "chat" && (
          <span title="Reset chat">
            <RotateCw
              onClick={() => {
                resetMessages();
                messages.current = [];
              }}
              className="tw:text-white tw:cursor-pointer"
              size={16}
            />
          </span>
        )}
      </div>

      {/* Second child - Tabs */}
      <div className="tw:flex">
        <button
          className={`tw:flex-1 tw:py-1.75 tw:text-center tw:font-medium tw:cursor-pointer ${
            activeTab === "chat"
              ? "tw:font-semibold tw:underline tw:underline-offset-5 tw:decoration-3"
              : "tw:bg-neutral-200 tw:text-gray-500"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
        <button
          className={`tw:flex-1 tw:py-1.75 tw:text-center tw:font-medium tw:cursor-pointer ${
            activeTab === "imageResizer"
              ? "tw:font-semibold tw:underline tw:underline-offset-5 tw:decoration-3"
              : "tw:bg-neutral-200 tw:text-gray-500"
          }`}
          onClick={() => setActiveTab("imageResizer")}
        >
          Image Resizer
        </button>
      </div>

      {/* Third child - Main content container */}
      {activeTab === "chat" && (
        <div className="tw:flex-1 tw:flex tw:flex-col tw:overflow-hidden">
          <div
            ref={chatBodyRef}
            className="tw:flex-1 tw:overflow-y-auto tw:p-4"
          >
            <Body formEvent={formEvent} messages={messages.current} />
          </div>
          <div className="tw:flex-none">
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
      {activeTab === "imageResizer" && (
        <div className="tw:flex-1 tw:overflow-y-auto">
          <ImageResizer />
        </div>
      )}
    </div>
  );
};

export default ChatPopup;
