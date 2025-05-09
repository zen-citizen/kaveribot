export const Footer = () => {
  return (
    <footer>
      <div className="tw:flex! tw:justify-between! tw:px-4 tw:py-3 tw:text-xs tw:text-gray-500">
        <div>
          Powered by{" "}
          <a
            href="http://zencitizen.in/"
            target="_blank"
            className="tw:text-blue-600! tw:font-semibold tw:underline! tw:hover:opacity-85 tw:transition-opacity tw:underline-offset-2!"
          >
            <strong>Zen Citizen</strong>
          </a>
        </div>
        <div className="tw:flex tw:gap-3">
          <a
            href="https://zencitizen.in/contact-us/"
            className="tw:text-blue-600! tw:font-semibold tw:underline! tw:hover:opacity-85 tw:transition-opacity tw:underline-offset-2!"
          >
            Feedback
          </a>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScQS_-VgUFQZJedyu6iIlpoYymsKSyGUhrvPoJX1WkZGQqfLQ/viewform"
            target="_blank"
            className="tw:text-blue-600! tw:font-semibold tw:underline! tw:hover:opacity-85 tw:transition-opacity tw:underline-offset-2!"
          >
            Volunteer
          </a>
        </div>
      </div>
    </footer>
  );
};
