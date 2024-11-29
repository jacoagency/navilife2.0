import { FiPackage } from 'react-icons/fi';
import IntegrationsList from '@/components/IntegrationsList';

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-navy-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <FiPackage className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Integrations
          </h1>
        </div>
        
        <div className="bg-navy-800 rounded-lg p-8 border border-navy-700">
          <p className="text-xl text-gray-300 mb-8 text-center">
            Explore our available integrations to enhance your experience.
          </p>
          <IntegrationsList />
        </div>
      </div>
    </div>
  );
}