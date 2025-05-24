export const Footer = () => {
  return (
    <footer className="tw:p-4 tw:border-t tw:border-gray-200 tw:text-gray-600 tw:text-sm">
      <div className="tw:flex! tw:justify-between!">
        <div>
          Powered by{" "}
          <a
            href="https://zencitizen.in"
            target="_blank"
            className="tw:underline! tw:underline-offset-3! tw:hover:opacity-85 tw:transition-opacity"
          >
            <strong>Zen Citizen</strong>
          </a>
        </div>
        <div className="tw:flex tw:gap-3">
          <a
            href="https://zencitizen.in/contact-us/"
            target="_blank"
            className="tw:underline! tw:underline-offset-3! tw:hover:opacity-85 tw:transition-opacity"
          >
            Feedback
          </a>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScQS_-VgUFQZJedyu6iIlpoYymsKSyGUhrvPoJX1WkZGQqfLQ/viewform"
            target="_blank"
            className="tw:underline! tw:underline-offset-3! tw:hover:opacity-85 tw:transition-opacity"
          >
            Volunteer
          </a>
        </div>
      </div>
    </footer>
  );
};
