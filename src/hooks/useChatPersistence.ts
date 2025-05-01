
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Message, WebsiteStatus } from '@/components/chatbot/types';
import { Json } from '@/integrations/supabase/types';

export const useChatPersistence = () => {
  const { user } = useAuth();
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);

  // Load messages from Supabase when user logs in
  useEffect(() => {
    const loadMessages = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading chat messages:', error);
          return [];
        }

        if (data && data.length > 0) {
          // Convert database records to Message objects
          const loadedMessages = data.map(record => ({
            content: record.content,
            isUser: record.is_user
          }));
          
          setSavedMessages(loadedMessages);
          return loadedMessages;
        }
        return [];
      } catch (err) {
        console.error('Error in loadMessages:', err);
        return [];
      }
    };

    loadMessages();
  }, [user]);

  // Function to save messages to Supabase
  const saveMessages = async (messages: Message[]) => {
    if (!user || !messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    
    try {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        content: lastMessage.content,
        is_user: lastMessage.isUser
      });
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
  };

  // Function to save messages with website data
  const saveMessagesWithWebsiteData = async (messages: Message[], websiteStatus: WebsiteStatus) => {
    if (!user || !messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    
    try {
      const websiteData = websiteStatus.isCreated ? 
        JSON.parse(JSON.stringify(websiteStatus)) as Json : 
        null;
        
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        content: lastMessage.content,
        is_user: lastMessage.isUser,
        website_data: websiteData
      });
    } catch (err) {
      console.error('Error saving chat message with website data:', err);
    }
  };

  // Clear saved messages
  const clearSavedMessages = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user.id);
        
      setSavedMessages([]);
    } catch (err) {
      console.error('Error clearing chat messages:', err);
    }
  };

  return {
    savedMessages,
    saveMessages,
    saveMessagesWithWebsiteData,
    clearSavedMessages
  };
};
