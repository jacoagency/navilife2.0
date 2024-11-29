'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserHistory } from '@/lib/database';
import { Message } from '@/types/chat';
import { FiClock, FiUser, FiMessageCircle } from 'react-icons/fi';

export default function HistoryPage() {
  const { user } = useUser();
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          const userHistory = await getUserHistory(user.id, false);
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
    return (
      <div className="flex items-center justify-center h-screen bg-navy-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <FiClock className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Chat History
          </h1>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 bg-navy-800 rounded-lg border border-navy-700">
            <p className="text-gray-400">No chat history found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((message, index) => (
              <div key={index} 
                className="p-4 rounded-lg bg-navy-800 border border-navy-700 transition-all hover:border-blue-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  {message.role === 'user' ? (
                    <FiUser className="text-blue-400" />
                  ) : (
                    <FiMessageCircle className="text-purple-400" />
                  )}
                  <span className="text-gray-300 font-medium">
                    {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
                  </span>
                  {message.llm && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400">
                      {message.llm}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 ml-6">{message.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
