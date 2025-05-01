
import { useState, useTransition } from 'react';
import { Message, WebsiteStatus } from '@/components/chatbot/types';
import { useToast } from "@/hooks/use-toast";
import { sendMessageToGemini, extractWebsiteInfo } from '@/services/geminiService';
import { saveWebsiteConfig } from '@/utils/supabase';

export const useGeminiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [websiteStatus, setWebsiteStatus] = useState<WebsiteStatus>({
    isCreated: false,
    template: null,
    path: null,
    companyName: null,
    domainName: null,
    logo: null,
    colorScheme: null,
    secondaryColorScheme: null
  });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { content: input, isUser: true };
    startTransition(() => {
      setMessages(prev => [...prev, userMessage]);
    });
    setInput('');
    setIsLoading(true);

    try {
      const generatedText = await sendMessageToGemini(input);
      
      // Update websiteStatus based on AI response
      if (generatedText.toLowerCase().includes("your website has been created")) {
        const newWebsiteInfo = extractWebsiteInfo(generatedText);
        const newWebsiteStatus = {
          ...websiteStatus,
          ...newWebsiteInfo,
        };
        
        startTransition(() => {
          setWebsiteStatus(newWebsiteStatus);
        });
        
        const saveConfig = async () => {
          try {
            await saveWebsiteConfig({
              template_id: newWebsiteStatus.template || '',
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
      startTransition(() => {
        setMessages(prev => [...prev, aiMessage]);
      });
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

  const resetWebsite = () => {
    sessionStorage.removeItem('companyData');
    startTransition(() => {
      setWebsiteStatus({
        isCreated: false,
        template: null,
        path: null,
        companyName: null,
        domainName: null,
        logo: null,
        colorScheme: null,
        secondaryColorScheme: null
      });
      setMessages([]);
    });
    toast({
      title: "Website Reset",
      description: "You can now start creating a new website."
    });
  };

  return {
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
  };
};
