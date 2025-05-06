import { MessageSquareMore } from "lucide-react";

export const DefaultMessage = () => {
  return (
    <div className="tw:flex-col tw:flex tw:gap-1">
      <div className="tw:flex-row tw:flex tw:gap-2 tw:items-center">
        <MessageSquareMore className="tw:text-blue-600" />
        <span className="tw:text-xs">Zen Citizen Bot</span>
      </div>
      <div className="message-text tw:text-sm tw:text-gray-800 tw:bg-white tw:px-7 tw:rounded-lg tw:text-left tw:tracking-wide tw:pb-4 tw:pt-7 tw:leading-[22px] tw:font-normal">
        Hi! 👋
        <br />
        <br />
        We’re
        <a
          href="https://zencitizen.in"
          target="_blank"
          className="tw:text-blue-600 tw:font-semibold"
        >
          Zen Citizen
        </a>
        — a volunteer group helping make government services easier to access.
        <br />
        <br />
        This chatbot shares tips and answers questions on registering a Hindu
        marriage online on the Kaveri portal.
        <em> We plan to expand to more services soon.</em>
        <br />
        <br />
        <span className="tw:text-xs tw:font-medium tw:tracking-normal tw:text-gray-500 tw:leading-[2px]">
          AI is occasionally inaccurate. Always verify important information.
        </span>
      </div>
    </div>
  );
};
