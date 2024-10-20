import React from 'react';
import Link from 'next/link';

interface Agent {
  _id: string;
  name: string;
  prompt: string;
}

interface AgentBoxProps {
  agent: Agent;
}

const AgentBox: React.FC<AgentBoxProps> = ({ agent }) => {
  return (
    <Link href={`/agent/${agent._id}?name=${encodeURIComponent(agent.name)}&prompt=${encodeURIComponent(agent.prompt)}`}>
      <div className="border p-4 rounded cursor-pointer hover:bg-gray-100">
        <h3 className="font-bold">{agent.name}</h3>
        <p className="text-sm text-gray-600 truncate">{agent.prompt}</p>
      </div>
    </Link>
  );
};

export default AgentBox;
