import { MessageSquareMore } from "lucide-react";
import {FeedbackContainer} from "./index";


export const BotMessage = ({ value }: { value: string }) => {
  return (
    <div className="tw:flex-col tw:flex tw:gap-1">
      <div className="tw:flex-row tw:flex tw:gap-2 tw:items-center">
        <MessageSquareMore className="tw:text-blue-600" />
        <span className="tw:text-xs">Zen Citizen Bot</span>
      </div>
      <div className="message-text response-text tw:text-sm tw:text-gray-800 tw:bg-white tw:px-6 tw:rounded-lg tw:text-left tw:tracking-wide tw:pb-4 tw:pt-4 tw:leading-[22px] tw:font-normal">
        {value}
      </div>
      <FeedbackContainer />
    </div>
  );
};
