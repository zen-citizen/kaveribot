import { ChevronDown, CircleEllipsis, X } from "lucide-react";

interface HeaderProps {
  setTogglePopup: React.Dispatch<React.SetStateAction<boolean>>;
  togglePopup: boolean;
}

export const Header = ({
  setTogglePopup,
  togglePopup,
}: HeaderProps) => {
  return (
    <header className="chat-header flex justify-between items-center border-b border-gray-200 px-3 py-3 bg-black sticky top-0 z-10">
      <div className="header-info flex items-center gap-2 sm:gap-3 flex-1 overflow-hidden">
        <CircleEllipsis className="text-white min-w-[30px]" size={30} strokeWidth={1.5} />
        <h2 className="logo-text text-sm sm:text-md font-semibold text-white text-underline whitespace-nowrap">
          Ask Zen Citizen
        </h2>
        <span className="bg-gray-200 border px-2 rounded-md text-[#013df5] text-xs whitespace-nowrap">Beta</span>
      </div>
      <button 
        onClick={() => setTogglePopup(!togglePopup)}
        className="ml-2 p-1 rounded-full hover:bg-gray-800 transition-colors focus:outline-none"
        aria-label="Close chat"
      >
        <X className="text-white cursor-pointer" size={20} />
      </button>
    </header>
  );
};
