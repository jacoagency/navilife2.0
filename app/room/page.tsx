'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Agent {
  _id: string;
  name: string;
  prompt: string;
}

export default function RoomPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const response = await fetch('/api/agents');
    const data = await response.json();
    setAgents(data);
  };

  const createAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, prompt }),
    });
    if (response.ok) {
      setName('');
      setPrompt('');
      fetchAgents();
    }
  };

  const deleteAgent = async (id: string) => {
    const response = await fetch(`/api/agents/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchAgents();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Agent</h1>
      <form onSubmit={createAgent} className="mb-8">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Agent Name"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Agent Prompt"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Create Agent</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent._id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{agent.name}</h2>
            <p className="mb-2">{agent.prompt}</p>
            <Link href={`/chat/${agent._id}`} className="bg-green-500 text-white p-2 mr-2">
              Chat
            </Link>
            <button onClick={() => deleteAgent(agent._id)} className="bg-red-500 text-white p-2">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
