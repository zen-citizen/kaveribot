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
    <div className="w-full flex flex-col bg-white">
      {isRecording && (
        <div className="w-full flex items-center justify-center py-1 bg-red-50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
            <span className="text-xs text-red-500">Recording {formatTime(recordingTime)} in {getSelectedLanguageName()}</span>
          </div>
        </div>
      )}
      <div className="w-full flex flex-row items-center h-13">
        <textarea
          ref={inputRef}
          autoFocus
          id="chat-input"
          value={isRecording ? transcript : message}
          onChange={(e) => !isRecording && setMessage(e?.target?.value)}
          className="w-full p-2 ml-2 text-sm h-3/4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder={isRecording ? "Listening..." : "Ask a question..."}
          onKeyDown={(event) => {
            if (formEvent.loading || isRecording) return;
            if (event?.keyCode === 13 || event.code === "Enter") {
              sendMessage(message);
              setMessage("");
              event.preventDefault();
            }
          }}
          disabled={formEvent.loading || isRecording}
        ></textarea>
        <div className="chat-controls flex items-center justify-between p-2 space-x-2">
          <div className="relative" ref={dropdownRef}>
            <button 
              className="text-gray-500 hover:text-blue-700 p-1 rounded-md flex items-center"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              aria-label="Select language"
            >
              <Globe size={18} />
              <span className="text-xs ml-1">{selectedLanguage.split('-')[0]}</span>
            </button>
            
            {showLanguageDropdown && (
              <div className="absolute bottom-10 right-0 bg-white shadow-lg rounded-md py-1 z-10 w-48 max-h-60 overflow-y-auto">
                <div className="sticky top-0 bg-gray-100 px-4 py-2 font-semibold text-xs text-gray-600">
                  Indian Languages
                </div>
                {LANGUAGES.slice(0, 13).map((lang) => (
                  <button
                    key={lang.code}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${
                      selectedLanguage === lang.code ? 'bg-blue-100 font-medium' : ''
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
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${
                      selectedLanguage === lang.code ? 'bg-blue-100 font-medium' : ''
                    }`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {!isRecording && message ? (
            <SendHorizontal onClick={(event) => {
              if (formEvent.loading) return;
              sendMessage(message);
              setMessage("");
              event.preventDefault();
            }} className="block text-blue-500 hover:text-blue-700" />
          ) : (
            <>
              {isRecording ? (
                <MicOff 
                  className="text-red-500 hover:text-red-700" 
                  onClick={toggleRecording}
                  aria-label="Stop recording"
                />
              ) : (
                <Mic 
                  className={isSpeechSupported ? "text-blue-500 hover:text-blue-700" : "text-gray-400 cursor-not-allowed"}
                  id="mic-button" 
                  onClick={toggleRecording}
                  aria-label={isSpeechSupported ? "Start voice recording" : "Speech recognition not supported"}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
