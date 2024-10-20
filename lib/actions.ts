'use server'

import { revalidatePath } from 'next/cache'
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

export async function sendMessage(message: {
  userId: string
  userName: string
  content: string
}) {
  const newMessage = {
    id: Math.random().toString(36).substr(2, 9),
    ...message,
    createdAt: new Date().toISOString(),
  }
  await pusher.trigger('chat', 'message', newMessage)

  revalidatePath('/chat/[id]', 'page')
  return newMessage
}
