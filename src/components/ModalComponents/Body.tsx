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
import { CircleStop, X } from "lucide-react";
import { FormEvent } from "../../types";

interface BodyProps {
  formEvent: FormEvent;
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
        {formEvent.loading && (
          <div className="tw:flex tw:gap-2 tw:items-center">
            <Loader />
            <span
              className="show-with-delay"
              title="Stop"
              onClick={() => {
                formEvent.abortRequest();
              }}
            >
              <CircleStop className="tw:cursor-pointer" size={16} />
            </span>
          </div>
        )}
        {formEvent.error && <ErrorMessage error={formEvent?.errorMsg} />}
      </div>
    </div>
  );
};
