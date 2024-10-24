'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserHistory } from '@/lib/database';
import { Message } from '@/types/chat';

export default function HistoryPage() {
  const { user } = useUser();
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          const userHistory = await getUserHistory(user.id, false); // false for not studio chat
          setHistory(userHistory);
        } catch (error) {
          console.error('Error fetching user history:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat History</h1>
      {history.length === 0 ? (
        <p>No chat history found.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((message, index) => (
            <li key={index} className="border p-2 rounded">
              <p><strong>{message.role}:</strong> {message.content}</p>
              {message.llm && <p className="text-sm text-gray-500">LLM: {message.llm}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
