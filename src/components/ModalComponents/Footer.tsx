export const Footer = () => {
  return (
    <footer>
      <div className="flex justify-between px-2 py-2 text-xs">
        <p>
          Powered by
          <a
            href="http://zencitizen.in/"
            className="underline-offset-2 underline ml-1"
            target="_blank"
          >
            <b>Zen Citizen</b>
          </a>
        </p>
        <div className="flex gap-3">
          <a href="https://zencitizen.in/contact-us/" target="_blank" className="underline underline-offset-3">
            Feedback
          </a>
          <a href="https://forms.gle/TKwxWceZ9aL3uEQ88"  target="_blank" className="underline underline-offset-3">
            Volunteer
          </a>
        </div>
      </div>
    </footer>
  );
};
