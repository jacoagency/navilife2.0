"use client";

import { useState } from "react";
import { FaGoogle, FaSpotify } from 'react-icons/fa';

export default function IntegrationsList() {
  const [integrations, setIntegrations] = useState([
    { id: 1, name: "Google Calendar", description: "Sync your Google Calendar events", enabled: true, icon: FaGoogle },
    { id: 2, name: "Spotify", description: "Integrate your Spotify playlists", enabled: true, icon: FaSpotify },
  ]);

  const toggleIntegration = (id: number) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id ? { ...integration, enabled: !integration.enabled } : integration
    ));
  };

  return (
    <div className="space-y-4">
      {integrations.map((integration) => (
        <div
          key={integration.id}
          className="bg-gray-100 rounded-lg p-6 border border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <div className="text-4xl text-gray-700">
              <integration.icon />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-800 mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-600">{integration.description}</p>
            </div>
            <button
              onClick={() => toggleIntegration(integration.id)}
              className={`px-4 py-2 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                integration.enabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-800'
              }`}
            >
              {integration.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}