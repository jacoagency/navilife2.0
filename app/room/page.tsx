import { auth, currentUser } from '@clerk/nextjs'
import ChatComponent from '../../components/RoomInterface'

<<<<<<< HEAD
export default async function ChatPage() {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId || !user) {
    return <div>Please sign in to access the chat.</div>
  }
=======
import React from 'react';
import RoomInterface from '@/components/RoomInterface';
>>>>>>> origin/main

export default function RoomPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Live Chat</h1>
      <ChatComponent initialUser={{ id: userId, name: user.firstName ?? 'Anonymous' }} />
=======
    <div className="flex flex-col h-screen">
      <RoomInterface />
>>>>>>> origin/main
    </div>
  )
}