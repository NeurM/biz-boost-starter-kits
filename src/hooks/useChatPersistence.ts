
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Message, WebsiteStatus } from '@/components/chatbot/types';
import { Json } from '@/integrations/supabase/types';

export const useChatPersistence = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  websiteStatus: WebsiteStatus,
  setWebsiteStatus: React.Dispatch<React.SetStateAction<WebsiteStatus>>,
  showChatHistory: boolean
) => {
  const { user } = useAuth();

  // Load messages from Supabase when user logs in or showChatHistory changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !showChatHistory) return;

      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading chat messages:', error);
          return;
        }

        if (data && data.length > 0) {
          // Convert database records to Message objects
          const loadedMessages = data.map(record => ({
            content: record.content,
            isUser: record.is_user
          }));
          
          setMessages(loadedMessages);
          
          // If we have website data in the last message, use it
          const lastMessageWithData = data
            .filter(msg => msg.website_data)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
            
          if (lastMessageWithData && lastMessageWithData.website_data) {
            // Cast to unknown first, then to WebsiteStatus to avoid direct type assignment error
            const websiteData = lastMessageWithData.website_data as unknown as WebsiteStatus;
            if (websiteData && typeof websiteData === 'object' && 'isCreated' in websiteData) {
              setWebsiteStatus(websiteData);
            }
          }
        } else if (showChatHistory) {
          // If showing history but no messages found, show a message about that
          setMessages([{
            content: "No chat history found. Let's start a new conversation!",
            isUser: false
          }]);
        }
      } catch (err) {
        console.error('Error in loadMessages:', err);
      }
    };

    if (showChatHistory) {
      loadMessages();
    } else if (user && messages.length === 0) {
      // If not showing history, just show welcome message
      setMessages([{
        content: "Welcome agency partner! I'm here to help you create and improve websites for your clients. Let me know what type of business site you're building, and I'll guide you through template selection and customization.",
        isUser: false
      }]);
    } else if (!user && messages.length === 0) {
      setMessages([{
        content: "Welcome! I can help you explore our website templates and answer any questions you might have about our services. To create a website, you'll need to sign up or log in.",
        isUser: false
      }]);
    }
  }, [user, showChatHistory]);

  // Save messages to Supabase when they change
  useEffect(() => {
    const saveMessages = async () => {
      if (!user || messages.length === 0) return;

      // Get the last message
      const lastMessage = messages[messages.length - 1];
      
      try {
        // Convert websiteStatus to Json compatible format before saving
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
        console.error('Error saving chat message:', err);
      }
    };

    // Only save if the user is logged in and there are messages
    if (user && messages.length > 0) {
      saveMessages();
    }
  }, [messages.length]);

  return null;
};
