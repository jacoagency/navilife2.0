'use client';

import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import { useParams } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  sender: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [agent, setAgent] = useState<{ name: string; prompt: string } | null>(null);
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      fetchAgent();
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      });
      const channel = pusher.subscribe(`chat-${id}`);
      channel.bind('message', (data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        pusher.unsubscribe(`chat-${id}`);
      };
    }
  }, [id]);

  const fetchAgent = async () => {
    const response = await fetch(`/api/agents/${id}`);
    const data = await response.json();
    setAgent(data);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      content: newMessage,
      sender: 'user',
    };

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: id, message }),
    });

    setNewMessage('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with {agent?.name}</h1>
      <div className="border p-4 h-96 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow border p-2 mr-2"
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Send</button>
      </form>
    </div>
  );
}
