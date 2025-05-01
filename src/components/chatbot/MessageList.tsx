
import React, { useRef, useEffect } from 'react';
import { Message } from './types';
import { ErrorBoundary } from 'react-error-boundary';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const ErrorFallback = () => (
  <div className="p-3 text-red-500 bg-red-50 rounded-md text-sm">
    <h4 className="font-medium mb-1">Error loading messages</h4>
    <p>Please refresh the page</p>
  </div>
);

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    // Use requestAnimationFrame to ensure DOM is updated before scrolling
    requestAnimationFrame(scrollToBottom);
  }, [messages]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="h-[300px] overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500">
            <p className="text-sm font-medium">👋 Hi! I can help you with:</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Choosing the right template</li>
              <li>• Customizing your website</li>
              <li>• Content suggestions</li>
              <li>• Best practices</li>
            </ul>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                msg.isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {typeof msg.content === 'string' ? msg.content : 'Message content unavailable'}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground p-3 rounded-lg flex items-center space-x-2">
              <span className="animate-pulse">•</span>
              <span className="animate-pulse delay-75">•</span>
              <span className="animate-pulse delay-150">•</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ErrorBoundary>
  );
};

export default MessageList;
