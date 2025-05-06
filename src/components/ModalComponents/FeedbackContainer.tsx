import { ThumbsDown, ThumbsUp } from "lucide-react";

export const FeedbackContainer = () => {
  return (
    <div className="feedback-container">
      <div className="tw:flex tw:gap-4 tw:ml-2 tw:mt-1">
        <button
          className="tw:hover:bg-white tw:hover:rounded-2xl tw:hover:text-[#dodoe2] tw:p-1"
          id="thumbs-up-${uniqueid}"
        >
          <ThumbsUp className="tw:hover:text-blue-600" />
        </button>
        <button
          className="tw:hover:bg-white tw:hover:rounded-2xl tw:hover:text-[#dodoe2] tw:p-1"
          id="thumbs-down-${uniqueid}"
        >
          <ThumbsDown className="tw:hover:text-blue-600" />
        </button>
      </div>
    </div>
  );
};
