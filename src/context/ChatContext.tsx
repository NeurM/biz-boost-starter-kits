
import React, { createContext, useContext, useState, ReactNode, useTransition, useEffect } from 'react';
import { Message, WebsiteStatus } from '../components/chatbot/types';
import { useChatPersistence } from '../hooks/useChatPersistence';
import { ErrorBoundary } from 'react-error-boundary';

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

const ErrorFallback = ({error}: {error?: Error}) => (
  <div className="p-4 text-red-500 bg-red-50 rounded-md">
    <h4 className="font-medium mb-2">Chat Context Error</h4>
    <p className="text-sm">{error?.message || 'An error occurred in the chat system'}</p>
  </div>
);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [isPending, startTransition] = useTransition();
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

  const { savedMessages, saveMessages, saveMessagesWithWebsiteData, clearSavedMessages } = useChatPersistence();

  // Create a simple function to reset the chat
  const resetChat = () => {
    startTransition(() => {
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
      clearSavedMessages();
    });
  };

  // Load saved messages from persistence hook
  useEffect(() => {
    if (savedMessages.length > 0 && messages.length === 0) {
      startTransition(() => {
        setMessages(savedMessages);
      });
    }
  }, [savedMessages, messages.length]);

  // Initialize with welcome message if no messages
  useEffect(() => {
    if (messages.length === 0 && savedMessages.length === 0) {
      startTransition(() => {
        setMessages([{
          content: "Welcome! I'm here to help you create and improve websites for your clients. Let me know what type of business site you're building.",
          isUser: false
        }]);
      });
    }
  }, [messages, savedMessages]);

  // Save messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      // Use setTimeout to prevent blocking the main thread
      const saveMessagesTimeout = setTimeout(() => {
        if (websiteStatus.isCreated) {
          saveMessagesWithWebsiteData(messages, websiteStatus);
        } else {
          saveMessages(messages);
        }
      }, 0);
      
      return () => clearTimeout(saveMessagesTimeout);
    }
  }, [messages, websiteStatus, saveMessages, saveMessagesWithWebsiteData]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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
    </ErrorBoundary>
  );
};
