'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSend, FiPaperclip, FiMic } from 'react-icons/fi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ApiResponse {
  content: string;
  role: string;
  debugValues: any;
}

export default function EnhancedChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    try {
      const chatSession = await axios.post(
        'https://agentivehub.com/api/chat/session',
        {
          api_key: 'a4212202-8972-48fc-a28e-6e284e9ecb69',
          assistant_id: '9024fd95-0562-4966-becf-4642781c04ed',
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
    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    try {
      const chatResponse = {
        api_key: 'a4212202-8972-48fc-a28e-6e284e9ecb69',
        session_id: sessionId,
        type: 'custom_code',
        assistant_id: '9024fd95-0562-4966-becf-4642781c04ed',
        messages: [newMessage],
      };

      const chat = await axios.post<ApiResponse>('https://agentivehub.com/api/chat', chatResponse);

      const assistantMessage: Message = { role: 'assistant', content: chat.data.content };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-900 to-blue-600">
      {/* Header section with a sleek, modern style */}
      <div className="bg-blue-800 text-white p-4 flex items-center space-x-3 shadow-lg">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div>
          <h1 className="font-semibold text-lg">Assistant Chat</h1>
          <p className="text-xs opacity-75">Online</p>
        </div>
        <div className="ml-auto flex space-x-2">
          <button className="text-white hover:opacity-75"><FiPaperclip size={18} /></button>
          <button className="text-white hover:opacity-75"><FiMic size={18} /></button>
        </div>
      </div>

      {/* Chat area with message bubbles */}
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-tr-none'
                  : 'bg-white text-black rounded-tl-none shadow-md'
              } shadow-md`}
            >
              <p>{message.content}</p>
              <p className="text-xs text-gray-500 text-right mt-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg text-black animate-pulse shadow-md">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area with refined styling */}
      <form onSubmit={sendMessage} className="p-4 bg-gray-200 border-t border-gray-300 shadow-inner">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a message..."
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            <FiSend size={24} />
          </button>
        </div>
      </form>
    </div>
  );
}
