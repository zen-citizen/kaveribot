import { RefObject } from "react";

import {
  ErrorMessage,
  Loader,
  DefaultMessage,
  UserMessage,
  BotMessage,
} from "./index";

interface BodyProps {
  formEvent: { errorMsg: string, error: unknown; response: unknown; loading: boolean };
  messages: RefObject<{ role: string; message: string }[]>;
  chatBodyRef: RefObject<HTMLDivElement>; // ✅ Added missing prop
}

export const Body: React.FC<BodyProps> = ({
  formEvent,
  messages,
  chatBodyRef,
}) => {
  return (
    <div
      className="tw:flex-1! tw:p-4 tw:overflow-y-auto! tw:max-h-[500px] tw:lg:max-h-[600px] tw:relative"
      ref={chatBodyRef}
    >
      <div className="message tw:bot-message tw:flex tw:flex-col tw:gap-6 tw:w-full tw:mb-3">
        <DefaultMessage />
        {messages.current.map((message, idx) => {
          return (
            <div
              key={`${message?.role}-${idx}`}
              className={`tw:${message?.role}`}
            >
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
        {formEvent.error && <ErrorMessage error={formEvent?.errorMsg} />}
      </div>
    </div>
  );
};
