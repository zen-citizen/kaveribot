import { Mic, SendHorizontal, Camera, Upload, ChevronDown, ChevronUp } from "lucide-react";
import { RefObject } from "react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: (message: string) => void;
  captureScreen: () => void;
  loading: boolean;
  formEvent: { error: unknown; response: unknown; loading: boolean };
  inputRef: RefObject<HTMLTextAreaElement>;
  openFileSelector?: () => void;
  showCaptureDropdown?: boolean;
  setShowCaptureDropdown?: (show: boolean) => void;
}

export const Form = ({
  message,
  sendMessage,
  setMessage,
  captureScreen,
  formEvent,
  inputRef,
  openFileSelector,
  showCaptureDropdown,
  setShowCaptureDropdown,
}: ChatInputProps) => {
  const textValue = inputRef.current?.value.trim();
  
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (setShowCaptureDropdown) {
      setShowCaptureDropdown(!showCaptureDropdown);
    }
  };
  
  const handleCaptureScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (setShowCaptureDropdown) {
      setShowCaptureDropdown(false);
    }
    captureScreen();
  };
  
  const handleSelectFromDevice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (setShowCaptureDropdown && openFileSelector) {
      setShowCaptureDropdown(false);
      openFileSelector();
    }
  };
  
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
        <div className="tw:relative">
          <div 
            className="tw:flex tw:items-center tw:cursor-pointer tw:text-gray-500 tw:hover:text-gray-700"
            onClick={toggleDropdown}
          >
            <Camera className="tw:block" />
            {showCaptureDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          
          {showCaptureDropdown && (
            <div className="tw:absolute tw:bottom-full tw:left-0 tw:mb-1 tw:bg-white tw:rounded-md tw:shadow-lg tw:border tw:border-gray-200 tw:overflow-hidden tw:z-10 tw:w-40">
              <div 
                className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:hover:bg-gray-100 tw:cursor-pointer"
                onClick={handleCaptureScreen}
              >
                <Camera size={16} />
                <span className="tw:text-sm">Capture screen</span>
              </div>
              <div 
                className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:hover:bg-gray-100 tw:cursor-pointer"
                onClick={handleSelectFromDevice}
              >
                <Upload size={16} />
                <span className="tw:text-sm">Upload image</span>
              </div>
            </div>
          )}
        </div>
        
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
