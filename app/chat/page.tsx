'use client';

import { useUser } from '@clerk/nextjs';
import ChatInterface from '@/components/ChatInterface';
import { saveChat } from '@/lib/database';
import { Message } from '@/types/chat';
import { FiMessageSquare } from 'react-icons/fi';

export default function ChatPage() {
  const { user } = useUser();

  const handleNewMessage = async (message: Message, response: Message) => {
    if (user) {
      await saveChat(user.id, message, response, false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-navy-900">
      <div className="p-6 border-b border-navy-800">
        <div className="flex items-center space-x-3">
          <FiMessageSquare className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Chat with AI
          </h1>
        </div>
        <p className="mt-2 text-gray-400">Start a conversation with our advanced AI assistant</p>
      </div>
      <div className="flex-1 bg-gradient-to-b from-navy-900 to-navy-800">
        <div className="h-full max-w-6xl mx-auto px-4">
          <ChatInterface onNewMessage={handleNewMessage} isStudioChat={false} />
        </div>
      </div>
    </div>
  );
}
