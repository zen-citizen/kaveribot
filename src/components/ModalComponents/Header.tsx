import { ChevronDown, CircleEllipsis } from "lucide-react";

interface BodyProps {
  setTogglePopup: React.Dispatch<React.SetStateAction<boolean>>;
  togglePopup: boolean;
}

export const Header = ({ setTogglePopup, togglePopup }: BodyProps) => {
  return (
    <header className="chat-header tw:flex tw:justify-between tw:items-center tw:border-b tw:border-gray-200 tw:px-4 tw:py-3 tw:bg-black">
      <div className="header-info tw:flex tw:items-center tw:gap-3">
        <CircleEllipsis className="tw:text-white" size={30} strokeWidth={1.5} />
        <h2 className="logo-text tw:text-md tw:font-semibold tw:text-white tw:text-underline">
          Ask Zen Citizen
        </h2>
        <span className="tw:bg-gray-200 tw:px-2 tw:py-0.5 tw:rounded-sm tw:text-xs tw:text-[#003df5]">
          Beta
        </span>
      </div>
      <ChevronDown
        className="tw:text-white tw:cursor-pointer"
        onClick={() => setTogglePopup(!togglePopup)}
      />
    </header>
  );
};
