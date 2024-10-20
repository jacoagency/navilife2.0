'use client';

import { useState, useEffect } from 'react';
import AgentBox from '@/components/AgentBox';

interface Agent {
  _id: string;
  name: string;
  prompt: string;
}

export default function RoomPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPrompt, setNewAgentPrompt] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const response = await fetch('/api/agents');
    const data = await response.json();
    setAgents(data);
  };

  const createAgent = async () => {
    if (newAgentName && newAgentPrompt) {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newAgentName,
          prompt: newAgentPrompt,
        }),
      });

      if (response.ok) {
        setNewAgentName('');
        setNewAgentPrompt('');
        setIsCreatingAgent(false);
        fetchAgents();
      }
    }
  };

  const deleteAgent = async (id: string) => {
    const response = await fetch(`/api/agents/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchAgents();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agent Room</h1>
      
      {/* Agent Creation Section */}
      <div className="mb-6">
        {!isCreatingAgent ? (
          <button
            onClick={() => setIsCreatingAgent(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Create New Agent
          </button>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <input
              type="text"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              placeholder="Enter agent name"
              className="w-full p-2 mb-2 border rounded-md"
            />
            <textarea
              value={newAgentPrompt}
              onChange={(e) => setNewAgentPrompt(e.target.value)}
              placeholder="Enter agent prompt"
              className="w-full p-2 mb-2 border rounded-md"
              rows={3}
            />
            <div>
              <button
                onClick={createAgent}
                className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600 transition-colors duration-200"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreatingAgent(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Agent Boxes Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {agents.map((agent) => (
          <AgentBox
            key={agent._id}
            agent={agent}
            onDelete={deleteAgent}
          />
        ))}
      </div>
    </div>
  );
}
