
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  content: string;
  isUser: boolean;
}

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          messages: [...messages, userMessage].map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        }
      });

      if (error) throw error;

      const aiMessage = {
        content: data.choices[0].message.content,
        isUser: false
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        content: "Sorry, I'm having trouble connecting. Please try again.",
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 bg-primary hover:bg-primary/90"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 shadow-lg transition-all duration-300 ${
      isMinimized ? 'w-72' : 'w-full max-w-md'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            AI Assistant
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 w-8 h-8"
              onClick={toggleMinimize}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 w-8 h-8"
              onClick={toggleChat}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {!isMinimized && (
        <CardContent>
          <div className="h-[300px] overflow-y-auto mb-4 space-y-4 p-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500">
                <p>👋 Hi! I can help you with:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Choosing the right template</li>
                  <li>• Customizing your website</li>
                  <li>• Code development</li>
                  <li>• Technical questions</li>
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
                <div className="bg-muted text-foreground p-3 rounded-lg">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
};

export default ChatBox;
