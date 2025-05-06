import ReactMarkdown from "react-markdown";

// Define type for code component props
type CodeProps = {
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
};

export const UserMessage = ({ value }: { value: string }) => {
  return (
    <div className="message-text text-neutral-50 text-sm bg-[#013df5] p-3 rounded-lg max-w-10/12 ml-auto tracking-wide leading-[22px]">
      <div className="markdown text-white">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            a: ({ children, href }) => (
              <a className="underline" href={href} target="_blank" rel="noopener noreferrer">{children}</a>
            ),
            ul: ({ children }) => <ul className="list-disc ml-5 mb-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal ml-5 mb-2">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ children, inline }: CodeProps) => (
              inline ? 
                <code className="bg-[#0135d8] px-1 py-0.5 rounded font-mono text-sm">{children}</code> : 
                <code className="block bg-[#0135d8] p-2 rounded font-mono text-sm overflow-x-auto my-2">{children}</code>
            ),
          }}
        >
          {value}
        </ReactMarkdown>
      </div>
    </div>
  );
};
