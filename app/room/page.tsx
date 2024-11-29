'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiTrash2, FiMessageSquare } from 'react-icons/fi';

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
    <div className="min-h-screen bg-navy-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <FiMessageSquare className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Agents Room
          </h1>
        </div>

        <div className="bg-navy-800 rounded-lg p-6 mb-8 border border-navy-700">
          <h2 className="text-xl text-gray-200 mb-4">Create New Agent</h2>
          <form onSubmit={createAgent} className="flex flex-col space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Agent Name"
              className="bg-navy-900 border border-navy-700 text-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Agent Prompt"
              className="bg-navy-900 border border-navy-700 text-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 h-32"
            />
            <button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <FiPlus className="w-5 h-5" />
              <span>Create Agent</span>
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent._id} className="bg-navy-800 rounded-lg p-6 border border-navy-700 hover:border-blue-500/30 transition-all">
              <h2 className="text-xl font-bold text-gray-200 mb-2">{agent.name}</h2>
              <p className="text-gray-400 mb-4 h-24 overflow-y-auto">{agent.prompt}</p>
              <div className="flex space-x-3">
                <Link 
                  href={`/chat/${agent._id}`}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-center"
                >
                  Chat
                </Link>
                <button 
                  onClick={() => deleteAgent(agent._id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
