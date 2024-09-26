import styles from './integrations.module.css';
import IntegrationsList from '@/components/IntegrationsList';

export default function IntegrationsPage() {
  return (
    <div className={styles.integrationsContainer}>
      <h1 className={styles.title}>Integrations</h1>
      <IntegrationsList />
    </div>
  );
}