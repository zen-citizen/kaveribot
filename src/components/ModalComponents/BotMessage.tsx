import { MessageSquareMore, Volume2, VolumeX } from "lucide-react";
import { FeedbackContainer } from "./index";
import ReactMarkdown from "react-markdown";
import { useState, useEffect, useRef } from "react";

// Define type for code component props to properly include inline
type CodeProps = {
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
};

// Local storage key for language preference - must match the one in Form.tsx
const LANGUAGE_STORAGE_KEY = 'kaveribot_language_preference';

export const BotMessage = ({ value, messageId }: { value: string; messageId?: string }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const uniqueId = useRef(messageId || Math.random().toString(36).substring(2, 9)).current;
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

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
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en-IN';
    }
    return 'en-IN';
  };

  // Find the best matching voice for a given language code
  const findBestVoice = (langCode: string): SpeechSynthesisVoice | null => {
    if (!availableVoices || availableVoices.length === 0) {
      return null;
    }

    // Try to find exact match
    const exactMatch = availableVoices.find(voice => voice.lang === langCode);
    if (exactMatch) {
      return exactMatch;
    }

    // Try to find a voice with the same language (ignoring region)
    const langPrefix = langCode.split('-')[0].toLowerCase();
    const prefixMatch = availableVoices.find(voice => 
      voice.lang.toLowerCase().startsWith(langPrefix + '-')
    );
    if (prefixMatch) {
      return prefixMatch;
    }

    // If all else fails and it's not English, try to at least get a voice
    // that has the correct base language
    const anyMatch = availableVoices.find(voice => 
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
      alert('Speech synthesis is not supported in your browser.');
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
      console.log(`Using voice: ${voice.name} (${voice.lang}) for language ${langCode}`);
    } else {
      console.log(`No specific voice found for ${langCode}, using browser default`);
    }
    
    // Handle utterance events
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    // Store reference for cleanup
    speechSynthRef.current = utterance;
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="flex-col flex gap-1">
      <div className="flex-row flex gap-2 items-center">
        <MessageSquareMore className="text-blue-600" />
        <span className="text-xs">Zen Citizen Bot</span>
      </div>
      <div className="message-text response-text text-sm text-gray-800 bg-white px-6 rounded-lg text-left tracking-wide pb-4 pt-4 leading-[22px] font-normal">
        <div className="markdown">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
              h1: ({ children }) => <h1 className="text-xl font-bold my-3">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold my-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-bold my-2">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc ml-6 mb-3">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-6 mb-3">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              a: ({ children, href }) => (
                <a className="text-blue-600 hover:underline" href={href} target="_blank" rel="noopener noreferrer">{children}</a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic my-3">{children}</blockquote>
              ),
              code: ({ children, inline }: CodeProps) => {
                return inline ? (
                  <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm">{children}</code>
                ) : (
                  <code className="block bg-gray-100 p-2 rounded font-mono text-sm overflow-x-auto my-3">{children}</code>
                );
              },
              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              table: ({ children }) => (
                <div className="overflow-x-auto my-3">
                  <table className="min-w-full divide-y divide-gray-300">{children}</table>
                </div>
              ),
              th: ({ children }) => <th className="py-2 px-3 font-bold bg-gray-100">{children}</th>,
              td: ({ children }) => <td className="py-2 px-3 border-t">{children}</td>,
            }}
          >
            {value}
          </ReactMarkdown>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <FeedbackContainer messageId={uniqueId} />
        <button
          onClick={handleSpeak}
          className="p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
          aria-label={isSpeaking ? "Stop speaking" : "Speak message"}
        >
          {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
};
