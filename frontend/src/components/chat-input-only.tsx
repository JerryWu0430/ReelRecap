"use client";

import React from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";

interface ChatInputOnlyProps {
  onSend: (message: string, files?: File[]) => void;
  isLoading: boolean;
}

export const ChatInputOnly: React.FC<ChatInputOnlyProps> = ({ onSend, isLoading }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <PromptInputBox 
        onSend={onSend}
        isLoading={isLoading}
        placeholder="Type your message here..."
        className="w-full"
      />
    </div>
  );
};