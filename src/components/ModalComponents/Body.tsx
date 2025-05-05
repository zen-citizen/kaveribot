import { RefObject } from "react";

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
  chatBodyRef: RefObject<HTMLDivElement>; // ✅ Added missing prop
}

export const Body: React.FC<BodyProps> = ({
  formEvent,
  messages,
  chatBodyRef,
}) => {
  return (
    <div
      className="flex-1 p-4 overflow-y-auto max-h-[500px] lg:max-h-[600px] relative"
      ref={chatBodyRef}
    >
      <div className="message bot-message flex flex-col gap-5 w-full mb-3">
        <DefaultMessage />
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
