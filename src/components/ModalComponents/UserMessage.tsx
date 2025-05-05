export const UserMessage = ({ value }: { value: string }) => {
  return (
    <div className="message-text text-neutral-50 text-sm bg-[#013df5] p-3 rounded-lg max-w-10/12 ml-auto tracking-wide leading-[22px]">
      {value}
    </div>
  );
};
