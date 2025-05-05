import { ThumbsDown, ThumbsUp } from "lucide-react";

export const FeedbackContainer = () => {
  return (
    <div className="feedback-container">
      <div className="flex gap-4 ml-2 mt-1">
        <button
          className="hover:bg-white hover:rounded-2xl hover:text-[#dodoe2] p-1"
          id="thumbs-up-${uniqueid}"
        >
          <ThumbsUp className="hover:text-blue-600" />
        </button>
        <button
          className="hover:bg-white hover:rounded-2xl hover:text-[#dodoe2] p-1"
          id="thumbs-down-${uniqueid}"
        >
          <ThumbsDown className="hover:text-blue-600" />
        </button>
      </div>
    </div>
  );
};
