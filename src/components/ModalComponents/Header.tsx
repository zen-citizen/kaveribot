import { ChevronRight } from "lucide-react";
import KaveriLogo from "../../assets/kaveri-logo.svg?react";

interface HeaderProps {
  setTogglePopup: React.Dispatch<React.SetStateAction<boolean>>;
  togglePopup: boolean;
}

export const Header = ({ setTogglePopup, togglePopup }: HeaderProps) => {
  return (
    <header className="chat-header tw:flex! tw:justify-between! tw:items-center! tw:border-b tw:border-gray-200 tw:px-4 tw:py-3 tw:bg-[#14082d]">
      <div className="header-info tw:flex! tw:items-center! tw:gap-2 tw:sm:gap-3 tw:flex-1! tw:overflow-hidden">
        <KaveriLogo
          className="tw:text-white !min-w-[30px]"
          width={30}
          height={30}
        />
        <h2 className="logo-text tw:text-md tw:font-semibold tw:text-white tw:mb-0! tw:whitespace-nowrap">
          Kaveri Online Services
        </h2>
      </div>
      <button>
        <ChevronRight
          className="tw:ml-2 tw:p-1 tw:rounded-full tw:hover:bg-blue-800 tw:transition-colors tw:focus:outline-none tw:text-white tw:cursor-pointer"
          aria-label="Close chat"
          onClick={() => setTogglePopup(!togglePopup)}
        />
      </button>
    </header>
  );
};
