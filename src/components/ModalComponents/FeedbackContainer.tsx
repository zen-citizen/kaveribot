import { ThumbsDown, ThumbsUp } from "lucide-react";

export const FeedbackContainer = () => {
  return (
    <div className="feedback-container">
      <div className="tw:flex tw:gap-2 tw:ml-2">
        <button
          className="tw:p-1 tw:cursor-pointer tw:text-gray-500"
          id="thumbs-up-${uniqueid}"
        >
          <ThumbsUp className="tw:hover:text-gray-700 tw:w-5 tw:transition" />
        </button>
        <button
          className="tw:p-1 tw:cursor-pointer tw:text-gray-500"
          id="thumbs-down-${uniqueid}"
        >
          <ThumbsDown className="tw:hover:text-gray-700 tw:w-5 tw:transition" />
        </button>
      </div>
    </div>
  );
};
