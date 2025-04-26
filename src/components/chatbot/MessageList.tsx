
import React, { useRef, useEffect } from 'react';
import { Message } from './types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-[300px] overflow-y-auto mb-4 space-y-4 p-4 border rounded-md bg-background">
      {messages.length === 0 && (
        <div className="text-center text-gray-500">
          <p>👋 Hi! I can help you with:</p>
          <ul className="mt-2 space-y-1">
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
            className={`max-w-[80%] p-3 rounded-lg ${
              msg.isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            }`}
          >
            {msg.content}
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
  );
};

export default MessageList;
