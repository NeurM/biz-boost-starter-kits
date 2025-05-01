
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from '../components/chatbot/types';
import { useChatPersistence } from '@/hooks/useChatPersistence';

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showChatHistory: boolean;
  setShowChatHistory: React.Dispatch<React.SetStateAction<boolean>>;
  resetChat: () => void;
}

const defaultContext: ChatContextType = {
  messages: [],
  setMessages: () => {},
  isOpen: false,
  setIsOpen: () => {},
  showChatHistory: false,
  setShowChatHistory: () => {},
  resetChat: () => {},
};

const ChatContext = createContext<ChatContextType>(defaultContext);

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { savedMessages, saveMessages, clearSavedMessages } = useChatPersistence();
  const [messages, setMessages] = useState<Message[]>(savedMessages || []);
  const [isOpen, setIsOpen] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);

  // Update persistence when messages change
  React.useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages, saveMessages]);

  const resetChat = () => {
    setMessages([]);
    clearSavedMessages();
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        setMessages, 
        isOpen, 
        setIsOpen,
        showChatHistory,
        setShowChatHistory,
        resetChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
