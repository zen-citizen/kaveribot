import { MessageSquareMore } from "lucide-react";

export const Loader = () => {
  return (
    <div className="tw:flex-col tw:flex tw:gap-1">
      <div className="tw:flex-row tw:flex tw:gap-2 tw:items-center tw:mt-5">
        <MessageSquareMore className="tw:text-blue-600" />
        <span className="tw:text-xs">Zen Citizen Bot</span>
      </div>
      <div className="thinking thinking-indicator tw:ml-[9%]">
        <p>thinking...</p>
      </div>
    </div>
  );
};
