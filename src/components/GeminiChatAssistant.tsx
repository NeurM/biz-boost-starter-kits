
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, X, Minimize2, Maximize2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Message {
  content: string;
  isUser: boolean;
}

interface WebsiteStatus {
  isCreated: boolean;
  template: string | null;
  path: string | null;
}

const GeminiChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [websiteStatus, setWebsiteStatus] = useState<WebsiteStatus>({
    isCreated: false,
    template: null,
    path: null
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const apiKey = "AIzaSyAUQZFNXyvEfsiaFTawgiyNq7aJyV8KzgE";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Monitor messages for website creation indicators
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isUser) {
        // Check for template selection confirmation in AI responses
        const cleanSlateMatch = lastMessage.content.match(/clean slate/i);
        const tradecraftMatch = lastMessage.content.match(/tradecraft/i);
        const retailReadyMatch = lastMessage.content.match(/retail ready/i);
        const serviceProMatch = lastMessage.content.match(/service pro/i);
        const localExpertMatch = lastMessage.content.match(/local expert/i);
        
        const websiteCreationIndicators = [
          "Your website has been created",
          "website is ready",
          "You can now view your website",
          "successfully created your website"
        ];
        
        const isWebsiteCreated = websiteCreationIndicators.some(indicator => 
          lastMessage.content.toLowerCase().includes(indicator.toLowerCase())
        );
        
        if (isWebsiteCreated) {
          let template = websiteStatus.template;
          
          // If template wasn't set yet, try to determine it from the message
          if (!template) {
            if (cleanSlateMatch) template = "cleanslate";
            else if (tradecraftMatch) template = "tradecraft";
            else if (retailReadyMatch) template = "retail";
            else if (serviceProMatch) template = "service";
            else if (localExpertMatch) template = "expert";
            else template = "cleanslate"; // Default to Clean Slate
          }
          
          setWebsiteStatus({
            isCreated: true,
            template,
            path: `/${template}`
          });
          
          toast({
            title: "Website Created!",
            description: "Your website is ready to view.",
          });
        } else if (!websiteStatus.template) {
          // If just the template is mentioned but website not created yet
          if (cleanSlateMatch) {
            setWebsiteStatus(prev => ({ ...prev, template: "cleanslate" }));
          } else if (tradecraftMatch) {
            setWebsiteStatus(prev => ({ ...prev, template: "tradecraft" }));
          } else if (retailReadyMatch) {
            setWebsiteStatus(prev => ({ ...prev, template: "retail" }));
          } else if (serviceProMatch) {
            setWebsiteStatus(prev => ({ ...prev, template: "service" }));
          } else if (localExpertMatch) {
            setWebsiteStatus(prev => ({ ...prev, template: "expert" }));
          }
        }
      }
    }
  }, [messages, toast, websiteStatus.template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const systemContext = `You are a website creation assistant for an agency, specialized in helping create websites using our template system. Your goal is to help users build websites based on our available templates:

1. Clean Slate - A minimalist black & white single-page template
2. Tradecraft - For trade businesses with blue & orange theme
3. Retail Ready - For retail stores with purple & pink theme
4. Service Pro - For service businesses with teal & green theme
5. Local Expert - For local professionals with amber & gold theme

Guide users through:
- Template selection based on their business type
- Customization options and recommendations
- Content suggestions for their industry
- Best practices for website structure
- Color scheme and branding advice

Always provide agency-focused guidance, not end-user website visitor support. You're helping the agency build websites for their clients.

IMPORTANT: After 2-3 exchanges where the user has selected a template and discussed customizations, conclude by saying "Your website has been created based on our conversation! You can now view your website by clicking the View Website button below." This will trigger the website viewing functionality.`;

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
              parts: [
                {
                  text: systemContext + "\n\n" + input
                }
              ]
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

      console.log("Gemini API response status:", response.status);
      const data = await response.json();
      console.log("Gemini API response data:", data);
      
      let generatedText = '';
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        generatedText = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        throw new Error(data.error.message || "Error from Gemini API");
      }

      const aiMessage = {
        content: generatedText || "I'm here to help you create and customize your website using our templates. What type of business website would you like to build?",
        isUser: false
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
      setMessages(prev => [...prev, {
        content: "I apologize, but I'm having trouble connecting to the AI service. Please try asking your question again.",
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

  const resetWebsite = () => {
    setWebsiteStatus({
      isCreated: false,
      template: null,
      path: null
    });
    setMessages([]);
    toast({
      title: "Website Reset",
      description: "You can now start creating a new website."
    });
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
            Website Building Assistant
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
            {messages.length === 0 && (
              <div className="text-center text-gray-500">
                <p>👋 Hi! I'm your Website Building Assistant</p>
                <ul className="mt-2 space-y-1">
                  <li>• Ask about our website templates</li>
                  <li>• Get help with customization</li>
                  <li>• Learn best practices for your industry</li>
                  <li>• Get recommendations for your business</li>
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
            {websiteStatus.isCreated && websiteStatus.path && (
              <div className="flex justify-center my-4">
                <Button asChild className="flex gap-2 items-center" variant="dynamic">
                  <Link to={websiteStatus.path}>
                    <ExternalLink className="h-4 w-4" />
                    View Your Website
                  </Link>
                </Button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about website templates or customization..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          {websiteStatus.isCreated && (
            <div className="mt-3 text-right">
              <Button 
                onClick={resetWebsite}
                variant="outline"
                size="sm"
              >
                Create New Website
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default GeminiChatAssistant;
