
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, X, Minimize2, Maximize2, Code, History, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MessageList from './MessageList';
import WebsiteBuilder from './WebsiteBuilder';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { saveWebsiteConfig } from '@/utils/supabase';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useLanguage } from '@/context/LanguageContext';

const GeminiPersistentChat = () => {
  const { 
    messages, 
    setMessages, 
    input, 
    setInput, 
    isLoading, 
    setIsLoading, 
    isOpen, 
    setIsOpen, 
    isMinimized, 
    setIsMinimized,
    websiteStatus,
    setWebsiteStatus,
    resetChat,
    viewCode,
    showChatHistory,
    setShowChatHistory
  } = useChat();
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const { language } = useLanguage();
  
  // Define the API key as a constant in the component
  const apiKey = "AIzaSyAUQZFNXyvEfsiaFTawgiyNq7aJyV8KzgE";
  
  // Check and update auth state when component mounts or when user changes
  useEffect(() => {
    // Add null/undefined check for messages
    if (messages && messages.length > 0 && user) {
      // If user is logged in and the first message suggests they need to log in, update it
      if (messages[0].content.includes("To create a website, you'll need to sign up or log in")) {
        const updatedMessages = [...messages];
        updatedMessages[0] = {
          content: "Welcome agency partner! I'm here to help you create and improve websites for your clients. Let me know what type of business site you're building, and I'll guide you through template selection and customization.",
          isUser: false
        };
        setMessages(updatedMessages);
      }
    }
  }, [user, messages, setMessages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    trackEvent('Chat', 'Message Sent', 'User Message');

    const userMessage = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Create different system context based on auth status and website creation status
    const systemContext = user 
      ? websiteStatus.isCreated
        ? `You are a website improvement assistant for an agency. The website has already been created with these details:
           Template: ${websiteStatus.template}
           Company: ${websiteStatus.companyName}
           Domain: ${websiteStatus.domainName}
           Logo: ${websiteStatus.logo || 'Not specified'}

           Focus on guiding the agency in improving:
           - Content organization and clarity
           - Call-to-action placement
           - Visual hierarchy
           - SEO optimization
           - User experience
           - Mobile responsiveness testing

           The user's preferred language is: ${language}. Try to respond in this language when possible.

           IMPORTANT: DO NOT make up responses from the user. Wait for actual user input before responding. Do not provide sample responses. Always engage with what the user has actually typed.

           Be specific with practical advice that the agency can implement to improve their client's website.`
        : `You are a website creation assistant for an agency, specialized in helping create websites using our template system. Your goal is to help users build websites based on our available templates:

1. Clean Slate - A minimalist black & white single-page template
2. Tradecraft - For trade businesses with blue & orange theme
3. Retail Ready - For retail stores with purple & pink theme
4. Service Pro - For service businesses with teal & green theme
5. Local Expert - For local professionals with amber & gold theme

The user's preferred language is: ${language}. Try to respond in this language when possible.

IMPORTANT: DO NOT make up responses from the user. Wait for actual user input before responding. Do not provide sample responses or pretend to be waiting for a response. Always engage with what the user has actually typed.

The user is already logged in as an agency partner. They don't need to sign up or log in again.

Guide users through template selection, customization, and branding. After gathering sufficient information about their business and preferences, conclude by saying "Your website has been created! You can now view your website by clicking the View Website button below." Include key details like: company name: "Business Name", domain: "domain.com", logo: "logo-url" in your response to trigger website creation.`
      : `You are a helpful assistant for visitors to our website creation platform. You help visitors understand our website template offerings:

1. Clean Slate - A minimalist black & white single-page template
2. Tradecraft - For trade businesses with blue & orange theme
3. Retail Ready - For retail stores with purple & pink theme
4. Service Pro - For service businesses with teal & green theme
5. Local Expert - For local professionals with amber & gold theme

The user's preferred language is: ${language}. Try to respond in this language when possible.

IMPORTANT: DO NOT make up responses from the user. Wait for actual user input before responding. Do not provide sample responses or pretend to be waiting for a response. Always engage with what the user has actually typed.

Explain the benefits of our templates and encourage visitors to sign up to create their own website. Answer questions about our platform but avoid providing technical implementation details. If they ask about creating a website, suggest they sign up or log in first.`;

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
              parts: [{ text: systemContext + "\n\n" + input }]
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
        trackEvent('Chat', 'Message Received', 'AI Response');
      } else if (data.error) {
        trackEvent('Chat', 'Error', 'API Error');
        throw new Error(data.error.message || "Error from Gemini API");
      }

      // Update websiteStatus based on AI response (only for authenticated users)
      if (user && generatedText.toLowerCase().includes("your website has been created")) {
        const companyNameMatch = generatedText.match(/company name:?\s*["']([^"']+)["']/i);
        const domainMatch = generatedText.match(/domain:?\s*["']([^"']+)["']/i);
        const logoMatch = generatedText.match(/logo:?\s*["']([^"']+)["']/i);
        
        const cleanSlateMatch = generatedText.match(/clean slate/i);
        const tradecraftMatch = generatedText.match(/tradecraft/i);
        const retailReadyMatch = generatedText.match(/retail ready/i);
        const serviceProMatch = generatedText.match(/service pro/i);
        const localExpertMatch = generatedText.match(/local expert/i);
        
        let template = null;
        if (cleanSlateMatch) template = "cleanslate";
        else if (tradecraftMatch) template = "tradecraft";
        else if (retailReadyMatch) template = "retail";
        else if (serviceProMatch) template = "service";
        else if (localExpertMatch) template = "expert";
        
        const newWebsiteStatus = {
          isCreated: true,
          template,
          path: template ? `/${template}` : null,
          companyName: companyNameMatch ? companyNameMatch[1] : null,
          domainName: domainMatch ? domainMatch[1] : null,
          logo: logoMatch ? logoMatch[1] : null,
          colorScheme: websiteStatus.colorScheme,
          secondaryColorScheme: websiteStatus.secondaryColorScheme
        };
        
        setWebsiteStatus(newWebsiteStatus);
        trackEvent('Website', 'Created', template || 'unknown');
        
        // Store in session storage so template can access it
        sessionStorage.setItem('companyData', JSON.stringify({
          companyName: newWebsiteStatus.companyName,
          domainName: newWebsiteStatus.domainName,
          logo: newWebsiteStatus.logo,
          colorScheme: newWebsiteStatus.colorScheme,
          secondaryColorScheme: newWebsiteStatus.secondaryColorScheme
        }));
        
        if (user) {
          const saveConfig = async () => {
            try {
              await saveWebsiteConfig({
                template_id: template || '',
                company_name: newWebsiteStatus.companyName || '',
                domain_name: newWebsiteStatus.domainName || '',
                logo: newWebsiteStatus.logo || '',
                color_scheme: newWebsiteStatus.colorScheme,
                secondary_color_scheme: newWebsiteStatus.secondaryColorScheme
              });
            } catch (error) {
              console.error('Error saving website config:', error);
            }
          };
          
          saveConfig();
        }
        
        toast({
          title: "Website Created!",
          description: "Your website is ready to view.",
        });
      }

      const aiMessage = { content: generatedText, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHistory = () => {
    trackEvent('Chat', 'Toggle History', showChatHistory ? 'Hide' : 'Show');
    setShowChatHistory(!showChatHistory);
  };

  const handleResetChat = () => {
    trackEvent('Chat', 'Reset Chat');
    resetChat();
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen(true);
          trackEvent('Chat', 'Open Chat');
        }}
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
            Business Template Chat
          </CardTitle>
          <div className="flex gap-2">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 w-8 h-8 hover:bg-gray-100"
                onClick={toggleHistory}
                aria-label={showChatHistory ? "Hide History" : "Show History"}
                title={showChatHistory ? "Hide History" : "Show History"}
              >
                <History className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="p-0 w-8 h-8 hover:bg-gray-100"
              onClick={handleResetChat}
              aria-label="Reset Chat"
              title="Reset Chat"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 w-8 h-8 hover:bg-gray-100"
              onClick={viewCode}
              aria-label="View Code"
              title="View Code"
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 w-8 h-8"
              onClick={() => {
                setIsMinimized(!isMinimized);
                trackEvent('Chat', 'Toggle Size', isMinimized ? 'Maximize' : 'Minimize');
              }}
              aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 w-8 h-8"
              onClick={() => {
                setIsOpen(false);
                trackEvent('Chat', 'Close Chat');
              }}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {!isMinimized && (
        <CardContent>
          <MessageList messages={messages || []} isLoading={isLoading} />
          {user && websiteStatus.isCreated && (
            <WebsiteBuilder 
              websiteStatus={websiteStatus}
              onReset={resetChat}
            />
          )}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={user ? 
                "Ask about website templates or customization..." :
                "Ask about our website services..."}
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
        </CardContent>
      )}
    </Card>
  );
};

export default GeminiPersistentChat;
