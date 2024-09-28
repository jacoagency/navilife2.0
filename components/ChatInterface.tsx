"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { selectLLM, generateResponse } from '@/lib/ai';
import { saveChat, getUserHistory } from '@/lib/database';

export default function ChatInterface() {
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserHistory();
    }
  }, [user]);

  const loadUserHistory = async () => {
    try {
      const history = await getUserHistory(user!.id);
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading user history:', error);
      setError('Failed to load chat history');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const selectedLLM = await selectLLM(input);
      console.log('LLM selected for this input:', selectedLLM);
      
      const formattedHistory = chatHistory
        .filter(msg => msg.content != null)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      console.log('Formatted history:', JSON.stringify(formattedHistory));
      
      const response = await generateResponse(selectedLLM, input, formattedHistory);

      const newMessage = { role: 'user', content: input };
      const newResponse = { role: 'assistant', content: response, llm: selectedLLM };

      setChatHistory([...chatHistory, newMessage, newResponse]);
      await saveChat(user!.id, newMessage, newResponse);

      setInput('');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError('Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {chatHistory.map((message, index) => (
          <div key={index} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.content}
            </div>
            {message.llm && <div className="text-xs text-gray-500 mt-1">Powered by {message.llm}</div>}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border rounded-lg"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg" disabled={isLoading}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}