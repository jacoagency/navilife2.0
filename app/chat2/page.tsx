'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function Chat2() {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');

  const selectLLM = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch('/api/selectLLM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to select LLM');
      }

      const data = await response.json();
      console.log('Selected LLM:', data.selectedLLM);
      return data.selectedLLM;
    } catch (error) {
      console.error('Error in selectLLM:', error);
      return 'gemini'; // Default to Gemini if there's an error
    }
  };

  const handleChat = async () => {
    setIsLoading(true);
    try {
      // Primero, seleccionamos el LLM adecuado
      const selectedLLM = await selectLLM(input);
      console.log('Selected LLM:', selectedLLM);

      let session_id;

      const chatSession = await axios.post(
        'https://agentivehub.com/api/chat/session',
        {
          "api_key": "a4212202-8972-48fc-a28e-6e284e9ecb69",
          "assistant_id": "12a05a7c-9a3a-44c7-be50-25d96bb0cde1",
        }
      );

      session_id = chatSession.data.session_id;

      const chatResponse = {
        api_key: "a4212202-8972-48fc-a28e-6e284e9ecb69",
        session_id,
        type: 'custom_code',
        assistant_id: "12a05a7c-9a3a-44c7-be50-25d96bb0cde1",
        messages: [{ role: 'user', content: input }],
        llm: selectedLLM,  // Añadimos el LLM seleccionado a la solicitud
      };

      const chat = await axios.post(
        'https://agentivehub.com/api/chat',
        chatResponse
      );

      setResponse(JSON.stringify(chat.data, null, 2));
    } catch (error) {
      console.error('Error in chat:', error);
      setResponse('Error occurred while chatting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat2</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        placeholder="Type your message here..."
      />
      <button
        onClick={handleChat}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Start Chat'}
      </button>
      {response && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {response}
        </pre>
      )}
    </div>
  );
}
