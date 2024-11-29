'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSend, FiImage, FiDownload } from 'react-icons/fi';
import * as fal from "@fal-ai/serverless-client";
import Image from 'next/image';

fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'image';
  url?: string;
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

      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.imageUrl) {
        const newResponse: Message = { 
          role: 'assistant', 
          content: 'Here\'s your generated image:', 
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

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((message, index) => (
          <div key={index} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block max-w-[70%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-gray-200' 
                  : 'bg-navy-800 text-gray-200'
              }`}
            >
              {message.type === 'image' && message.url && (
                <div className="mb-3 relative group">
                  <button
                    onClick={() => handleDownload(message.url!)}
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200
                             hover:bg-black/70 text-white"
                    title="Download image"
                  >
                    <FiDownload size={16} />
                  </button>
                  <Image 
                    src={message.url} 
                    alt="Generated" 
                    className="rounded-lg shadow-lg max-w-full h-auto"
                    width={500}
                    height={300}
                    onError={() => console.error('Image failed to load')}
                  />
                </div>
              )}
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400 mx-auto mb-2"></div>
            <p>Generating your masterpiece...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-navy-800">
        <div className="flex items-center space-x-2">
          <div className="flex-grow relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FiImage className="text-gray-400" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 pl-10 bg-navy-800 border border-navy-700 text-gray-200 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder-gray-400"
              placeholder="Describe the image you want to generate..."
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                     hover:opacity-90 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
