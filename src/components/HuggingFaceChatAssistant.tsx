
import React, { useState, useRef, useEffect } from 'react';
import { pipeline } from "@huggingface/transformers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  content: string;
  isUser: boolean;
}

const HuggingFaceChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatModel, setChatModel] = useState<any>(null);
  const [modelError, setModelError] = useState<string | null>(null);

  useEffect(() => {
    const initModel = async () => {
      try {
        // Using text-generation instead of conversational
        const model = await pipeline(
          'text-generation', 
          'distilgpt2',
          { device: 'cpu' } // Using CPU as fallback if webGPU isn't available
        );
        setChatModel(model);
        setModelError(null);
      } catch (error) {
        console.error('Failed to load chat model:', error);
        setModelError("Failed to load the AI model. Please check your browser compatibility.");
      }
    };

    initModel();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatModel) return;

    const userMessage = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Text generation request
      const response = await chatModel(input, { 
        max_length: 100,
        do_sample: true,
        top_k: 50,
        top_p: 0.95,
        temperature: 0.7,
        num_return_sequences: 1
      });

      // Extract the generated text from the response
      let generatedText = '';
      if (Array.isArray(response) && response.length > 0) {
        generatedText = response[0]?.generated_text || '';
        // Remove the input prompt from the response
        if (generatedText.startsWith(input)) {
          generatedText = generatedText.substring(input.length).trim();
        }
      }

      const aiMessage = {
        content: generatedText || "I'm not sure how to respond to that.",
        isUser: false
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        content: "Sorry, I had trouble generating a response. Please try again.",
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

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 bg-primary hover:bg-primary/90 shadow-lg z-50"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 shadow-lg transition-all duration-300 z-50 ${
      isMinimized ? 'w-72' : 'w-full max-w-md'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Hugging Face AI
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 w-8 h-8"
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 w-8 h-8"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {!isMinimized && (
        <CardContent>
          <div className="h-[300px] overflow-y-auto mb-4 space-y-4 p-4 border rounded-md bg-background">
            {messages.length === 0 && !modelError && (
              <div className="text-center text-gray-500">
                <p>👋 Hi! I'm a Hugging Face AI assistant</p>
                <ul className="mt-2 space-y-1">
                  <li>• Chat with me about anything</li>
                  <li>• Powered by open-source AI</li>
                  <li>• Running completely in your browser</li>
                </ul>
              </div>
            )}
            {modelError && (
              <div className="text-center text-red-500">
                <p>{modelError}</p>
                <p className="mt-2 text-sm">Try using a different browser or device.</p>
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
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading || !chatModel || !!modelError}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !chatModel || !!modelError}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
};

export default HuggingFaceChatAssistant;
