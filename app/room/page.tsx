'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agent Room</h1>
      
      {/* Agent Creation Section */}
      <div className="mb-8">
        {!isCreatingAgent ? (
          <button
            onClick={() => setIsCreatingAgent(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create New Agent
          </button>
        ) : (
          <div className="bg-gray-100 p-4 rounded">
            <input
              type="text"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              placeholder="Enter agent name"
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              value={newAgentPrompt}
              onChange={(e) => setNewAgentPrompt(e.target.value)}
              placeholder="Enter agent prompt"
              className="w-full p-2 mb-2 border rounded"
              rows={3}
            />
            <div>
              <button
                onClick={createAgent}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreatingAgent(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Agent Boxes Section */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {agents.map((agent) => (
          <AgentBox
            key={agent._id}
            agent={agent}
          />
        ))}
      </div>
    </div>
  );
}
