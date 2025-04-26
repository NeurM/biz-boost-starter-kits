
import { useEffect } from 'react';
import { Message, WebsiteStatus } from '@/components/chatbot/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from './use-toast';

export const useChatPersistence = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  websiteStatus: WebsiteStatus
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Load messages on initial mount
  useEffect(() => {
    const loadMessages = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          setMessages(data.map(msg => ({
            content: msg.content,
            isUser: msg.is_user
          })));
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive"
        });
      }
    };

    loadMessages();
  }, [user]);

  // Save new messages
  useEffect(() => {
    const saveMessage = async (message: Message) => {
      if (!user) return;
      
      try {
        // Convert websiteStatus to a plain object to satisfy Json type requirement
        const websiteDataJson = message.isUser ? null : {
          isCreated: websiteStatus.isCreated,
          template: websiteStatus.template,
          path: websiteStatus.path,
          companyName: websiteStatus.companyName,
          domainName: websiteStatus.domainName,
          logo: websiteStatus.logo,
          colorScheme: websiteStatus.colorScheme,
          secondaryColorScheme: websiteStatus.secondaryColorScheme
        };
        
        const { error } = await supabase
          .from('chat_messages')
          .insert({
            content: message.content,
            is_user: message.isUser,
            user_id: user.id,
            website_data: websiteDataJson
          });
          
        if (error) throw error;
      } catch (error) {
        console.error('Error saving message:', error);
        toast({
          title: "Error",
          description: "Failed to save message",
          variant: "destructive"
        });
      }
    };

    // Only save the last message if it exists
    if (messages.length > 0) {
      saveMessage(messages[messages.length - 1]);
    }
  }, [messages, user, websiteStatus]);
};
