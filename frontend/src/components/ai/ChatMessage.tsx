import { User, Bot } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-green-100' : 'bg-gray-100'
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-green-700" />
        ) : (
          <Bot className="h-4 w-4 text-gray-600" />
        )}
      </div>
      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block max-w-[85%] rounded-lg px-4 py-2 ${
            isUser ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500 font-medium">Sources:</p>
            {message.sources.map((source, index) => (
              <div
                key={index}
                className="text-xs bg-white border rounded-md p-2 text-left"
              >
                <p className="font-medium text-gray-900">{source.title}</p>
                <p className="text-gray-500">
                  {source.collection} &bull; {source.branch}
                </p>
                {source.excerpt && (
                  <p className="text-gray-600 mt-1 line-clamp-2">{source.excerpt}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
