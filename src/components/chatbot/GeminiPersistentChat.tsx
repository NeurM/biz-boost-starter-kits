
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MessageList from './MessageList';
import WebsiteBuilder from './WebsiteBuilder';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { saveWebsiteConfig } from '@/utils/supabase';

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
    resetChat
  } = useChat();
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

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

           Focus on guiding the agency in improving:
           - Content organization and clarity
           - Call-to-action placement
           - Visual hierarchy
           - SEO optimization
           - User experience
           - Mobile responsiveness testing

           Be specific with practical advice that the agency can implement to improve their client's website.`
        : `You are a website creation assistant for an agency, specialized in helping create websites using our template system. Your goal is to help users build websites based on our available templates:

1. Clean Slate - A minimalist black & white single-page template
2. Tradecraft - For trade businesses with blue & orange theme
3. Retail Ready - For retail stores with purple & pink theme
4. Service Pro - For service businesses with teal & green theme
5. Local Expert - For local professionals with amber & gold theme

Guide users through template selection, customization, and branding. After gathering sufficient information about their business and preferences, conclude by saying "Your website has been created! You can now view your website by clicking the View Website button below." Include key details like: company name: "Business Name", domain: "domain.com", logo: "logo-url" in your response to trigger website creation.

Additionally, now that you've completed website creation, focus on guiding the agency in improving the website's sections and features.`
      : `You are a helpful assistant for visitors to our website creation platform. You help visitors understand our website template offerings:

1. Clean Slate - A minimalist black & white single-page template
2. Tradecraft - For trade businesses with blue & orange theme
3. Retail Ready - For retail stores with purple & pink theme
4. Service Pro - For service businesses with teal & green theme
5. Local Expert - For local professionals with amber & gold theme

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
      } else if (data.error) {
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
          colorScheme: null,
          secondaryColorScheme: null
        };
        
        setWebsiteStatus(newWebsiteStatus);
        
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

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
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
            {user ? "Website Building Assistant" : "Chat Assistant"}
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
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {!isMinimized && (
        <CardContent>
          <MessageList messages={messages} isLoading={isLoading} />
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
