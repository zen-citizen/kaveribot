import { MessageSquareMore } from "lucide-react";
import { FeedbackContainer } from "./index";
import ReactMarkdown from "react-markdown";

// Define type for code component props to properly include inline
type CodeProps = {
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
};

export const BotMessage = ({ value }: { value: string }) => {
  return (
    <div className="flex-col flex gap-1">
      <div className="flex-row flex gap-2 items-center">
        <MessageSquareMore className="text-blue-600" />
        <span className="text-xs">Zen Citizen Bot</span>
      </div>
      <div className="message-text response-text text-sm text-gray-800 bg-white px-6 rounded-lg text-left tracking-wide pb-4 pt-4 leading-[22px] font-normal">
        <div className="markdown">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
              h1: ({ children }) => <h1 className="text-xl font-bold my-3">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold my-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-bold my-2">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc ml-6 mb-3">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-6 mb-3">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              a: ({ children, href }) => (
                <a className="text-blue-600 hover:underline" href={href} target="_blank" rel="noopener noreferrer">{children}</a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic my-3">{children}</blockquote>
              ),
              code: ({ children, inline }: CodeProps) => {
                return inline ? (
                  <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm">{children}</code>
                ) : (
                  <code className="block bg-gray-100 p-2 rounded font-mono text-sm overflow-x-auto my-3">{children}</code>
                );
              },
              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              table: ({ children }) => (
                <div className="overflow-x-auto my-3">
                  <table className="min-w-full divide-y divide-gray-300">{children}</table>
                </div>
              ),
              th: ({ children }) => <th className="py-2 px-3 font-bold bg-gray-100">{children}</th>,
              td: ({ children }) => <td className="py-2 px-3 border-t">{children}</td>,
            }}
          >
            {value}
          </ReactMarkdown>
        </div>
      </div>
      <FeedbackContainer />
    </div>
  );
};
