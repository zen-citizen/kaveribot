import { ThumbsDown, ThumbsUp } from "lucide-react";

export const FeedbackContainer = ({
  feedbackValue,
  setFeedbackValue,
}: {
  feedbackValue: "good" | "bad" | null;
  setFeedbackValue: (value: "good" | "bad") => void;
}) => {
  return (
    <div className="feedback-container">
      <div className="tw:flex tw:gap-2 tw:ml-2">
        <button
          className={`tw:p-1 tw:cursor-pointer  tw:transition ${feedbackValue === "good" ? "tw:text-blue-600" : "tw:text-gray-500 tw:hover:text-gray-700"}`}
          id="thumbs-up-${uniqueid}"
          onClick={() => setFeedbackValue("good")}
        >
          <ThumbsUp className="tw:w-5" />
        </button>
        <button
          className={`tw:p-1 tw:cursor-pointer  tw:transition ${feedbackValue === "bad" ? "tw:text-blue-600" : "tw:text-gray-500 tw:hover:text-gray-700"}`}
          id="thumbs-down-${uniqueid}"
          onClick={() => setFeedbackValue("bad")}
        >
          <ThumbsDown className="tw:w-5" />
        </button>
      </div>
    </div>
  );
};
