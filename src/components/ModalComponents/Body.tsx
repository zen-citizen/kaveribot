import { RefObject, useEffect } from "react";

import {
  ErrorMessage,
  Loader,
  DefaultMessage,
  UserMessage,
  BotMessage,
} from "./index";

interface BodyProps {
  formEvent: { error: unknown; response: unknown; loading: boolean };
  messages: React.MutableRefObject<{ role: string; message: string }[]>;
  chatBodyRef: RefObject<HTMLDivElement>;
}

export const Body: React.FC<BodyProps> = ({
  formEvent,
  messages,
  chatBodyRef,
}) => {
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
            <div key={`${message?.role}-${idx}`} className={message?.role}>
              {message.role === "user" && (
                <UserMessage value={message.message} />
              )}
              {message.role === "model" && (
                <BotMessage value={message.message} />
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
