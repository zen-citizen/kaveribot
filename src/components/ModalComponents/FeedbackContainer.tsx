import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface FeedbackContainerProps {
  messageId?: string;
}

export const FeedbackContainer = ({ messageId = Math.random().toString(36).substring(2, 9) }: FeedbackContainerProps) => {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

  const handleFeedback = (type: 'like' | 'dislike') => {
    // Toggle feedback if already selected
    if (feedback === type) {
      setFeedback(null);
    } else {
      setFeedback(type);
      
      // Here you could send the feedback to a backend or store it
      console.log(`User ${type}d message with ID: ${messageId}`);
    }
  };

  return (
    <div className="feedback-container">
      <div className="flex gap-1">
        <button
          className={`hover:bg-white hover:rounded-lg p-1 ${feedback === 'like' ? 'text-blue-600' : 'text-gray-400'}`}
          id={`thumbs-up-${messageId}`}
          onClick={() => handleFeedback('like')}
          aria-label="Like this response"
        >
          <ThumbsUp size={14} />
        </button>
        <button
          className={`hover:bg-white hover:rounded-lg p-1 ${feedback === 'dislike' ? 'text-blue-600' : 'text-gray-400'}`}
          id={`thumbs-down-${messageId}`}
          onClick={() => handleFeedback('dislike')}
          aria-label="Dislike this response"
        >
          <ThumbsDown size={14} />
        </button>
      </div>
    </div>
  );
};
