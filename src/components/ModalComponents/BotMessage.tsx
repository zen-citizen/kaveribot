import { FeedbackContainer } from "./index";

export const BotMessage = ({ value }: { value: string }) => {
  return (
    <div className="tw:flex-col tw:flex tw:gap-2">
      <div className="tw:text-gray-500 tw:text-xs tw:font-medium">
        Zen Citizen Bot
      </div>
      <div className="message-text response-text tw:text-sm tw:text-gray-800 tw:bg-white tw:px-5 tw:rounded-lg tw:text-left tw:py-4">
        {value}
      </div>
      <FeedbackContainer />
    </div>
  );
};
