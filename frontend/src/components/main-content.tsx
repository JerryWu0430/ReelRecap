"use client";

import React from "react";

export const MainContent = () => {
  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">ReelRecap</h1>
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Welcome to ReelRecap</h2>
          <p className="text-white/80 mb-4">
            Your AI-powered video analysis and conversation platform. Upload videos, ask questions, 
            and get intelligent insights powered by Claude AI.
          </p>
          <ul className="space-y-2 text-white/70">
            <li>• Upload and analyze video content</li>
            <li>• Chat with AI about your videos</li>
            <li>• Get intelligent summaries and insights</li>
            <li>• Interactive conversation interface</li>
          </ul>
        </div>
      </div>
    </div>
  );
};