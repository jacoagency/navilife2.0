'use client';

import { useState, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function StudioChatInterface() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setIsLoading(true);

    const newMessage: Message = { role: 'user', content: input };
    setChatHistory(prev => [...prev, newMessage]);
    setInput('');

    try {
      const response = await fetch('https://hook.us1.make.com/crbgyv89g9lotfraq5fcqxhxx1d1o2f7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Webhook response:', responseText); // Log the entire response

      let assistantContent: string;
      try {
        // Try to parse as JSON
        const jsonResponse = JSON.parse(responseText);
        assistantContent = jsonResponse.response || responseText;
      } catch (parseError) {
        // If parsing fails, use the raw text
        assistantContent = responseText;
      }

      const assistantMessage: Message = { role: 'assistant', content: assistantContent };
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      let errorMessage = 'Sorry, there was an error processing your request.';
      if (error instanceof Error) {
        errorMessage += ` Details: ${error.message}`;
      }
      setChatHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {chatHistory.map((message, index) => (
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