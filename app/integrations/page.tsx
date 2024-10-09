import IntegrationsList from '@/components/IntegrationsList';

export default function IntegrationsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-lg">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Integrations
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Explore our available integrations to enhance your experience.
      </p>
      <IntegrationsList />
    </div>
  );
}