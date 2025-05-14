import { useRef, useState, useEffect } from "react";
import { Body, Header, Form, Footer } from "./ModalComponents/index";
import { useAppState } from "../AppState";

const baseURL =
  import.meta.env.VITE_ENV === "development"
    ? `http://localhost:8000`
    : `https://zc-gpt.vercel.app`;

const post = async (
  endpoint: string,
  message: string,
  onChunk?: (chunk: string) => void
) => {
  if (!message.trim()) {
    return { data: null, error: "Message cannot be empty" };
  }

  return new Promise<{ data: string | null; error: string | null }>(
    (resolve, reject) => {
      fetch(`${baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          "x-zc-key": import.meta.env.VITE_ZC_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(
                `HTTP error ${response.status}: ${
                  err.error || response.statusText
                }`
              );
            });
          }
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("Response body is not readable");
          }
          let responseText = "";
          const read = async () => {
            const { done, value } = await reader.read();
            if (done) {
              resolve({ data: responseText, error: null });
              return;
            }
            const chunk = new TextDecoder().decode(value);
            try {
              const data = JSON.parse(chunk);
              if (data.text) {
                responseText += data.text;
                if (onChunk) onChunk(data.text);
              }
              if (data.error) {
                return reject({ data: null, error: data.error });
              }
              if (data?.state === "done") {
                resolve({ data: responseText, error: null });
                return;
              }
            } catch (e) {
              console.error("Failed to parse SSE chunk:", chunk, e);
            }
            // const lines = chunk.split("\n\n");
            // for (const line of lines) {
            //   if (line.startsWith("data: ") && line !== "data: [DONE]") {
            //     try {
            //       const data = JSON.parse(line.replace("data: ", ""));
            //       if (data.text) {
            //         responseText += data.text;
            //         if (onChunk) onChunk(data.text);
            //       } else if (data.error) {
            //         reject({ data: null, error: data.error });
            //         return;
            //       }
            //     } catch (e) {
            //       console.error("Failed to parse SSE chunk:", line, e);
            //     }
            //   }
            // }
            read();
          };
          read();
        })
        .catch((error) => {
          reject({
            data: null,
            error: error.message || "Failed to connect to the server",
          });
        });
    }
  );
};

interface ChatPopupProps {
  setTogglePopup: React.Dispatch<React.SetStateAction<boolean>>;
  togglePopup: boolean;
}

const ChatPopup = ({ setTogglePopup, togglePopup }: ChatPopupProps) => {
  const { setMessages, messages: storedMessages } = useAppState();
  const [formEvent, setFormEvent] = useState<{
    error: string | null;
    response: string | null;
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
    if (!message.trim()) {
      setFormEvent((prev) => ({
        ...prev,
        error: "Message cannot be empty",
        errorMsg: "Please enter a valid message",
        loading: false,
      }));
      return;
    }

    scrollToBottom();
    setMessage("");
    messages.current.push({ role: "user", message });
    setMessages([...messages.current]);
    setFormEvent((prev) => ({
      ...prev,
      loading: true,
      error: null,
      response: null,
      errorMsg: "",
    }));

    const fullMessage = `${messages.current
      .map((m) => m.message)
      .join("\n\n")}\n\n${message}`;

    try {
      const { data, error } = await post(
        apiEndpoint,
        fullMessage,
        async (chunk) => {
          setFormEvent((prev) => ({
            ...prev,
            response: prev.response ? prev.response + chunk : chunk,
          }));
          scrollToBottom();
        }
      );

      setFormEvent((prev) => ({
        ...prev,
        loading: false,
        error: error || null,
        errorMsg: error || "",
        response: data,
      }));

      if (data) {
        messages.current.push({ message: data, role: "model" });
        setMessages([...messages.current]);
      } else {
        setMessage(
          messages.current[messages.current.length - 1]?.message || ""
        );
      }
    } catch (error) {
      setFormEvent((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
        errorMsg: error.message || "Failed to fetch response",
        response: null,
      }));
    }

    focusOnInput();
    scrollToBottom();
  };

  const [message, setMessage] = useState("");
  const messages = useRef(storedMessages);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  // Sync storedMessages to messages.current on mount/update
  useEffect(() => {
    messages.current = storedMessages;
  }, [storedMessages]);

  return (
    <div
      style={{ zIndex: 10000000 }}
      className="chatbot-popup tw:fixed tw:bottom-20 tw:right-4 tw:bg-gray-100 tw:rounded-2xl tw:shadow-lg tw:flex tw:flex-col tw:overflow-hidden tw:max-h-[70vh] tw:w-[min(calc(100vw-32px),360px)]"
    >
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
