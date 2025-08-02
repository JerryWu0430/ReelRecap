"use client";

import React from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";

const DemoOne = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleSendMessage = (message: string, files?: File[]) => {
    if (!message.trim() && (!files || files.length === 0)) {
      setIsExpanded(false);
    }
  };

  const handleEnterPress = () => {
    setIsExpanded(true);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[radial-gradient(125%_125%_at_50%_101%,rgba(245,87,2,1)_10.5%,rgba(245,120,2,1)_16%,rgba(245,140,2,1)_17.5%,rgba(245,170,100,1)_25%,rgba(238,174,202,1)_40%,rgba(202,179,214,1)_65%,rgba(148,201,233,1)_100%)]">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Add your main content here */}
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
          />
        </div>
      </div>
    </div>
  );
};

export { DemoOne };
