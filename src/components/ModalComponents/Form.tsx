import { Mic, SendHorizontal, Camera } from "lucide-react";
import { RefObject } from "react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: (message: string) => void;
  captureScreen: () => void;
  loading: boolean;
  formEvent: { error: unknown; response: unknown; loading: boolean };
  inputRef: RefObject<HTMLTextAreaElement>;
}
export const Form = ({
  message,
  sendMessage,
  setMessage,
  captureScreen,
  formEvent,
  inputRef,
}: ChatInputProps) => {
  const textValue = inputRef.current?.value.trim();
  return (
    <div className="tw:w-full! tw:flex! tw:flex-row! tw:items-center! tw:bg-white tw:h-13 tw:px-2">
      <textarea
        ref={inputRef}
        autoFocus
        id="chat-input"
        value={message}
        onChange={(e) => setMessage(e?.target?.value)}
        className="tw:w-full tw:p-2 tw:ml-2! tw:text-sm tw:h-3/4 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#003df5]/60 tw:resize-none!"
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
      <div className="chat-controls tw:flex tw:items-center tw:justify-between tw:p-2 tw:gap-2">
        <Camera
          className="tw:block tw:text-gray-500 tw:hover:text-gray-700 tw:transition tw:cursor-pointer"
          onClick={captureScreen}
        />
        <Mic
          className={
            textValue
              ? "tw:hidden"
              : "tw:block tw:text-gray-500 tw:hover:text-gray-700 tw:transition tw:cursor-pointer"
          }
          id="mic-button"
        />
        <SendHorizontal
          onClick={(event) => {
            if (formEvent.loading) return;
            sendMessage(message);
            setMessage("");
            event.preventDefault();
          }}
          className={
            textValue
              ? "tw:block tw:text-gray-500 tw:hover:text-gray-700 tw:transition tw:cursor-pointer"
              : "tw:hidden"
          }
        />
      </div>
    </div>
  );
};
