import { RefObject, useEffect, useState } from "react";

import {
  ErrorMessage,
  Loader,
  DefaultMessage,
  UserMessage,
  BotMessage,
} from "./index";

interface MessageType {
  role: string;
  message: string;
  imageData?: string;
}

interface BodyProps {
  formEvent: { error: unknown; response: unknown; loading: boolean };
  messages: React.MutableRefObject<MessageType[]>;
  chatBodyRef: RefObject<HTMLDivElement>;
  onImageClick: (imageData: string) => void;
}

export const Body: React.FC<BodyProps> = ({
  formEvent,
  messages,
  chatBodyRef,
  onImageClick,
}) => {
  // Create a state that updates when messages change to trigger re-renders
  const [messagesForRender, setMessagesForRender] = useState<MessageType[]>([]);
  
  // Update the render state whenever the component re-renders
  useEffect(() => {
    // Only update if the messages have actually changed
    if (JSON.stringify(messagesForRender) !== JSON.stringify(messages.current)) {
      setMessagesForRender([...messages.current]);
      
      // Scroll to bottom when messages change
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }
  });
  
  return (
    <div
      className="tw:flex-1! tw:p-4 tw:overflow-y-auto! tw:max-h-[500px] tw:lg:max-h-[600px] tw:relative"
      ref={chatBodyRef}
    >
      <div className="message tw:bot-message tw:flex tw:flex-col tw:gap-6 tw:w-full tw:mb-3">
        {messagesForRender.length === 0 && <DefaultMessage />}
        {messagesForRender.map((message, idx) => {
          return (
            <div
              key={`${message?.role}-${idx}`}
              className={`tw:${message?.role}`}
            >
              {message.role === "user" && (
                <UserMessage 
                  value={message.message} 
                  imageData={message.imageData}
                  onImageClick={onImageClick}
                />
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
