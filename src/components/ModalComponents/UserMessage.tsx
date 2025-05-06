export const UserMessage = ({ value }: { value: string }) => {
  return (
    <div className="message-text tw:text-neutral-50 tw:text-sm tw:bg-[#013df5] tw:p-3 tw:rounded-lg tw:max-w-10/12 tw:ml-auto tw:tracking-wide tw:leading-[22px]">
      {value}
    </div>
  );
};
