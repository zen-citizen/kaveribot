const events = {
  messageSent: "sent_message",
  feedback_good: "positive_feedback_recorded",
  feedback_bad: "negative_feedback_recorded",
}

const usePostHog = () => {
  const posthog = window?.posthog;

  const trackEvent = (event: string, properties?: Record<string, unknown>) => {
    posthog?.capture(event, properties);
  };

  const trackMessageSent = () => {
    trackEvent(events.messageSent, {})
  }

  const trackFeedback = (value: "good" | "bad" | null, eventData: { messages: unknown[] }) => {
    trackEvent(value === "good" ? events.feedback_good : events.feedback_bad, eventData)
  }

  return { trackMessageSent, trackFeedback };
};

export default usePostHog;
