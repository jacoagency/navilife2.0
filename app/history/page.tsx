"use client"
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { getUserHistory } from '@/lib/database';

export default function HistoryPage() {
  const { user } = useUser();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    const userHistory = await getUserHistory(user.id);
    setHistory(userHistory);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat History</h1>
      <div className="space-y-4">
        {history.map((chat, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-4">
            <p className="font-semibold">User: {chat.message.content}</p>
            <p>AI ({chat.response.llm}): {chat.response.content}</p>
            <p className="text-sm text-gray-500">{new Date(chat.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}