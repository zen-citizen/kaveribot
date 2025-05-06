import { Mic, MicOff, SendHorizontal, Globe } from "lucide-react";
import { RefObject, useState, useEffect, useRef } from "react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: (message: string) => void;
  loading: boolean;
  formEvent: { error: unknown; response: unknown; loading: boolean };
  inputRef: RefObject<HTMLTextAreaElement>;
}

// Supported languages for speech recognition with focus on Indian languages
const LANGUAGES = [
  { code: 'en-IN', name: 'English (India)' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'bn-IN', name: 'Bengali' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'ur-IN', name: 'Urdu' },
  { code: 'gu-IN', name: 'Gujarati' },
  { code: 'pa-IN', name: 'Punjabi' },
  { code: 'or-IN', name: 'Odia' },
  { code: 'as-IN', name: 'Assamese' },
  // Other international languages
  { code: 'en-US', name: 'English (US)' },
  { code: 'zh-CN', name: 'Chinese' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ar-SA', name: 'Arabic' }
];

export const Form = ({
  message,
  sendMessage,
  setMessage,
  formEvent,
  inputRef,
}: ChatInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-IN');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = selectedLanguage;
      
      recognitionInstance.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setTranscript(currentTranscript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        setRecordingTime(0);
        playAudioFeedback('stop');
      };
      
      recognitionInstance.onend = () => {
        console.log("Recognition ended");
        setIsRecording(false);
        setRecordingTime(0);
        if (transcript) {
          setMessage(transcript);
        }
        playAudioFeedback('stop');
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
        setRecordingTime(prev => prev + 1);
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

  const playAudioFeedback = (type: 'start' | 'stop') => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'start') {
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
      playAudioFeedback('start');
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  const getSelectedLanguageName = () => {
    return LANGUAGES.find(lang => lang.code === selectedLanguage)?.name || 'English (India)';
  };

  return (
    <form
      className="chat-input sticky bottom-0 border-t border-gray-200 p-2 bg-white"
      onSubmit={(e) => {
        e.preventDefault();
        if ((message.trim() || (isRecording && transcript.trim())) && !formEvent.loading) {
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
        <div className="recording-indicator flex items-center gap-2 mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <div className="flex-shrink-0 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-500 font-medium text-sm">Recording: {formatTime(recordingTime)} in {getSelectedLanguageName()}</span>
        </div>
      )}
      
      <div className="flex items-end relative">
        <textarea
          id="chat-input"
          className="flex-1 p-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32 resize-none"
          placeholder={isRecording ? "Listening..." : "Type your message here..."}
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
          rows={1}
          ref={inputRef}
          disabled={isRecording}
          style={{
            minHeight: "50px",
            height: "auto",
            maxHeight: "120px",
          }}
        />
        
        <div className="absolute right-2 bottom-2 flex gap-2">
          {isSpeechSupported && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-blue-500 focus:outline-none flex items-center"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                aria-label="Select language"
              >
                <Globe size={18} />
                <span className="text-xs ml-1">{selectedLanguage.split('-')[0]}</span>
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto w-48">
                  <div className="sticky top-0 bg-gray-100 px-4 py-2 font-semibold text-xs text-gray-600">
                    Indian Languages
                  </div>
                  {LANGUAGES.slice(0, 13).map((lang) => (
                    <button
                      key={lang.code}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        selectedLanguage === lang.code ? "bg-blue-50 text-blue-600" : ""
                      }`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.name}
                    </button>
                  ))}
                  <div className="sticky top-0 bg-gray-100 px-4 py-2 font-semibold text-xs text-gray-600">
                    Other Languages
                  </div>
                  {LANGUAGES.slice(13).map((lang) => (
                    <button
                      key={lang.code}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        selectedLanguage === lang.code ? "bg-blue-50 text-blue-600" : ""
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
          
          {isSpeechSupported && (
            <button
              type="button"
              className={`p-2 ${
                isRecording ? "text-red-500" : "text-gray-500 hover:text-blue-500"
              } focus:outline-none`}
              onClick={toggleRecording}
              disabled={formEvent.loading}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
          
          <button
            type="submit"
            className={`p-2 ${
              (message.trim() || (isRecording && transcript.trim())) && !formEvent.loading
                ? "text-blue-500 hover:text-blue-700"
                : "text-gray-300"
            } focus:outline-none`}
            disabled={(!message.trim() && !(isRecording && transcript.trim())) || formEvent.loading}
            aria-label="Send message"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
    </form>
  );
};
