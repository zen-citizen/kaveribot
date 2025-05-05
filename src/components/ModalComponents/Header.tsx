import { ChevronDown, CircleEllipsis } from "lucide-react";

interface BodyProps {
  apiEndpoint: string;
  setApiEndpoint: (endpoint: string) => void;
  models: { label: string; value: string; disabled?: boolean }[];
  setTogglePopup: React.Dispatch<React.SetStateAction<boolean>>;
  togglePopup: boolean;
}

export const Header = ({
  apiEndpoint,
  setApiEndpoint,
  models,
  setTogglePopup,
  togglePopup,
}: BodyProps) => {
  return (
    <header className="chat-header flex justify-between items-center border-b border-gray-200 px-4 py-3 bg-black">
      <div className="header-info flex items-center gap-3">
        <CircleEllipsis className="text-white" size={40} />
        <h2 className="logo-text text-md font-semibold text-white text-underline">
          Ask Zen Citizen
        </h2>
        <span className="bg-gray-200 border rounded-md text-[#013df5]">
          <select
            onChange={(e) => setApiEndpoint(e.target.value)}
            value={apiEndpoint}
          >
            {models.map((model) => (
              <option
                key={model.label}
                value={model.value}
                disabled={model.disabled}
                defaultValue={models?.[0].value}
                //   selected={apiEndpoint === model.value}
              >
                {model.label || model.value}
              </option>
            ))}
          </select>
        </span>
      </div>
      <ChevronDown
        className="text-white cursor-pointer"
        onClick={() => setTogglePopup(!togglePopup)}
      />
    </header>
  );
};
