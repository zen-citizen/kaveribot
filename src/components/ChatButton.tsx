import { MessageSquareText, X } from "lucide-react";

interface ChatButtonProps {
  setTogglePopup: React.Dispatch<React.SetStateAction<boolean>>;
  togglePopup: boolean;
}

const ChatButton = ({ togglePopup, setTogglePopup }: ChatButtonProps) => {
  const IconToggle = togglePopup ? <X /> : <MessageSquareText />;
  return (
    <button
      id="chatbot-toggler"
      onClick={() => setTogglePopup(!togglePopup)}
      className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg focus:outline-none cursor-pointer"
    >
      {IconToggle}
    </button>
  );
};

export default ChatButton;
