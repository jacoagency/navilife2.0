'use client';

import { useSearchParams } from 'next/navigation';
import RoomInterface from "@/components/RoomInterface";

export default function AgentChatPage() {
  const searchParams = useSearchParams();
  const name = searchParams?.get('name') || 'Unknown Agent';
  const prompt = searchParams?.get('prompt') || '';
  const id = searchParams?.get('id') || '';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{name} Chat</h1>
      <RoomInterface 
        roomId={id}
        prompt={prompt}
      />
    </div>
  );
}
