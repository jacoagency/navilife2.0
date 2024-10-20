'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import ChatInterface from '@/components/ChatInterface';
import { saveChat } from '@/lib/database';
import { Message } from '@/types/chat';

export default function ChatPage() {
  const { user } = useUser();

  const handleNewMessage = async (message: Message, response: Message) => {
    if (user) {
      await saveChat(user.id, message, response, false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Chat</h1>
      </div>
      <div className="flex-1">
        <ChatInterface onNewMessage={handleNewMessage} isStudioChat={false} />
      </div>
    </div>
  );
}
