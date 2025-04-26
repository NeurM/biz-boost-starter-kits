
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Message, WebsiteStatus } from '../components/chatbot/types';
import { useChatPersistence } from '@/hooks/useChatPersistence';

interface ChatContextProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  websiteStatus: WebsiteStatus;
  setWebsiteStatus: React.Dispatch<React.SetStateAction<WebsiteStatus>>;
  resetChat: () => void;
  viewCode: () => void;
}

const ChatContext = createContext<ChatContextProps>({} as ChatContextProps);

export const useChat = () => useContext(ChatContext);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { user } = useAuth();
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

  useChatPersistence(messages, setMessages, websiteStatus);

  // Function to toggle dev mode to view code
  const viewCode = () => {
    const devModeToggle = document.querySelector('[data-testid="dev-mode-toggle"]') as HTMLButtonElement;
    if (devModeToggle) {
      devModeToggle.click();
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: Message = user ? 
        {
          content: "Welcome agency partner! I'm here to help you create and improve websites for your clients. Let me know what type of business site you're building, and I'll guide you through template selection and customization. After creating the website, I can help you optimize:\n\n- Content organization and clarity\n- Call-to-action placement\n- Visual hierarchy\n- SEO optimization\n- User experience\n- Mobile responsiveness",
          isUser: false
        } : 
        {
          content: "Welcome! I can help you explore our website templates and answer any questions you might have about our services.",
          isUser: false
        };
      
      setMessages([initialMessage]);
    }
  }, [user, messages.length]);
  
  const resetChat = () => {
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
    
    const initialMessage: Message = user ? 
      {
        content: "Chat reset. What kind of website would you like to create now?",
        isUser: false
      } : 
      {
        content: "Chat reset. How can I help you today?",
        isUser: false
      };
    
    setMessages([initialMessage]);
  };

  useEffect(() => {
    if (isMinimized) {
      sessionStorage.setItem('chatState', JSON.stringify({
        messages,
        isOpen,
        isMinimized,
        websiteStatus
      }));
    }
  }, [isMinimized, messages, isOpen, websiteStatus]);

  useEffect(() => {
    const savedState = sessionStorage.getItem('chatState');
    if (savedState) {
      const { messages: savedMessages, isOpen: savedIsOpen, 
              isMinimized: savedIsMinimized, websiteStatus: savedWebsiteStatus } = JSON.parse(savedState);
      setMessages(savedMessages);
      setIsOpen(savedIsOpen);
      setIsMinimized(savedIsMinimized);
      setWebsiteStatus(savedWebsiteStatus);
      sessionStorage.removeItem('chatState');
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
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
        viewCode
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
