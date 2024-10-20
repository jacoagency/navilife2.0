'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { getUserHistory } from '@/lib/database';
import { Message } from '@/types/chat';

interface Conversation {
  userMessage: Message;
  assistantMessage: Message;
}

export default function HistoryPage() {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadUserHistory();
  }, [user]);

  const loadUserHistory = async () => {
    try {
      const history = await getUserHistory(user!.id);
      console.log('Loaded history:', history);
      
      if (history.length === 0) {
        setError('No chat history available.');
        return;
      }
      
      // Group messages into conversations
      const groupedConversations: Conversation[] = [];
      for (let i = 0; i < history.length; i += 2) {
        if (i + 1 < history.length && history[i].role === 'user' && history[i + 1].role === 'assistant') {
          groupedConversations.push({
            userMessage: history[i],
            assistantMessage: history[i + 1]
          });
        }
      }
      
      console.log('Grouped conversations:', groupedConversations);
      setConversations(groupedConversations);
    } catch (error) {
      console.error('Error loading user history:', error);
      setError('Failed to load chat history. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat History</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : conversations.length === 0 ? (
        <p>Loading chat history...</p>
      ) : (
        <div className="space-y-6">
          {conversations.map((conversation, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="mb-2">
                <p className="font-bold text-blue-600">You:</p>
                <p className="ml-4">{conversation.userMessage.content}</p>
              </div>
              <div>
                <p className="font-bold text-green-600">Assistant:</p>
                <p className="ml-4">{conversation.assistantMessage.content}</p>
                {conversation.assistantMessage.llm && (
                  <p className="text-xs mt-1 text-gray-500 ml-4">
                    via {conversation.assistantMessage.llm.toUpperCase()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
