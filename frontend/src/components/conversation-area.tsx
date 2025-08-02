"use client";

import React from "react";
import { ChatInterface } from "@/components/ui/chat-interface";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  files?: File[];
}

interface ConversationAreaProps {
  messages: Message[];
  isLoading: boolean;
}

export const ConversationArea: React.FC<ConversationAreaProps> = ({ messages, isLoading }) => {
  return (
    <div className="w-full h-full p-4 md:p-8">
      <div className="max-w-4xl mx-auto h-full">
        <div className="h-full flex flex-col">
          {/* Chat Messages Area */}
          <div className="flex-1 min-h-0">
            <ChatInterface 
              messages={messages} 
              isLoading={isLoading}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};