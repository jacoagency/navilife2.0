import IntegrationsList from '@/components/IntegrationsList';

export default function IntegrationsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
      <h1 className="text-4xl font-bold text-center text-white mb-8 text-shadow">Integrations</h1>
      <IntegrationsList />
    </div>
  );
}