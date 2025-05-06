export const UserMessage = ({ value }: { value: string }) => {
  return (
    <div className="message-text tw:text-neutral-50 tw:text-sm tw:bg-[#013df5] tw:px-5 tw:py-4 tw:rounded-lg tw:max-w-10/12 tw:ml-auto">
      {value}
    </div>
  );
};
