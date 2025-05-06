import { Mic, SendHorizontal } from "lucide-react";
import { RefObject } from "react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: (message: string) => void;
  loading: boolean;
  formEvent: { error: unknown; response: unknown; loading: boolean };
  inputRef: RefObject<HTMLTextAreaElement>;
}
export const Form = ({
  message,
  sendMessage,
  setMessage,
  formEvent,
  inputRef,
}: ChatInputProps) => {
  const textValue = inputRef.current?.value.trim();
  return (
    <div className="tw:w-full tw:flex tw:flex-row tw:items-center tw:bg-white tw:h-13">
      <textarea
        ref={inputRef}
        autoFocus
        id="chat-input"
        value={message}
        onChange={(e) => setMessage(e?.target?.value)}
        className="tw:w-full tw:p-2 tw:ml-2 tw:text-sm tw:h-3/4 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:resize-none"
        placeholder="Ask a question"
        onKeyDown={(event) => {
          if (formEvent.loading) return;
          if (event?.keyCode === 13 || event.code === "Enter") {
            sendMessage(message);
            setMessage("");
            event.preventDefault();
          }
        }}
        disabled={formEvent.loading}
      ></textarea>
      <div className="chat-controls tw:flex tw:items-center tw:justify-between tw:p-2 tw:cursor-pointer">
        <Mic className={textValue ? "tw:hidden" : "tw:block"} id="mic-button" />
        <SendHorizontal
          onClick={(event) => {
            if (formEvent.loading) return;
            sendMessage(message);
            setMessage("");
            event.preventDefault();
          }}
          className={textValue ? "tw:block" : "tw:hidden"}
        />
      </div>
    </div>
  );
};
