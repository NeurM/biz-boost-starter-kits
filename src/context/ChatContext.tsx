
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message, WebsiteStatus } from '../components/chatbot/types';

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showChatHistory: boolean;
  setShowChatHistory: React.Dispatch<React.SetStateAction<boolean>>;
  resetChat: () => void;
  websiteStatus: WebsiteStatus;
  setWebsiteStatus: React.Dispatch<React.SetStateAction<WebsiteStatus>>;
}

const defaultContext: ChatContextType = {
  messages: [],
  setMessages: () => {},
  isOpen: false,
  setIsOpen: () => {},
  showChatHistory: false,
  setShowChatHistory: () => {},
  resetChat: () => {},
  websiteStatus: {
    isCreated: false,
    template: null,
    path: null,
    companyName: null,
    domainName: null,
    logo: null,
    colorScheme: null,
    secondaryColorScheme: null
  },
  setWebsiteStatus: () => {}
};

const ChatContext = createContext<ChatContextType>(defaultContext);

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
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

  // Create a simple function to reset the chat
  const resetChat = () => {
    setMessages([]);
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
  };

  // Initialize with welcome message if no messages
  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        content: "Welcome! I'm here to help you create and improve websites for your clients. Let me know what type of business site you're building.",
        isUser: false
      }]);
    }
  }, []);

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        setMessages, 
        isOpen, 
        setIsOpen,
        showChatHistory,
        setShowChatHistory,
        resetChat,
        websiteStatus,
        setWebsiteStatus
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
