import { Mic, MicOff, SendHorizontal, Globe } from "lucide-react";
import { RefObject, useState, useEffect, useRef } from "react";

const LANGUAGES = [
  { code: "en-IN", name: "English (India)", label: "EN" },
  // { code: "hi-IN", name: "Hindi" },
  { code: "kn-IN", name: "Kannada", label: "ಕ" },
  // { code: "bn-IN", name: "Bengali" },
  // { code: "ta-IN", name: "Tamil" },
  // { code: "te-IN", name: "Telugu" },
  // { code: "ml-IN", name: "Malayalam" },
  // { code: "mr-IN", name: "Marathi" },
  // { code: "ur-IN", name: "Urdu" },
  // { code: "gu-IN", name: "Gujarati" },
  // { code: "pa-IN", name: "Punjabi" },
  // { code: "or-IN", name: "Odia" },
  // { code: "as-IN", name: "Assamese" },
  // // Other international languages
  // { code: "en-US", name: "English (US)" },
  // { code: "zh-CN", name: "Chinese" },
  // { code: "ja-JP", name: "Japanese" },
  // { code: "ar-SA", name: "Arabic" }
];

// Local storage key for saving language preference
const LANGUAGE_STORAGE_KEY = "kaveribot_language_preference";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: (message: string) => void;
  loading: boolean;
  formEvent: { error: unknown; response: unknown; loading: boolean };
  inputRef: RefObject<HTMLTextAreaElement>;
}
export const Form = ({
  message,
  sendMessage,
  setMessage,
  formEvent,
  inputRef
}: ChatInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  // Load language from localStorage, default to 'en-IN' if not found
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return savedLanguage || "en-IN";
    }
    return "en-IN";
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initialize speech recognition on mount
  useEffect(() => {
    initializeSpeechRecognition();
  }, [selectedLanguage]);

  const initializeSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      // Configure recognition
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = selectedLanguage;

      recognitionInstance.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        setTranscript(currentTranscript);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
        setRecordingTime(0);
        playAudioFeedback("stop");
      };

      recognitionInstance.onend = () => {
        console.log("Recognition ended");
        setIsRecording(false);
        setRecordingTime(0);
        if (transcript) {
          setMessage(transcript);
        }
        playAudioFeedback("stop");
      };

      recognitionRef.current = recognitionInstance;
      setIsSpeechSupported(true);
    } else {
      setIsSpeechSupported(false);
    }
  };

  // Cleanup function for recognition
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          if (isRecording) {
            recognitionRef.current.stop();
          }
        } catch (e) {
          console.error("Error stopping recognition during cleanup:", e);
        }
      }
    };
  }, [isRecording]);

  // Recording timer
  useEffect(() => {
    let interval: number | undefined;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isRecording]);

  // Update message when transcript changes and recording is done
  useEffect(() => {
    if (!isRecording && transcript) {
      setMessage(transcript);
      setTranscript(""); // Clear transcript after setting the message
    }
  }, [isRecording, transcript, setMessage]);

  const playAudioFeedback = (type: "start" | "stop") => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === "start") {
        oscillator.frequency.value = 880; // A5
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
        }, 200);
      } else {
        oscillator.frequency.value = 440; // A4
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
        }, 200);
      }
    } catch (error) {
      console.error("Audio feedback error:", error);
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    try {
      setMessage(""); // Clear message when starting new recording
      setTranscript(""); // Clear transcript when starting new recording

      // Make sure language is set correctly before starting
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();

      setIsRecording(true);
      playAudioFeedback("start");
      console.log("Recording started in language:", selectedLanguage);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Error starting speech recognition. Please try again.");
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) {
      console.error("Recognition reference is null");
      return;
    }

    try {
      console.log("Attempting to stop recording");
      recognitionRef.current.stop();
      console.log("Recording stopped");
    } catch (error) {
      console.error("Error stopping recording:", error);
      // Force state update even if there's an error stopping
      setIsRecording(false);
      setRecordingTime(0);
      if (transcript) {
        setMessage(transcript);
      }
    }
  };

  const toggleRecording = () => {
    if (!isSpeechSupported) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    // Save to localStorage when language changes
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
    }
    setShowLanguageDropdown(false);
  };

  const getSelectedLanguageName = () => {
    return (
      LANGUAGES.find((lang) => lang.code === selectedLanguage)?.name ||
      "English (India)"
    );
  };
  return (
    <form
      className="chat-input tw:sticky tw:bottom-0 tw:border-t tw:border-gray-200 tw:p-2 tw:bg-white"
      onSubmit={(e) => {
        e.preventDefault();
        if (
          (message.trim() || (isRecording && transcript.trim())) &&
          !formEvent.loading
        ) {
          if (isRecording) {
            stopRecording();
            // Small delay to ensure transcript is processed
            setTimeout(() => {
              sendMessage(transcript || message);
            }, 100);
          } else {
            sendMessage(message);
          }
        }
      }}
    >
      {isRecording && (
        <div className="recording-indicator tw:flex! tw:items-center! tw:gap-2 tw:mb-2 tw:p-2 tw:bg-red-50 tw:border tw:border-red-200 tw:rounded-md">
          <div className="tw:flex-shrink-0! tw:h-3 tw:w-3 tw:bg-red-500 tw:rounded-full tw:animate-pulse"></div>
          <span className="tw:text-red-500 tw:font-medium tw:text-sm">
            Recording: {formatTime(recordingTime)} in{" "}
            {getSelectedLanguageName()}
          </span>
        </div>
      )}

      <div className="tw:flex! tw:items-end! tw:relative">
        <textarea
          id="chat-input"
          className="tw:flex-1! tw:p-3 tw:pr-12 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none! tw:focus:ring-2 tw:focus:ring-blue-500 tw:max-h-32 tw:resize-none!"
          placeholder={
            isRecording ? "Listening..." : "Type your message here..."
          }
          value={isRecording ? transcript : message}
          onChange={(e) => !isRecording && setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isRecording) {
              e.preventDefault();
              if (message.trim() && !formEvent.loading) {
                sendMessage(message);
              }
            }
          }}
          ref={inputRef}
          disabled={isRecording}
        />

        <div className="tw:absolute tw:right-2 tw:bottom-2 tw:flex tw:gap-2">
          {isSpeechSupported && (
            <div className="tw:relative" ref={dropdownRef}>
              <button
                type="button"
                className="tw:p-2 tw:text-gray-500 hover:tw:text-blue-500 tw:focus:outline-none! tw:flex tw:items-center"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                aria-label="Select language"
              >
                <Globe size={18} />
                <span className="tw:text-xs tw:ml-1">
                  {LANGUAGES?.find(lang => lang.code === selectedLanguage)?.label || "EN"}
                </span>
              </button>

              {showLanguageDropdown && (
                <div className="tw:absolute tw:bottom-full tw:right-0 tw:mb-2 tw:bg-white tw:border tw:border-gray-200 tw:rounded-md tw:shadow-lg tw:z-10 tw:max-h-60 tw:overflow-y-auto tw:w-48">
                  {LANGUAGES.slice(0, 13).map((lang) => (
                    <button
                      key={lang.code}
                      className={`tw:block tw:w-full tw:text-left tw:px-4 tw:py-2 tw:text-sm hover:tw:bg-gray-100 ${
                        selectedLanguage === lang.code
                          ? "tw:bg-blue-50 tw:text-blue-600"
                          : ""
                      }`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {(isSpeechSupported && (isRecording || !message)) && (
            <button
              type="button"
              className={`tw:p-2 ${
                isRecording
                  ? "tw:text-red-500"
                  : "tw:text-gray-500 hover:tw:text-blue-500"
              } tw:focus:outline-none!`}
              onClick={toggleRecording}
              disabled={formEvent.loading}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}

          {(!isSpeechSupported || (!isRecording && (message))) && (
            <button
              type="submit"
              className={`tw:p-2 ${
                (message.trim() || (isRecording && transcript.trim())) &&
                !formEvent.loading
                  ? "tw:text-blue-500 hover:tw:text-blue-700"
                  : "tw:text-gray-300"
              } tw:focus:outline-none!`}
              disabled={
                (!message.trim() && !(isRecording && transcript.trim())) ||
                formEvent.loading
              }
              aria-label="Send message"
            >
              <SendHorizontal size={18} />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
