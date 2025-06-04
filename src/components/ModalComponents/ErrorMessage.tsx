export const ErrorMessage = ({ error }: { error: string }) => {
  return (
    <div className="tw:flex-col tw:flex tw:gap-2">
      <p className="tw:text-gray-500 tw:text-xs tw:font-medium">Spashta</p>
      <div className="message-text response-text tw:text-sm tw:text-gray-800 tw:bg-white tw:px-5 tw:py-4 tw:rounded-lg tw:text-left">
        {error && <p className="tw:text-red-500">{error}</p>}
      </div>
    </div>
  );
};
