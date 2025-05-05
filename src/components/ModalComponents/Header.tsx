import { ChevronDown, CircleEllipsis } from "lucide-react";

interface BodyProps {
  setTogglePopup: React.Dispatch<React.SetStateAction<boolean>>;
  togglePopup: boolean;
}

export const Header = ({
  setTogglePopup,
  togglePopup,
}: BodyProps) => {
  return (
    <header className="chat-header flex justify-between items-center border-b border-gray-200 px-4 py-3 bg-black">
      <div className="header-info flex items-center gap-3">
        <CircleEllipsis className="text-white" size={40} strokeWidth={1.5} />
        <h2 className="logo-text text-md font-semibold text-white text-underline">
          Ask Zen Citizen
        </h2>
        <span className="bg-gray-200 border px-2 rounded-md text-[#013df5]">Beta</span>
      </div>
      <ChevronDown
        className="text-white cursor-pointer"
        onClick={() => setTogglePopup(!togglePopup)}
      />
    </header>
  );
};
