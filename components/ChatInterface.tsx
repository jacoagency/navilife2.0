'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { selectLLM, generateResponse } from '@/lib/ai';
import { saveChat, getUserHistory } from '@/lib/database';
import { FiSend } from 'react-icons/fi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  llm?: string;
}

export default function ChatInterface() {
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) loadUserHistory();
  }, [user]);

  const loadUserHistory = async () => {
    try {
      const history = await getUserHistory(user!.id);
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading user history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const selectedLLM = await selectLLM(input);
      const response = await generateResponse(selectedLLM, input, chatHistory);

      const newMessage: Message = { role: 'user', content: input };
      const newResponse: Message = { role: 'assistant', content: response, llm: selectedLLM };

      setChatHistory((prev) => [...prev, newMessage, newResponse]);
      await saveChat(user!.id, newMessage, newResponse);

      setInput('');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 space-y-4">
        {chatHistory.slice(-5).map((message, index) => (
          <div key={index} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-[70%] p-3 rounded-lg ${
              message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
            }`}>
              <p>{message.content}</p>
              {message.llm && <p className="text-xs mt-1 opacity-75">via {message.llm}</p>}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-gray-500">Thinking...</div>
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
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
