'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { selectLLM, generateResponse } from '@/lib/ai';
import { saveChat, getUserHistory } from '@/lib/database';
import { FiSend, FiImage } from 'react-icons/fi';
import { Message } from '@/types/chat';

export default function StudioChatInterface() {
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) loadUserHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const loadUserHistory = async () => {
    try {
      const history = await getUserHistory(user!.id, true); // true for isStudioChat
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading user history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await sendMessage(input);
  };

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    try {
      const selectedLLM = await selectLLM(content);
      const response = await generateResponse(selectedLLM, content, chatHistory);
      
      const newMessage: Message = { role: 'user', content, type: 'text' };
      let newResponse: Message;

      if (typeof response === 'string') {
        newResponse = { role: 'assistant', content: response, llm: selectedLLM, type: 'text' };
      } else {
        newResponse = { 
          role: 'assistant', 
          content: 'Here\'s the image you requested:', 
          llm: selectedLLM,
          type: 'image',
          url: response.url
        };
      }

      setChatHistory((prev) => [...prev, newMessage, newResponse]);
      await saveChat(user!.id, newMessage, newResponse, true); // true for isStudioChat
      setInput('');
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        type: 'text'
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((message, index) => (
          <div key={index} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block max-w-[70%] p-3 rounded-lg ${
                message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.type === 'image' && message.url && (
                <img 
                  src={message.url} 
                  alt="Generated" 
                  className="mb-2 max-w-full h-auto rounded"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    e.currentTarget.src = '/path/to/fallback/image.jpg'; // Optional: fallback image
                  }}
                />
              )}
              <p>{message.content}</p>
              {message.llm && (
                <p className="text-xs mt-1 opacity-75">via {message.llm.toUpperCase()}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-center text-gray-500">Processing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message or 'generate image: [prompt]' to create an image..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:opacity-80 transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            {input.toLowerCase().includes('generate image') ? <FiImage size={20} /> : <FiSend size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
}
