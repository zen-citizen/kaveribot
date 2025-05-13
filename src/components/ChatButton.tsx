import { ChevronRight, MessageSquareText } from "lucide-react";

interface ChatButtonProps {
  setTogglePopup: React.Dispatch<React.SetStateAction<boolean>>;
  togglePopup: boolean;
}

const ChatButton = ({ togglePopup, setTogglePopup }: ChatButtonProps) => {
  const IconToggle = togglePopup ? <ChevronRight /> : <MessageSquareText />;
  
  return (
    <button
      id="chatbot-toggler"
      onClick={() => setTogglePopup(!togglePopup)}
      className="tw:fixed tw:bottom-4 tw:right-4 tw:bg-black! tw:text-white! tw:p-4 tw:rounded-full! tw:shadow-lg! tw:focus:outline-none! tw:cursor-pointer tw:z-[10000001]"
    >
      {IconToggle}
    </button>
  );
};

export default ChatButton;
