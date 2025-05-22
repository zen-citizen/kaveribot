import { useState, useRef, useEffect } from "react";
import { FeedbackContainer } from "./index";
import { VolumeX, Volume2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAppState } from "../../AppState";

const LANGUAGE_STORAGE_KEY = "kaveribot_language_preference";

export const BotMessage = ({ value }: { value: string }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);

  // Initialize and track available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    // Load voices right away (might already be available in some browsers)
    loadVoices();

    // Chrome loads voices asynchronously, so we need to listen for the voiceschanged event
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Cleanup function for speech when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthRef.current && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getSpeechLanguage = (): string => {
    // Get language from localStorage, default to 'en-IN'
    if (typeof window !== "undefined") {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en-IN";
    }
    return "en-IN";
  };

  // Find the best matching voice for a given language code
  const findBestVoice = (langCode: string): SpeechSynthesisVoice | null => {
    if (!availableVoices || availableVoices.length === 0) {
      return null;
    }

    // Try to find exact match
    const exactMatch = availableVoices.find((voice) => voice.lang === langCode);
    if (exactMatch) {
      return exactMatch;
    }

    // Try to find a voice with the same language (ignoring region)
    const langPrefix = langCode.split("-")[0].toLowerCase();
    const prefixMatch = availableVoices.find((voice) =>
      voice.lang.toLowerCase().startsWith(langPrefix + "-")
    );
    if (prefixMatch) {
      return prefixMatch;
    }

    // If all else fails and it's not English, try to at least get a voice
    // that has the correct base language
    const anyMatch = availableVoices.find((voice) =>
      voice.lang.toLowerCase().startsWith(langPrefix)
    );
    if (anyMatch) {
      return anyMatch;
    }

    // If we can't find any matching voice, return null
    // The browser will use its default voice
    return null;
  };

  const handleSpeak = () => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported in your browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(value);

    // Get language from localStorage
    const langCode = getSpeechLanguage();
    utterance.lang = langCode;

    // Try to find a voice for this language
    const voice = findBestVoice(langCode);
    if (voice) {
      utterance.voice = voice;
      console.log(
        `Using voice: ${voice.name} (${voice.lang}) for language ${langCode}`
      );
    } else {
      console.log(
        `No specific voice found for ${langCode}, using browser default`
      );
    }

    // Handle utterance events
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    // Store reference for cleanup
    speechSynthRef.current = utterance;

    // Start speaking
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };
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
      <div className="message-text response-text tw:text-sm tw:text-gray-800 tw:bg-white tw:px-5 tw:rounded-lg tw:text-left tw:py-4">
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
          <div className="tw:text-right">
            <button
              onClick={handleSpeak}
              className="tw!p-1 tw!text-gray-500 tw!hover:text-blue-600 tw!focus:outline-none!"
              aria-label={isSpeaking ? "Stop speaking" : "Speak message"}
            >
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
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
