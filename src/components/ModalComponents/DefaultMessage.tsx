export const DefaultMessage = () => {
  return (
    <div className="tw:flex-col tw:flex tw:gap-2">
      <div className="tw:text-gray-500 tw:text-xs tw:font-medium">
        Zen Citizen Bot
      </div>
      <div className="message-text tw:text-sm tw:text-gray-800 tw:bg-white tw:px-5 tw:rounded-lg tw:text-left tw:py-4">
        <p>Namaskara! 🙏</p>
        <p>
          We’re{" "}
          <a
            href="https://zencitizen.in"
            target="_blank"
            className="tw:text-blue-600! tw:font-semibold tw:underline! tw:underline-offset-2 tw:hover:opacity-85 tw:transition-opacity"
          >
            Zen Citizen
          </a>{" "}
          — a volunteer group helping make government services easier to access.
        </p>
        <p>
          This chatbot shares tips and answers questions on registering a Hindu
          marriage online on the Kaveri portal.
          <em> We plan to expand to more services soon.</em>
        </p>
        <p className="tw:text-xs tw:font-semibold tw:text-gray-400 tw:leading-[1.5] tw:mb-2!">
          Please do not share any sensitive information such as Aadhaar number,
          address, or contact details in the chat.
        </p>
        <p className="tw:text-xs tw:font-semibold tw:text-gray-400 tw:leading-[1.5] tw:mb-0!">
          AI is occasionally inaccurate. Always verify important information.
        </p>
      </div>
    </div>
  );
};
