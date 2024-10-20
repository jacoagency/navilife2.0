'use server'

import { auth } from '@clerk/nextjs'
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

export async function sendMessage({
  userId,
  userName,
  content,
}: {
  userId: string
  userName: string
  content: string
}) {
  const { userId: authUserId } = auth()

  if (!authUserId || authUserId !== userId) {
    throw new Error('Unauthorized')
  }

  const message = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    userName,
    content,
    createdAt: new Date().toISOString(),
  }
  await pusher.trigger('chat', 'message', message)

  return message
}
