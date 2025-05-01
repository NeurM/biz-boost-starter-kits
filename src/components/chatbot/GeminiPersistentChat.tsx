
import React, { useState, useEffect, useRef, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import MessageList from './MessageList';
import { toast } from '@/hooks/use-toast';
import { useChat } from '@/context/ChatContext';
import { useChatPersistence } from '@/hooks/useChatPersistence';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

const ErrorFallback = ({error}: {error?: Error}) => (
  <div className="p-4 text-red-500 bg-red-50 rounded-md">
    <h4 className="font-medium mb-2">Something went wrong with the chat</h4>
    <p className="text-sm">{error?.message || 'Please try refreshing the page'}</p>
  </div>
);

// Loading component for suspense
const ChatLoading = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
  </div>
);

// Chat component with Gemini API integration
const GeminiPersistentChat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    messages, 
    setMessages, 
    isOpen, 
    setIsOpen,
    showChatHistory,
    setShowChatHistory,
    websiteStatus
  } = useChat();
  
  const { saveMessages, saveMessagesWithWebsiteData } = useChatPersistence();
  
  const apiKey = "AIzaSyAUQZFNXyvEfsiaFTawgiyNq7aJyV8KzgE";
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      startTransition(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
    
    // Save messages to persistence
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        if (websiteStatus.isCreated) {
          saveMessagesWithWebsiteData(messages, websiteStatus);
        } else {
          saveMessages(messages);
        }
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages, saveMessages, saveMessagesWithWebsiteData, websiteStatus]);
  
  // Toggle chat visibility
  const toggleChat = () => {
    startTransition(() => {
      setIsOpen(!isOpen);
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { content: message.trim(), isUser: true };
    startTransition(() => {
      setMessages(prev => [...prev, userMessage]);
    });
    setMessage("");
    setIsLoading(true);

    const systemContext = `You are a website creation assistant for an agency, specialized in helping create websites using our template system. Your goal is to help users build websites based on our available templates:

1. Clean Slate - A minimalist black & white single-page template
2. Tradecraft - For trade businesses with blue & orange theme
3. Retail Ready - For retail stores with purple & pink theme
4. Service Pro - For service businesses with teal & green theme
5. Local Expert - For local professionals with amber & gold theme

Guide users through template selection, customization, and branding.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemContext + "\n\n" + message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      const data = await response.json();
      
      let generatedText = '';
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        generatedText = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        throw new Error(data.error.message || "Error from Gemini API");
      }

      const aiMessage = { content: generatedText, isUser: false };
      startTransition(() => {
        setMessages(prev => [...prev, aiMessage]);
      });
      
      toast({
        title: "Response received",
        description: "The assistant has responded to your message.",
      });
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
      
      startTransition(() => {
        setMessages(prev => [...prev, {
          content: "Sorry, I'm having trouble connecting to the AI service. Please try again later.",
          isUser: false
        }]);
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const ChatContent = () => (
    <Card className="w-[350px] shadow-lg border-primary z-50">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <h3 className="font-semibold">Website Assistant</h3>
        <div className="flex items-center gap-2">
          {typeof setShowChatHistory === 'function' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => startTransition(() => setShowChatHistory(!showChatHistory))}
            >
              {showChatHistory ? "New Chat" : "History"}
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggleChat}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 h-[400px] overflow-y-auto">
        <MessageList 
          messages={messages} 
          isLoading={isLoading || isPending} 
        />
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form className="flex w-full gap-2" onSubmit={handleSubmit}>
          <Textarea 
            placeholder="Ask me anything..." 
            className="min-h-[40px] flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading || isPending}
          />
          <Button type="submit" size="icon" disabled={isLoading || isPending}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {isOpen ? (
        <Suspense fallback={<ChatLoading />}>
          <ChatContent />
        </Suspense>
      ) : (
        <Button 
          onClick={toggleChat}
          className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </ErrorBoundary>
  );
};

export default GeminiPersistentChat;
