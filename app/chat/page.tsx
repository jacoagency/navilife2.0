import dynamic from 'next/dynamic';

const ChatInterface = dynamic(() => import('@/components/ChatInterface'), { ssr: false });

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Chat</h1>
      </div>
      {/* Remove flex-grow and overflow-hidden */}
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
}
