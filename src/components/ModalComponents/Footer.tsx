export const Footer = () => {
  return (
    <footer>
      <div className="tw:flex! tw:justify-between! tw:px-2 tw:py-2 tw:text-xs">
        <div>
          Powered by
          <a
            href="http://zencitizen.in/"
            className="tw:underline-offset-2! tw:underline! tw:ml-1"
          >
            <b>Zen Citizen</b>
          </a>
        </div>
        <div className="tw:flex tw:gap-3">
          <a href="#" className="tw:underline! tw:underline-offset-3!">
            Feedback
          </a>
          <a href="#" className="tw:underline! tw:underline-offset-3!">
            Volunteer
          </a>
        </div>
      </div>
    </footer>
  );
};
