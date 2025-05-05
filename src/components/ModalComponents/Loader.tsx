import { MessageSquareMore } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex-col flex gap-1">
      <div className="flex-row flex gap-2 items-center mt-5">
        <MessageSquareMore className="text-blue-600" />
        <span className="text-xs">Zen Citizen Bot</span>
      </div>
      <div className="thinking thinking-indicator ml-[9%]">
        <p>thinking...</p>
      </div>
    </div>
  );
};
