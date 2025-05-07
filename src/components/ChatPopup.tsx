import { useRef, useState, useEffect } from "react";
import axios from "axios";

import { Body, Header, Form, Footer } from "./ModalComponents/index";

const baseURL = `https://zc-gpt.vercel.app`;

const post = async (url: string, data: any) => {
  try {
    const response = await axios.post(baseURL + url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { data: response?.data?.reply, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

interface ChatPopupProps {
  setTogglePopup: React.Dispatch<React.SetStateAction<boolean>>;
  togglePopup: boolean;
}

interface MessageType {
  role: string;
  message: string;
  imageData?: string;
}

const ChatPopup = ({ setTogglePopup, togglePopup }: ChatPopupProps) => {
  const [formEvent, setFormEvent] = useState<{
    error: unknown;
    response: unknown;
    loading: boolean;
  }>({
    error: null,
    response: null,
    loading: false,
  });
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCaptureMode, setIsCaptureMode] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const apiEndpoint = "/api/chat";
  const chatRef = useRef<HTMLDivElement>(null);
  
  const [message, setMessage] = useState("");
  const messages = useRef<MessageType[]>([]);
  const inputRef = useRef(null);

  const captureScreen = async () => {
    try {
      // Temporarily hide the chatbot popup
      const chatElement = chatRef.current;
      if (chatElement) {
        setIsCaptureMode(true);
        chatElement.style.visibility = 'hidden';
      }
      
      // Wait a moment for the UI to update
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Request permission to capture the screen
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always"
        },
        audio: false
      });
      
      // Create a video element to capture the screen
      const video = document.createElement("video");
      video.srcObject = mediaStream;
      
      // Wait for the video to load metadata
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
        video.play();
      });
      
      // Create a canvas element to draw the video frame
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Stop all video tracks to end screen sharing
      mediaStream.getTracks().forEach(track => track.stop());
      
      // Convert the canvas to a data URL (base64 encoded image)
      const screenshotDataUrl = canvas.toDataURL("image/jpeg");
      setScreenshot(screenshotDataUrl);
      
      // Show the chatbot again
      if (chatElement) {
        chatElement.style.visibility = 'visible';
        setIsCaptureMode(false);
      }
      
    } catch (error) {
      console.error("Error capturing screen:", error);
      // Handle error - perhaps the user denied permission
      // Make sure to show the chatbot again if there was an error
      const chatElement = chatRef.current;
      if (chatElement) {
        chatElement.style.visibility = 'visible';
        setIsCaptureMode(false);
      }
    }
  };
  
  const removeScreenshot = () => {
    setScreenshot(null);
  };
  
  const openImagePreview = (imageData: string) => {
    setPreviewImage(imageData);
    setShowFullPreview(true);
  };

  const sendMessage = async (message: string) => {
    // Clear message input immediately at the start
    setMessage("");
    
    // Create message object including the screenshot if available
    const newMessage: MessageType = { 
      role: "user", 
      message,
      ...(screenshot && { imageData: screenshot })
    };
    
    // Add to messages
    messages.current.push(newMessage);
    
    // Force re-render by updating formEvent state
    setFormEvent((prev) => ({
      ...prev,
      loading: true,
      error: null,
      response: null,
    }));
    
    // Create FormData to send both text and image
    const formData = new FormData();
    formData.append('message', message);
    
    // Add screenshot if available
    if (screenshot) {
      // Convert base64 string to blob
      const response = await fetch(screenshot);
      const blob = await response.blob();
      formData.append('image', blob, 'screenshot.jpg');
      setScreenshot(null); // Clear screenshot after sending
    }
    
    const { data, error } = await post(apiEndpoint, formData);
    
    setFormEvent((prev) => ({
      ...prev,
      loading: false,
      error: error ? new Error(error?.toString()) : null,
      response: data,
    }));
    
    focusOnInput();
    if (data) {
      messages.current.push({ message: data, role: "model" });
      // Force another re-render to update the message list with the response
      setFormEvent(prev => ({ ...prev }));
    } else if (messages.current.length > 0) {
      // Only set message if there was an error and we have previous messages
      const lastUserMessage = [...messages.current].reverse().find(m => m.role === "user");
      if (lastUserMessage) {
        setMessage(lastUserMessage.message);
      }
    }
  };

  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [formEvent]);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  const focusOnInput = () => {
    scrollToBottom();
    setTimeout(() => {
      inputRef?.current?.focus();
      const el = document.getElementById("chat-input");
      el?.focus();
    }, 100);
  };

  if (isCaptureMode) {
    return null; // Don't render anything during capture mode
  }

  return (
    <div
      ref={chatRef}
      className="chatbot-popup tw:fixed tw:bottom-20 tw:right-4 tw:bg-gray-100 tw:rounded-2xl tw:shadow-lg tw:flex tw:flex-col tw:overflow-hidden tw:max-h-[70vh] tw:max-w-[80%] tw:sm:max-w-[60%] tw:md:max-w-[40%] tw:lg:max-w-[33%] tw:xl:max-w-[25%]"
    >
      {(showFullPreview && (screenshot || previewImage)) && (
        <div className="tw:fixed tw:inset-0 tw:z-50 tw:bg-black/80 tw:flex tw:items-center tw:justify-center" onClick={() => {setShowFullPreview(false); setPreviewImage(null);}}>
          <div className="tw:max-w-[90%] tw:max-h-[90%] tw:overflow-auto">
            <img 
              src={previewImage || screenshot} 
              alt="Full screenshot preview" 
              className="tw:max-w-full tw:max-h-full tw:object-contain"
            />
          </div>
          <button 
            className="tw:absolute tw:top-4 tw:right-4 tw:bg-white tw:text-black tw:rounded-full tw:p-2"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullPreview(false);
              setPreviewImage(null);
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      <Header
        setTogglePopup={setTogglePopup}
        togglePopup={togglePopup}
      />
      <Body
        chatBodyRef={chatBodyRef}
        formEvent={formEvent}
        messages={messages}
        onImageClick={openImagePreview}
      />
      
      <div className="tw:w-full tw:px-3 tw:py-1 tw:flex tw:justify-start tw:items-center tw:bg-white">
        {screenshot && (
          <div className="tw:relative tw:flex tw:items-center tw:ml-2">
            <div 
              className="tw:relative tw:w-12 tw:h-8 tw:cursor-pointer tw:overflow-hidden tw:rounded tw:border-2 tw:border-[#003df5]/60"
              onClick={() => setShowFullPreview(true)}
            >
              <img 
                src={screenshot} 
                alt="Screenshot thumbnail" 
                className="tw:w-full tw:h-full tw:object-cover"
              />
              <div className="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-black/10 tw:opacity-0 tw:hover:opacity-100 tw:transition-opacity">
                <span className="tw:text-white tw:text-xs">Preview</span>
              </div>
            </div>
            <button 
              onClick={removeScreenshot}
              className="tw:absolute tw:-top-1 tw:-right-1 tw:bg-red-500 tw:text-white tw:p-0 tw:rounded-full tw:w-4 tw:h-4 tw:flex tw:items-center tw:justify-center tw:text-xs"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      
      <Form
        message={message}
        sendMessage={sendMessage}
        setMessage={setMessage}
        captureScreen={captureScreen}
        formEvent={formEvent}
        inputRef={inputRef}
        loading={formEvent.loading}
      />
      <Footer />
    </div>
  );
};

export default ChatPopup;
