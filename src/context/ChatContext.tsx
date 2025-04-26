
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
  showChatHistory: boolean;
  setShowChatHistory: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [showChatHistory, setShowChatHistory] = useState(false);
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

  useChatPersistence(messages, setMessages, websiteStatus, setWebsiteStatus, showChatHistory);

  const viewCode = () => {
    const devModeToggle = document.querySelector('[data-testid="dev-mode-toggle"]') as HTMLButtonElement;
    if (devModeToggle) {
      devModeToggle.click();
    } else {
      console.log("Could not find dev mode toggle. Dev mode may not be available.");
      alert("Developer mode is not currently available. Please try again later.");
    }
  };

  useEffect(() => {
    if (messages.length === 0 || (user && messages[0].content.includes("sign up or log in"))) {
      const initialMessage: Message = user ? 
        {
          content: "Welcome agency partner! I'm here to help you create and improve websites for your clients. Let me know what type of business site you're building, and I'll guide you through template selection and customization.",
          isUser: false
        } : 
        {
          content: "Welcome! I can help you explore our website templates and answer any questions you might have about our services. To create a website, you'll need to sign up or log in.",
          isUser: false
        };
      
      setMessages([initialMessage]);
    }
  }, [user, showChatHistory]);

  useEffect(() => {
    if (messages.length > 0) {
      if (user && messages[0].content.includes("To create a website, you'll need to sign up or log in")) {
        const updatedMessages = [...messages];
        updatedMessages[0] = {
          content: "Welcome agency partner! I'm here to help you create and improve websites for your clients. Let me know what type of business site you're building, and I'll guide you through template selection and customization.",
          isUser: false
        };
        setMessages(updatedMessages);
      } else if (!user && messages[0].content.includes("Welcome agency partner!")) {
        const updatedMessages = [...messages];
        updatedMessages[0] = {
          content: "Welcome! I can help you explore our website templates and answer any questions you might have about our services. To create a website, you'll need to sign up or log in.",
          isUser: false
        };
        setMessages(updatedMessages);
      }
    }
  }, [user, messages]);
  
  const resetChat = () => {
    sessionStorage.removeItem('companyData');
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
        content: "Welcome agency partner! What kind of website would you like to create now?",
        isUser: false
      } : 
      {
        content: "Welcome! How can I help you today?",
        isUser: false
      };
    
    setMessages([initialMessage]);
    setShowChatHistory(false);
  };

  useEffect(() => {
    if (isMinimized) {
      sessionStorage.setItem('chatState', JSON.stringify({
        messages,
        isOpen,
        isMinimized,
        websiteStatus,
        showChatHistory
      }));
    }
  }, [isMinimized, messages, isOpen, websiteStatus, showChatHistory]);

  useEffect(() => {
    const savedState = sessionStorage.getItem('chatState');
    if (savedState) {
      const { 
        messages: savedMessages, 
        isOpen: savedIsOpen, 
        isMinimized: savedIsMinimized, 
        websiteStatus: savedWebsiteStatus,
        showChatHistory: savedShowChatHistory
      } = JSON.parse(savedState);
      
      setMessages(savedMessages);
      setIsOpen(savedIsOpen);
      setIsMinimized(savedIsMinimized);
      setWebsiteStatus(savedWebsiteStatus);
      setShowChatHistory(savedShowChatHistory || false);
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
        viewCode,
        showChatHistory,
        setShowChatHistory
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
