import { ChevronDown } from "lucide-react";
import ZcLogo from "../../assets/zc-logo.svg?react";

interface HeaderProps {
  setTogglePopup: React.Dispatch<React.SetStateAction<boolean>>;
  togglePopup: boolean;
}

export const Header = ({ setTogglePopup, togglePopup }: HeaderProps) => {
  return (
    <header className="chat-header tw:flex! tw:justify-between! tw:items-center! tw:border-b tw:border-gray-200 tw:px-4 tw:py-3 tw:bg-black">
      <div className="header-info tw:flex! tw:items-center! tw:gap-2 tw:sm:gap-3 tw:flex-1! tw:overflow-hidden">
        <ZcLogo
          className="tw:text-white !min-w-[30px]"
          width={30}
          strokeWidth={1.5}
        />
        <h2 className="logo-text tw:text-md tw:font-semibold tw:text-white tw:text-underline tw:mb-0! tw:whitespace-nowrap">
          Ask Zen
        </h2>
        <span className="tw:bg-gray-200 tw:px-2 tw:py-0.5 tw:rounded-sm tw:text-xs tw:text-[#003df5]">
          Beta
        </span>
      </div>
      <button>
        <ChevronDown
          className="tw:ml-2 tw:p-1 tw:rounded-full tw:hover:bg-gray-800 tw:transition-colors tw:focus:outline-none tw:text-white tw:cursor-pointer"
          aria-label="Close chat"
          onClick={() => setTogglePopup(!togglePopup)}
        />
      </button>
    </header>
  );
};
