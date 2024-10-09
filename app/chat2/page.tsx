'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ApiResponse {
  content: string;
  role: string;
  debugValues: any;
}

export default function Chat2() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const chatSession = await axios.post(
        'https://agentivehub.com/api/chat/session',
        {
          "api_key": "a4212202-8972-48fc-a28e-6e284e9ecb69",
          "assistant_id": "9024fd95-0562-4966-becf-4642781c04ed",
        }
      );
      setSessionId(chatSession.data.session_id);
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || isLoading) return;

    setIsLoading(true);
    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const chatResponse = {
        api_key: "a4212202-8972-48fc-a28e-6e284e9ecb69",
        session_id: sessionId,
        type: 'custom_code',
        assistant_id: "9024fd95-0562-4966-becf-4642781c04ed",
        messages: [newMessage],
      };

      const chat = await axios.post<ApiResponse>(
        'https://agentivehub.com/api/chat',
        chatResponse
      );

      const assistantMessage: Message = { role: 'assistant', content: chat.data.content };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${
              message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-black'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-300 p-3 rounded-lg text-black animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border rounded"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
