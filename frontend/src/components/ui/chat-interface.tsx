"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, MessageCircle } from "lucide-react";

// Utility function for className merging
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  files?: File[];
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}

const MessageBubble: React.FC<{ message: Message; isLoading?: boolean }> = ({ message, isLoading }) => {
  const isUser = message.role === "user";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex w-full px-4 py-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-2 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Files Display */}
        {message.files && message.files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/5 w-fit px-3 py-1 rounded-3xl border border-white/10"
              >
                <FileUp className="w-4 h-4 text-gray-300" />
                <span className="text-sm text-gray-300">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "rounded-3xl px-4 py-3 max-w-full break-words border",
            isUser
              ? "bg-[#1F2023] text-gray-100 border-[#444444]"
              : "bg-[#1F2023] text-gray-100 border-[#444444]"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const TypingIndicator: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex w-full px-4 py-4 justify-start"
  >
    <div className="flex items-center gap-2">
      <div className="flex gap-1 bg-[#1F2023] border border-[#444444] rounded-3xl px-4 py-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading = false,
  className
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full bg-transparent relative z-10",
        className
      )}
    >
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar bg-transparent"
           style={{
             scrollbarWidth: 'thin',
             scrollbarColor: '#444444 transparent'
           }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400 max-w-md px-4">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
              <p className="text-sm">
                Upload a video file or type a message to begin chatting.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                />
              ))}
              {isLoading && <TypingIndicator />}
            </AnimatePresence>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};