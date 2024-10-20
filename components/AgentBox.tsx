import React, { useState } from 'react';
import Link from 'next/link';
import { FiTrash2, FiEdit3 } from 'react-icons/fi';

interface Agent {
  _id: string;
  name: string;
  prompt: string;
}

interface AgentBoxProps {
  agent: Agent;
  onDelete: (id: string) => void;
}

const AgentBox: React.FC<AgentBoxProps> = ({ agent, onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(agent._id);
    setShowConfirmation(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirmation(false);
  };

  return (
    <Link href={`/agent/${agent._id}?name=${encodeURIComponent(agent.name)}&prompt=${encodeURIComponent(agent.prompt)}`}>
      <div className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="p-3">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{agent.name}</h3>
          <p className="text-sm text-gray-600 h-12 overflow-hidden">{agent.prompt}</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">ID: {agent._id.slice(0, 6)}...</span>
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                // Add edit functionality here
              }}
              className="text-blue-500 hover:text-blue-600"
              title="Edit agent"
            >
              <FiEdit3 size={16} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-600"
              title="Delete agent"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
        {showConfirmation && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center bg-white p-3 rounded-md shadow-lg">
              <p className="mb-2 text-sm text-gray-700">Delete this agent?</p>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="bg-gray-300 text-gray-800 px-3 py-1 text-sm rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default AgentBox;
