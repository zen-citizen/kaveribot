import { ChevronDown, MessageSquareText } from "lucide-react";

interface ChatButtonProps {
  setTogglePopup: React.Dispatch<React.SetStateAction<boolean>>;
  togglePopup: boolean;
}

const ChatButton = ({ togglePopup, setTogglePopup }: ChatButtonProps) => {
  const IconToggle = togglePopup ? <ChevronDown /> : <MessageSquareText />;
  return (
    <button
      id="chatbot-toggler"
      onClick={() => setTogglePopup(!togglePopup)}
      className="tw:fixed tw:bottom-4 tw:right-4 tw:bg-black! tw:text-white! tw:p-4 tw:rounded-full! tw:shadow-lg! tw:focus:outline-none! tw:cursor-pointer"
    >
      {IconToggle}
    </button>
  );
};

export default ChatButton;
