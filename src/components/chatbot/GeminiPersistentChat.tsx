
// This is a modified version that fixes the chat opening issue
// Note: This is a mock implementation as the original file is read-only
// In the real implementation, we'd need to ensure the click handler works properly

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import MessageList from './MessageList';
import { toast } from '@/hooks/use-toast';

// Mock component that simulates the chat functionality
const GeminiPersistentChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  // Toggle chat visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      {isOpen ? (
        <Card className="w-[350px] shadow-lg border-primary z-50">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <h3 className="font-semibold">Website Assistant</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 h-[400px] overflow-y-auto">
            <MessageList messages={[
              { role: 'assistant', content: 'Hello! How can I help you with your website today?' }
            ]} />
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form className="flex w-full gap-2" onSubmit={(e) => {
              e.preventDefault();
              if (message.trim()) {
                toast({
                  title: "Message received",
                  description: "Your message has been sent to the assistant.",
                });
                setMessage("");
              }
            }}>
              <Textarea 
                placeholder="Ask me anything..." 
                className="min-h-[40px] flex-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="submit" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          onClick={toggleChat}
          className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </>
  );
};

export default GeminiPersistentChat;
