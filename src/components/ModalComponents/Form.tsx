import { Mic, MicOff, SendHorizontal } from "lucide-react";
import { RefObject, useState, useEffect, useRef } from "react";

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
  inputRef,
}: ChatInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  // Initialize speech recognition on mount
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
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
    
    // Cleanup function
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
  }, []);

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
      recognitionRef.current.start();
      setIsRecording(true);
      playAudioFeedback('start');
      console.log("Recording started");
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

  return (
    <div className="w-full flex flex-col bg-white">
      {isRecording && (
        <div className="w-full flex items-center justify-center py-1 bg-red-50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
            <span className="text-xs text-red-500">Recording {formatTime(recordingTime)}</span>
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
        <div className="chat-controls flex items-center justify-between p-2 cursor-pointer">
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
                  title="Stop recording"
                />
              ) : (
                <Mic 
                  className={isSpeechSupported ? "text-blue-500 hover:text-blue-700" : "text-gray-400 cursor-not-allowed"}
                  id="mic-button" 
                  onClick={toggleRecording}
                  title={isSpeechSupported ? "Start voice recording" : "Speech recognition not supported"}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
