import dynamic from 'next/dynamic';
import { FiCode } from 'react-icons/fi';

const StudioChatInterface = dynamic(() => import("@/components/StudioChatInterface"), { ssr: false });

export default function StudioPage() {
  return (
    <div className="flex flex-col h-screen bg-navy-900">
      <div className="p-6 border-b border-navy-800">
        <div className="flex items-center space-x-3">
          <FiCode className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Studio
          </h1>
        </div>
        <p className="mt-2 text-gray-400">Advanced AI interactions with enhanced capabilities</p>
      </div>
      <div className="flex-1 bg-gradient-to-b from-navy-900 to-navy-800">
        <div className="h-full max-w-6xl mx-auto px-4">
          <StudioChatInterface />
        </div>
      </div>
    </div>
  );
}
