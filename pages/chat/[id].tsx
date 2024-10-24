"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import RoomInterface from '@/components/RoomInterface';

interface ChatRoom {
  id: string;
  name: string;
  prompt: string;
}

export default function ChatRoomPage() {
  const router = useRouter();
  const { id } = router.query;
  const [room, setRoom] = useState<ChatRoom | null>(null);

  useEffect(() => {
    if (id) {
      const storedRooms = localStorage.getItem('chatRooms');
      if (storedRooms) {
        const rooms: ChatRoom[] = JSON.parse(storedRooms);
        const currentRoom = rooms.find(r => r.id === id);
        if (currentRoom) {
          setRoom(currentRoom);
        } else {
          // Handle room not found
          router.push('/room');
        }
      }
    }
  }, [id, router]);

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{room.name}</h1>
      <RoomInterface roomId={room.id} agentPrompt={room.prompt} />
    </div>
  );
}
