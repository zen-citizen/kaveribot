/* eslint-disable @typescript-eslint/no-explicit-any */
import { CircleStop, Mic, SendHorizontal, Trash, Trash2 } from "lucide-react";
import { RefObject, useEffect, useRef } from "react";
import { useRecordingContext } from "../RecordingContext";
import { Message } from "../../AppState";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: (message: Message) => void;
  loading: boolean;
  formEvent: { error: any; response: any; loading: boolean };
  inputRef: RefObject<HTMLTextAreaElement | null>;
}
export const Form = ({
  message,
  sendMessage,
  setMessage,
  formEvent,
  inputRef,
}: ChatInputProps) => {
  const isLongMessage = message.length > 40;
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioUrl,
    audioBase64,
    clearAudio,
  } = useRecordingContext();

  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height =
        textarea.scrollHeight <= 64 ? `44px` : `${textarea.scrollHeight}px`;
      textarea.style.overflowY = "auto";
      textarea.style.maxHeight = "200px";
    }
  }, [message, inputRef]);

  return (
    <form
      className="chat-input tw:sticky tw:bottom-0 tw:border-t tw:border-gray-200 tw:p-2 tw:bg-white"
      onSubmit={(e) => {
        e.preventDefault();
        if (!message?.trim() && !audioBase64) return;
        sendMessage(
          audioBase64 ? { audio: audioBase64 } : { text: message || "" }
        );
        setMessage("");
        clearAudio();
      }}
    >
      {/* {audioUrl && !isRecording && (
        <div className="recording-indicator tw:flex! tw:items-center! tw:gap-2 tw:mb-2 tw:p-2 tw:bg-red-50 tw:border tw:border-red-200 tw:rounded-md">
          <span className="tw:text-green-500 tw:font-medium tw:text-sm">✓</span>
          <span className="tw:text-green-500 tw:font-medium tw:text-sm">
            Recorded.
          </span>
        </div>
      )} */}
      {/* {isRecording && (
        <div className="recording-indicator tw:flex! tw:items-center! tw:gap-2 tw:mb-2 tw:p-2 tw:bg-red-50 tw:border tw:border-red-200 tw:rounded-md">
          <div className="tw:flex-shrink-0! tw:h-3 tw:w-3 tw:bg-red-500 tw:rounded-full tw:animate-pulse"></div>
          <span className="tw:text-red-500 tw:font-medium tw:text-sm">
            Recording...
          </span>
        </div>
      )} */}

      <div
        className={`tw:flex! tw:justify-between tw:gap-x-2 ${
          isLongMessage ? `tw:items-end!` : `tw:items-center!`
        } tw:relative`}
      >
        <div className="tw:w-full">
          <div className="tw:block">
            {!isRecording && audioUrl ? (
              <>
                <audio
                  className="tw:w-full"
                  src={audioUrl || undefined}
                  controls
                />
              </>
            ) : !audioUrl && isRecording ? (
              <>
                <div className="recording-indicator tw:flex! tw:items-center! tw:gap-2 tw:p-2 tw:bg-[#003df5]/10 tw:border tw:border-[#003df5]/20 tw:rounded-md">
                  <div className="tw:flex-shrink-0! tw:h-3 tw:w-3 tw:bg-[#003df5] tw:rounded-full tw:animate-pulse"></div>
                  <span className="tw:text-[#003df5] tw:font-medium tw:text-sm">
                    Recording...
                  </span>
                </div>
              </>
            ) : (
              <textarea
                id="chat-input"
                className="tw:w-full tw:text-gray-800! tw:text-sm! tw:flex-1! tw:p-3 tw:pr-12 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none! tw:focus:ring-2 tw:focus:ring-[#003df5]/60 tw:max-h-64 tw:resize-none!"
                placeholder={
                  isRecording ? "Listening..." : "Type your message here..."
                }
                value={isRecording ? undefined : message}
                onChange={(e) => !isRecording && setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isRecording) {
                    e.preventDefault();
                    if (message.trim() && !formEvent.loading) {
                      sendMessage({ text: message });
                    }
                  }
                }}
                ref={inputRef}
                disabled={isRecording}
              />
            )}
          </div>
        </div>

        <div className="tw:flex! tw:gap-2">
          {!isRecording && audioUrl && (
            <>
              <button
                type="button"
                className={`tw:p-2 tw:cursor-pointer tw:text-gray-500 tw:hover:text-gray-700 tw:transition`}
                onClick={() => clearAudio()}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          {(isRecording || !message) && (
            <button
              type="button"
              className={`tw:p-2 ${
                isRecording
                  ? "tw:cursor-pointer"
                  : "tw:cursor-pointer tw:text-gray-500 tw:hover:text-gray-700 tw:transition"
              } tw:focus:outline-none!`}
              onClick={() => {
                if (isRecording) {
                  stopRecording();
                  return;
                } else {
                  startRecording();
                  return;
                }
              }}
              disabled={formEvent.loading}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? <CircleStop size={20} /> : <Mic size={18} />}
            </button>
          )}
          {(message?.trim()?.length > 0 || audioUrl) && (
            <button
              type="submit"
              className={`tw:p-2 ${
                (message.trim() || !isRecording) && !formEvent.loading
                  ? "tw:cursor-pointer tw:text-gray-500 tw:hover:text-gray-700 tw:transition"
                  : "tw:text-gray-300"
              } tw:focus:outline-none!`}
              disabled={
                (!message.trim() && !audioBase64) ||
                formEvent.loading ||
                isRecording
              }
              aria-label="Send message"
            >
              <SendHorizontal size={18} />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
