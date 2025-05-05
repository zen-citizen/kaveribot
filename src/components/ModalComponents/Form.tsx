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
    <div className="w-full flex flex-row items-center bg-white h-13">
      <textarea
        ref={inputRef}
        autoFocus
        id="chat-input"
        value={message}
        onChange={(e) => setMessage(e?.target?.value)}
        className="w-full p-2 ml-2 text-sm h-3/4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Ask a question..."
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
      <div className="chat-controls flex items-center justify-between p-2">
        <Mic className={textValue ? "hidden" : "block"} id="mic-button" />
        <SendHorizontal className={textValue ? "block" : "hidden"} />
      </div>
    </div>
  );
};
