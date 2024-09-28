"use client";

import { useState } from "react";

export default function IntegrationsList() {
  const [integrations, setIntegrations] = useState([
    { id: 1, name: "Google Calendar", description: "Sync your Google Calendar events", enabled: true },
    { id: 2, name: "Fitbit", description: "Connect your Fitbit for health tracking", enabled: false },
    { id: 3, name: "Spotify", description: "Integrate your Spotify playlists", enabled: true },
  ]);

  const toggleIntegration = (id: number) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id ? { ...integration, enabled: !integration.enabled } : integration
    ));
  };

  return (
    <div className="grid gap-6">
      {integrations.map((integration) => (
        <div key={integration.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg border border-white border-opacity-20">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">{integration.name}</h3>
              <p className="text-sm text-gray-300 mb-4">{integration.description}</p>
            </div>
            <button
              onClick={() => toggleIntegration(integration.id)}
              className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                integration.enabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-400 text-gray-800'
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