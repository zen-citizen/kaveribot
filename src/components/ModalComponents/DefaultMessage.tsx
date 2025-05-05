import { MessageSquareMore } from "lucide-react";

export const DefaultMessage = () => {
  return (
    <div className="flex-col flex gap-1">
      <div className="flex-row flex gap-2 items-center">
        <MessageSquareMore className="text-blue-600" />
        <span className="text-xs">Zen Citizen Bot</span>
      </div>
      <div className="message-text text-sm text-gray-800 bg-white px-7 rounded-lg text-left tracking-wide pb-4 pt-7 leading-[22px] font-normal">
        Hi! 👋
        <br />
        <br />
        We’re
        <a
          href="https://zencitizen.in"
          target="_blank"
          className="text-blue-600 font-semibold"
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
        <span className="text-xs font-medium tracking-normal text-gray-500 leading-[2px]">
          AI is occasionally inaccurate. Always verify important information.
        </span>
      </div>
    </div>
  );
};
