import { useState, useRef, useEffect } from "react";
import { FeedbackContainer } from "./index";
import { VolumeX, Volume2, Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAppState } from "../../AppState";
import { useBotMessageAudioStore } from "../BotMessageAudioStore";
// const LANGUAGE_STORAGE_KEY = "kaveribot_language_preference";

export const BotMessage = ({ value }: { value: string }) => {
  const { getFromAudioStore } = useBotMessageAudioStore();
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const [audio, setAudio] = useState<string | null>(null);

  const handleSpeak = async () => {
    if (isSpeaking && audioPlayerRef.current) {
      audioPlayerRef.current?.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsSpeaking(false);
      return;
    }
    if (audio) {
      audioPlayerRef.current?.play();
      setIsSpeaking(true);
      return;
    }
    setLoadingAudio(true);
    const _audio = await getFromAudioStore(value);
    if (_audio) setAudio(_audio);
    setLoadingAudio(false);
    setTimeout(() => {
      if (_audio && audioPlayerRef.current) {
        audioPlayerRef.current.play();
        setIsSpeaking(true);
      }
    }, 500);
  };

  useEffect(() => {
    const audioElement = audioPlayerRef.current;

    const handleEnded = () => {
      setIsSpeaking(false);
    };

    const handlePause = () => {
      setIsSpeaking(false);
    };

    const handleError = (e: Event) => {
      console.error("Audio playback error:", e);
      setIsSpeaking(false);
    };

    if (audioElement) {
      audioElement.addEventListener("ended", handleEnded);
      audioElement.addEventListener("pause", handlePause);
      audioElement.addEventListener("error", handleError);
    }

    // Cleanup listeners when component unmounts
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleEnded);
        audioElement.removeEventListener("pause", handlePause);
        audioElement.removeEventListener("error", handleError);
      }
    };
  }, [audioPlayerRef]);

  const [feedbackValue, setFeedbackValue] = useState<"good" | "bad" | null>(
    null
  );
  const { trackFeedback } = useAppState();
  const handleFeedback = (value: "good" | "bad" | null) => {
    if (value === feedbackValue) return;
    setFeedbackValue(value);
    trackFeedback(value);
  };
  return (
    <div className="tw:flex-col tw:flex tw:gap-2">
      <div className="tw:text-gray-500 tw:text-xs tw:font-medium">
        Zen Citizen
      </div>
      <div className="message-text response-text tw:text-sm tw:text-gray-800 tw:bg-white tw:px-3.5 tw:py-2 tw:rounded-lg tw:text-left ">
        <div className="tw:text-left tw:mb-3!">
          <button
            onClick={handleSpeak}
            className="tw:p-1 tw:text-gray-500 tw:hover:text-gray-700 tw:cursor-pointer tw:focus:outline-none!"
            aria-label={isSpeaking ? "Stop speaking" : "Speak message"}
          >
            {loadingAudio ? (
              <Loader size={20} />
            ) : isSpeaking ? (
              <VolumeX size={20} />
            ) : (
              <Volume2 size={20} />
            )}
          </button>
        </div>
        <div className="markdown">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="tw:mb-3 tw:last:mb-0">{children}</p>
              ),
              h1: ({ children }) => (
                <h1 className="tw:text-xl tw:font-bold tw:my-3">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="tw:text-lg tw:font-bold tw:my-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="tw:text-base tw:font-bold tw:my-2">
                  {children}
                </h3>
              ),
              ul: ({ children }) => (
                <ul className="tw:list-disc tw:ml-6 tw:mb-3">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="tw:list-decimal tw:ml-6 tw:mb-3">{children}</ol>
              ),
              li: ({ children }) => <li className="tw:mb-1">{children}</li>,
              a: ({ children, href }) => (
                <a
                  className="tw:text-blue-600! hover:tw:underline!"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="tw:border-l-4 tw:border-gray-300 tw:pl-4 tw:italic tw:my-3">
                  {children}
                </blockquote>
              ),
              code: ({
                children,
                inline,
              }: {
                children?: React.ReactNode;
                inline?: boolean;
              }) => {
                return inline ? (
                  <code className="tw:bg-gray-100 tw:px-1 tw:py-0.5 tw:rounded tw:font-mono tw:text-sm">
                    {children}
                  </code>
                ) : (
                  <code className="tw:block tw:bg-gray-100 tw:p-2 tw:rounded tw:font-mono tw:text-sm tw:overflow-x-auto tw:my-3">
                    {children}
                  </code>
                );
              },
              strong: ({ children }) => (
                <strong className="tw:font-bold">{children}</strong>
              ),
              em: ({ children }) => <em className="tw:italic">{children}</em>,
              table: ({ children }) => (
                <div className="tw:overflow-x-auto tw:my-3">
                  <table className="tw:min-w-full tw:divide-y tw:divide-gray-300">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="tw:py-2 tw:px-3 tw:font-bold tw:bg-gray-100">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="tw:py-2 tw:px-3 tw:border-t">{children}</td>
              ),
            }}
          >
            {value}
          </ReactMarkdown>
          <div>
            {audio && (
              <audio
                ref={audioPlayerRef}
                src={`data:audio/mp3;base64,${audio}`}
                controls
                className="tw:hidden"
                onEnded={() => {
                  setIsSpeaking(false);
                }}
                onPause={() => {
                  setIsSpeaking(false);
                }}
                onError={() => {
                  setIsSpeaking(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <FeedbackContainer
        feedbackValue={feedbackValue}
        setFeedbackValue={handleFeedback}
      />
    </div>
  );
};
