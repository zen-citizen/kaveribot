/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject } from "react";

import {
  ErrorMessage,
  Loader,
  DefaultMessage,
  UserMessage,
  BotMessage,
} from "./index";
import { Message } from "../../AppState";

interface BodyProps {
  formEvent: {
    errorMsg: string;
    error: any;
    response: any;
    loading: boolean;
  };
  messages: RefObject<{ role: string; message: Message }[]>;
}

export const Body: React.FC<BodyProps> = ({ formEvent, messages }) => {
  return (
    <div>
      <div className="message tw:bot-message tw:flex tw:flex-col tw:gap-6 tw:w-full tw:mb-3">
        <DefaultMessage />
        {messages.current.map((message, idx) => {
          return (
            <div key={`${message?.role}-${idx}`}>
              {message.role === "user" && (
                <UserMessage
                  value={message.message?.text || message.message.audio || ""}
                  type={message.message.audio ? "audio" : "text"}
                />
              )}
              {message.role === "model" && (
                <BotMessage value={message.message?.text || ""} />
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
