"use client";

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { selectLLM, generateResponse } from '@/lib/ai';
import { saveChat, getUserHistory } from '@/lib/database';

export default function ChatInterface() {
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadUserHistory();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadUserHistory = async () => {
    try {
      const history = await getUserHistory(user!.id);
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading user history:', error);
      setError('Failed to load chat history');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const selectedLLM = await selectLLM(input);
      console.log('LLM selected for this input:', selectedLLM);
      
      const formattedHistory = chatHistory
        .filter(msg => msg.content != null)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      console.log('Formatted history:', JSON.stringify(formattedHistory));
      
      const response = await generateResponse(selectedLLM, input, formattedHistory);

      const newMessage = { role: 'user', content: input };
      const newResponse = { role: 'assistant', content: response, llm: selectedLLM };

      setChatHistory([...chatHistory, newMessage, newResponse]);
      await saveChat(user!.id, newMessage, newResponse);

      setInput('');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError('Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 180px)',
      backgroundColor: '#343541',
      color: '#ececf1',
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      <div style={{
        flexGrow: 1,
        overflowY: chatHistory && chatHistory.length > 0 ? 'auto' : 'hidden',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {(!chatHistory || chatHistory.length === 0) ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#8e8ea0',
            fontSize: '1.2rem',
          }}>
            Start a conversation...
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div key={index} style={{
              maxWidth: '80%',
              marginBottom: '1rem',
              lineHeight: 1.5,
              display: 'flex',
              flexDirection: 'column',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                backgroundColor: message.role === 'user' ? '#4a4b5a' : '#343541',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}>
                {message.content}
              </div>
              {message.llm && (
                <div style={{
                  fontSize: '0.75rem',
                  color: '#8e8ea0',
                  marginTop: '0.25rem',
                }}>
                  Powered by {message.llm}
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            fontStyle: 'italic',
            color: '#8e8ea0',
          }}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        padding: '1rem',
        backgroundColor: '#40414f',
        borderTop: '1px solid #565869',
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flexGrow: 1,
            padding: '0.75rem',
            backgroundColor: '#40414f',
            border: '1px solid #565869',
            borderRadius: '0.5rem',
            color: '#ececf1',
            fontSize: '1rem',
          }}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button 
          type="submit" 
          style={{
            padding: '0.75rem 1.5rem',
            marginLeft: '0.5rem',
            backgroundColor: '#10a37f',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}