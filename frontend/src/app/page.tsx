"use client";

import React from "react";
import { ConversationArea } from "@/components/conversation-area";
import { ChatInputOnly } from "@/components/chat-input-only";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  files?: File[];
}

export default function Home() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

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

  return (
    <>
      {/* Conversation Area - Scrollable Top Section */}
      <ConversationArea messages={messages} isLoading={isLoading} />
      
      {/* Chat Input - Fixed Bottom Section */}
      <ChatInputPortal onSend={handleSendMessage} isLoading={isLoading} />
    </>
  );
}

// Portal component to render chat input in the bottom container
function ChatInputPortal({ onSend, isLoading }: { onSend: (message: string, files?: File[]) => void; isLoading: boolean }) {
  React.useEffect(() => {
    const inputContainer = document.getElementById('chat-input-container');
    if (inputContainer) {
      inputContainer.innerHTML = '';
      const inputElement = document.createElement('div');
      inputElement.className = 'w-full';
      inputContainer.appendChild(inputElement);
      
      const { createRoot } = require('react-dom/client');
      const root = createRoot(inputElement);
      root.render(React.createElement(ChatInputOnly, { onSend, isLoading }));
      
      return () => {
        root.unmount();
      };
    }
  }, [onSend, isLoading]);

  return null;
}