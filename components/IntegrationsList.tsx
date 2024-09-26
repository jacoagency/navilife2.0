"use client";

import { useState } from "react";
import styles from './IntegrationsList.module.css';

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
    <div className={styles.list}>
      {integrations.map((integration) => (
        <div key={integration.id} className={styles.item}>
          <div className={styles.content}>
            <h3 className={styles.name}>{integration.name}</h3>
            <p className={styles.description}>{integration.description}</p>
          </div>
          <button
            onClick={() => toggleIntegration(integration.id)}
            className={`${styles.button} ${integration.enabled ? styles.enabled : styles.disabled}`}
          >
            {integration.enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      ))}
    </div>
  );
}