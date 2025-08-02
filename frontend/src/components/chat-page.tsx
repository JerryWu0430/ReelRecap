"use client";

import React from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { ChatInterface } from "@/components/ui/chat-interface";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  files?: File[];
}

export const ChatPage = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Clear any potential unwanted content on mount
  React.useEffect(() => {
    setMessages([]);
  }, []);

  const generateResponse = async (userMessage: string, files?: File[]) => {
    setIsLoading(true);
    
    try {
      // Prepare files data for API (just metadata for now)
      const fileData = files?.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      })) || [];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          files: fileData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: Date.now().toString() + "_assistant",
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Simple fallback message if API fails
      const errorMessage: Message = {
        id: Date.now().toString() + "_error",
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (message: string, files?: File[]) => {
    if (message.trim() || (files && files.length > 0)) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        role: "user",
        timestamp: new Date(),
        files: files || [],
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Generate response
      generateResponse(message, files);
    }
  };

  const handleEnterPress = () => {
    setIsExpanded(true);
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Chat Interface */}
      <div className={`flex-1 transition-all duration-1000 ease-in-out ${
        isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`h-full transition-all duration-1000 ease-in-out ${
          isExpanded ? 'px-4 md:px-8 lg:px-16 pb-24' : 'px-4 md:px-8 lg:px-16'
        }`}>
          <ChatInterface 
            messages={messages} 
            isLoading={isLoading}
            className="h-full max-w-4xl mx-auto"
          />
        </div>
      </div>
      
      {/* Animated prompt box container */}
      <div 
        className={`fixed left-1/2 transition-all duration-2000 ease-in-out ${
          isExpanded 
            ? 'bottom-0 w-full -translate-x-1/2 p-4' 
            : 'top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] p-4'
        }`}
      >
        <div 
          className={`transition-all duration-1000 ease-in-out mx-auto ${
            isExpanded ? 'max-w-[800px] w-full' : 'w-full'
          }`}
        >
          <PromptInputBox 
            onSend={handleSendMessage}
            onEnterPress={handleEnterPress}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};