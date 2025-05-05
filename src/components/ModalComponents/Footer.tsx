export const Footer = () => {
  return (
    <footer>
      <div className="flex justify-between px-2 py-2 text-xs">
        <p>
          Powered by
          <a
            href="http://zencitizen.in/"
            className="underline-offset-2 underline ml-1"
          >
            <b>Zen Citizen</b>
          </a>
        </p>
        <div className="flex gap-3">
          <a href="#" className="underline underline-offset-3">
            Feedback
          </a>
          <a href="#" className="underline underline-offset-3">
            Volunteer
          </a>
        </div>
      </div>
    </footer>
  );
};
