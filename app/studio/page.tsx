import dynamic from 'next/dynamic';

const StudioChatInterface = dynamic(() => import("@/components/StudioChatInterface"), { ssr: false });

export default function StudioPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Studio</h1>
      </div>
      <div className="flex-grow overflow-hidden">
        <StudioChatInterface />
      </div>
    </div>
  );
}