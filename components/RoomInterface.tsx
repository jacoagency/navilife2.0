'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FiSend } from 'react-icons/fi';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function RoomInterface() {
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const chatSession = await axios.post(
        'https://agentivehub.com/api/chat/session',
        {
          "api_key": "a4212202-8972-48fc-a28e-6e284e9ecb69",
          "assistant_id": "014bd7d4-6dda-49c1-92f2-4fa2a11ed921",
        }
      );
      setSessionId(chatSession.data.session_id);
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !sessionId) return;
    setIsLoading(true);

    try {
      const newMessage: Message = { role: 'user', content: input };
      setMessages((prev) => [...prev, newMessage]);

      const chatResponse = {
        api_key: "a4212202-8972-48fc-a28e-6e284e9ecb69",
        session_id: sessionId,
        type: 'custom_code',
        assistant_id: "014bd7d4-6dda-49c1-92f2-4fa2a11ed921",
        messages: [newMessage],
      };

      const chat = await axios.post(
        'https://agentivehub.com/api/chat',
        chatResponse
      );

      const assistantMessage: Message = { role: 'assistant', content: chat.data.content };
      setMessages((prev) => [...prev, assistantMessage]);
      setInput('');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-[70%] p-3 rounded-lg ${
              message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
            }`}>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-gray-500">Processing...</div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={isLoading || !sessionId}
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out"
            disabled={isLoading || !sessionId}
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
