import ReactMarkdown from "react-markdown";

// Define type for code component props
type CodeProps = {
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
};

export const UserMessage = ({ value }: { value: string }) => {
  return (
    <div className="user-message message-text tw:text-neutral-50 tw:text-sm tw:bg-[#003df5] tw:px-5 tw:py-4 tw:rounded-lg tw:max-w-10/12 tw:ml-auto">
      <div className="markdown text-white">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="tw:mb-2! tw:last:mb-0!">{children}</p>
            ),
            strong: ({ children }) => (
              <strong className="tw:font-bold">{children}</strong>
            ),
            em: ({ children }) => <em className="tw:italic">{children}</em>,
            a: ({ children, href }) => (
              <a
                className="tw:underline! tw:text-blue-600!"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            ul: ({ children }) => (
              <ul className="tw:list-disc tw:ml-5 tw:mb-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="tw:list-decimal tw:ml-5 tw:mb-2">{children}</ol>
            ),
            li: ({ children }) => <li className="tw:mb-1">{children}</li>,
            code: ({ children, inline }: CodeProps) =>
              inline ? (
                <code className="tw:bg-[#0135d8] tw:px-1 tw:py-0.5 tw:rounded tw:font-mono tw:text-sm">
                  {children}
                </code>
              ) : (
                <code className="tw:block bg-[#0135d8] tw:p-2 tw:rounded tw:font-mono tw:text-sm tw:overflow-x-auto tw:my-2">
                  {children}
                </code>
              ),
          }}
        >
          {value}
        </ReactMarkdown>
      </div>
    </div>
  );
};
