'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import * as fal from "@fal-ai/serverless-client";

// Use NEXT_PUBLIC_FAL_KEY instead of FAL_KEY
fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'image';
  url?: string;
}

interface FalResult {
  images?: { url: string }[];
}

export default function StudioChatInterface() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await generateImage(input);
  };

  const generateImage = async (prompt: string) => {
    setIsLoading(true);
    try {
      const userMessage: Message = { role: 'user', content: prompt, type: 'text' };
      setChatHistory((prev) => [...prev, userMessage]);

      console.log('Generating image with prompt:', prompt);

      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.imageUrl) {
        const newResponse: Message = { 
          role: 'assistant', 
          content: 'Here\'s the image you requested:', 
          type: 'image',
          url: result.imageUrl
        };
        setChatHistory((prev) => [...prev, newResponse]);
      } else {
        throw new Error('No image URL in response');
      }

      setInput('');
    } catch (error) {
      console.error('Error generating image:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, there was an error generating the image: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
            </div>
          </div>
        ))}
        {isLoading && <div className="text-center text-gray-500">Generating image...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the image you want to generate..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:opacity-80 transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
