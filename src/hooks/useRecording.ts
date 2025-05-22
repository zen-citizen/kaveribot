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

export { useRecordingContext, RecordingContext };
