"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { getUserHistory } from '@/lib/database';

interface ChatEntry {
  message: { content: string };
  response: { content: string; llm: string };
  timestamp: string;
}

export default function HistoryPage() {
  const { user } = useUser();
  const [history, setHistory] = useState<ChatEntry[]>([]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (user) {
      const userHistory = await getUserHistory(user.id);
      setHistory(userHistory);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#f3f4f6',
      minHeight: '100vh',
      color: 'black', // Set the default text color to black
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#1f2937', // Keep the title color dark
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        Chat History
      </h1>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {history.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#4b5563' }}>No chat history available.</p>
        ) : (
          history.map((chat, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'black' }}>
                User: {chat.message.content}
              </p>
              <p style={{ marginBottom: '0.5rem', color: 'black' }}>
                AI ({chat.response.llm}): {chat.response.content}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                {new Date(chat.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}