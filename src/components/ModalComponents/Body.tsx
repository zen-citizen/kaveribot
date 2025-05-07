import { RefObject, useEffect } from "react";

import {
  ErrorMessage,
  Loader,
  DefaultMessage,
  UserMessage,
  BotMessage,
} from "./index";

interface Message {
  role: string;
  message: string;
  id?: string;
}

interface BodyProps {
  formEvent: { error: unknown; response: unknown; loading: boolean };
  messages: React.MutableRefObject<Message[]>;
  chatBodyRef: RefObject<HTMLDivElement>;
}

export const Body: React.FC<BodyProps> = ({
  formEvent,
  messages,
  chatBodyRef,
}) => {
  // Ensure messages have IDs
  useEffect(() => {
    // Add unique IDs to messages that don't have them
    messages.current.forEach(message => {
      if (!message.id) {
        message.id = Math.random().toString(36).substring(2, 9);
      }
    });
  }, [messages.current.length]);

  // Scroll to bottom whenever messages change or when loading state changes
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages.current.length, formEvent.loading]);

  return (
    <div
      className="flex-1 p-4 overflow-y-auto overflow-x-hidden"
      ref={chatBodyRef}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="message bot-message flex flex-col gap-5 w-full mb-3">
        {messages.current.length === 0 && <DefaultMessage />}
        {messages.current.map((message, idx) => {
          return (
            <div key={message.id || `${message?.role}-${idx}`} className={message?.role}>
              {message.role === "user" && (
                <UserMessage value={message.message} />
              )}
              {message.role === "model" && (
                <BotMessage value={message.message} messageId={message.id} />
              )}
            </div>
          );
        })}
        {formEvent.loading && <Loader />}
        {formEvent.error && <ErrorMessage error={formEvent?.error} />}
      </div>
    </div>
  );
};
