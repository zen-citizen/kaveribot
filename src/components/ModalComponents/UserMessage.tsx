interface UserMessageProps {
  value: string;
  imageData?: string;
  onImageClick: (imageData: string) => void;
}

export const UserMessage = ({ value, imageData, onImageClick }: UserMessageProps) => {
  return (
    <div className="tw:flex tw:flex-col tw:items-end tw:gap-2">
      {imageData && (
        <div 
          className="tw:relative tw:w-24 tw:h-16 tw:cursor-pointer tw:overflow-hidden tw:rounded tw:border-2 tw:border-[#003df5]/60"
          onClick={() => onImageClick(imageData)}
        >
          <img 
            src={imageData} 
            alt="Screenshot" 
            className="tw:w-full tw:h-full tw:object-cover"
          />
          <div className="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-black/10 tw:opacity-0 tw:hover:opacity-100 tw:transition-opacity">
            <span className="tw:text-white tw:text-xs">View</span>
          </div>
        </div>
      )}
      <div className="message-text tw:text-neutral-50 tw:text-sm tw:bg-[#003df5] tw:px-5 tw:py-4 tw:rounded-lg tw:max-w-10/12 tw:ml-auto">
        {value}
      </div>
    </div>
  );
};
