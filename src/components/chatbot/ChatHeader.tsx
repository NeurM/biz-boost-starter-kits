
import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";

interface ChatHeaderProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  isMinimized, 
  onMinimize, 
  onClose 
}) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg font-medium flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Website Building Assistant
      </CardTitle>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 w-8 h-8"
          onClick={onMinimize}
          aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
        >
          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 w-8 h-8"
          onClick={onClose}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
