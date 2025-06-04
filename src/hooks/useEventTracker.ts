import axios from "axios";
import { baseURL } from "../constants";

enum Events {
  messageSent = "user_message_sent",
  messageReceived = "bot_message_received",
  feedbackGood = "positive_feedback",
  feedbackBad = "negative_feedback",
  imageResized = "image_resized",
  imageResizeDownloaded = "image_resize_downloaded",
}

const useEventTracker = (sessionId: string) => {

  const trackEvent = (args: {
    eventName: Events,
    eventData: any
  }) => {
    const { eventName, eventData } = args;
    axios.post(`${baseURL}/api/event`, {
      eventName,
      sessionId,
      eventData
    }, {
      headers: {
        "Content-Type": "application/json",
        "x-zc-key": import.meta.env.VITE_ZC_KEY
      }
    }).catch((err) => {
      console.error(err);
    })
    return;
  };

  return { trackEvent };
};

export default useEventTracker;
export { Events };