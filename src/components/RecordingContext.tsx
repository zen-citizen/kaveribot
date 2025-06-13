import { useRef } from "react";
import { useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";

const RecordingContext = createContext<{
  startRecording: () => any;
  stopRecording: () => any;
  audioBase64: string | null;
  audioUrl: string | null;
  isRecording: boolean;
  error: string | null;
  convertToBase64: (blob: Blob) => Promise<string>;
  clearAudio: () => void;
}>({
  startRecording: () => null,
  stopRecording: () => null,
  audioBase64: null,
  audioUrl: null,
  isRecording: false,
  error: null,
  convertToBase64: () => Promise.reject(new Error("Not implemented")),
  clearAudio: () => null,
});

const useRecordingContext = () => {
  return useContext(RecordingContext);
};

const RecordingProvider = ({ children }: { children: React.ReactNode }) => {
  // State to manage if audio is currently being recorded
  const [isRecording, setIsRecording] = useState<boolean>(false);
  // State to store the recorded audio data (Blob)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  // State to store the URL of the recorded audio, for playback
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  // State to manage any error messages
  const [error, setError] = useState<string | null>(null);
  // Ref to hold the MediaRecorder instance
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // Ref to hold the array of audio data chunks
  const audioChunksRef = useRef<Blob[]>([]);
  const startRecording = async () => {
    setError(null); // Clear any previous errors
    setAudioBlob(null); // Clear previous recording
    setAudioUrl(null); // Clear previous audio URL

    try {
      // Request access to the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Initialize MediaRecorder with the audio stream
      mediaRecorderRef.current = new MediaRecorder(stream);
      // Initialize an empty array to store audio data chunks
      audioChunksRef.current = [];

      // Event listener for when data is available from the recorder
      mediaRecorderRef.current.ondataavailable = (event) => {
        // If there's data, add it to the chunks array
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Event listener for when the recording stops
      mediaRecorderRef.current.onstop = async () => {
        // Create a Blob from the collected audio chunks
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        // Create a URL for the audio Blob for playback
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url); // Store the audio URL in state
        // Stop all tracks in the stream to release microphone
        stream.getTracks().forEach((track) => track.stop());
        const base64 = await convertToBase64(audioBlob);
        setAudioBase64(base64);
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true); // Update recording status
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError(
        "Could not access microphone. Please ensure it is connected and permissions are granted."
      );
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop(); // Stop the recording
      setIsRecording(false); // Update recording status
    }
  };

  const convertToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      // if (!audioBlob) {
      //   reject(new Error("No audio blob to convert"));
      //   return;
      // }
      try {
        // Create a FileReader to convert the Blob to a Base64 string
        const reader = new FileReader();
        reader.readAsDataURL(blob); // Read the Blob as a data URL (Base64 encoded)

        reader.onloadend = () => {
          // The result will be in the format "data:audio/webm;base64,..."
          // @ts-expect-error result could be null
          const base64Audio = reader.result?.split(",")?.[1]; // Get only the Base64 part
          resolve(base64Audio as string);
        };

        reader.onerror = (err) => {
          console.error("Error converting audio to Base64:", err);
          setError("Failed to process audio for sending.");
          reject(err);
        };
      } catch (err) {
        console.error("Error in sendAudio:", err);
        setError(
          "An unexpected error occurred while preparing audio for sending."
        );
        reject(error);
      }
    });
  };

  const clearAudio = () => {
    setAudioBlob(null);
    setAudioBase64(null);
    setAudioUrl(null);
  };

  return (
    <RecordingContext.Provider
      value={{
        isRecording,
        audioUrl,
        audioBase64,
        error,
        startRecording,
        stopRecording,
        convertToBase64,
        clearAudio,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
};

export default RecordingProvider;

export { useRecordingContext };
