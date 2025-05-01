
import React, { memo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}

// Memoize the component to prevent unnecessary re-renders
const ChatInput: React.FC<ChatInputProps> = memo(({ 
  value, 
  onChange, 
  onSubmit, 
  disabled 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && value.trim()) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={value}
        onChange={onChange}
        placeholder="Ask about website templates or customization..."
        className="flex-1"
        disabled={disabled}
      />
      <Button 
        type="submit" 
        disabled={disabled || !value.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
