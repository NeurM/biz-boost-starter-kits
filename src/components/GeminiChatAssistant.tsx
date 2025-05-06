
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { ErrorBoundary } from 'react-error-boundary';
import MessageList from './chatbot/MessageList';
import WebsiteBuilder from './chatbot/WebsiteBuilder';
import ChatInput from './chatbot/ChatInput';
import ChatHeader from './chatbot/ChatHeader';
import { useGeminiChat } from '@/hooks/useGeminiChat';

const ErrorFallback = ({error}: {error?: Error}) => (
  <div className="text-red-500 p-4 bg-red-50 rounded-md">
    <h4 className="font-bold">Something went wrong with the chat assistant</h4>
    <p className="text-sm">{error?.message || 'An unknown error occurred'}</p>
    <p className="mt-2">Please try refreshing the page</p>
  </div>
);

const GeminiChatAssistant = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    websiteStatus,
    isPending,
    startTransition,
    handleSubmit,
    resetWebsite
  } = useGeminiChat();

  // Prevent any potential React suspense issues by not rendering child components
  // until they are needed
  const renderChatContent = () => {
    if (!isOpen) return null;
    if (isMinimized) return null;
    
    return (
      <CardContent>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div>
            <MessageList messages={messages} isLoading={isLoading || isPending} />
            <WebsiteBuilder 
              websiteStatus={websiteStatus}
              onReset={resetWebsite}
            />
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSubmit={handleSubmit}
              disabled={isLoading || isPending}
            />
          </div>
        </ErrorBoundary>
      </CardContent>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {!isOpen ? (
        <Button
          onClick={() => startTransition(() => setIsOpen(true))}
          className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 bg-primary hover:bg-primary/90 shadow-lg z-50"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className={`fixed bottom-4 right-4 shadow-lg transition-all duration-300 z-50 ${
          isMinimized ? 'w-72' : 'w-full max-w-md'
        }`}>
          <CardHeader className="pb-3">
            <ChatHeader 
              isMinimized={isMinimized} 
              onMinimize={() => startTransition(() => setIsMinimized(!isMinimized))}
              onClose={() => startTransition(() => setIsOpen(false))}
            />
          </CardHeader>
          {renderChatContent()}
        </Card>
      )}
    </ErrorBoundary>
  );
};

export default GeminiChatAssistant;
