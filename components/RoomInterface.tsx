'use client'

import { useState, useEffect, useRef } from 'react'
import Pusher from 'pusher-js'
import { useUser } from '@clerk/nextjs'
import { sendMessage } from '../lib/actions'
import { useChat, Message as AIMessage } from 'ai/react'

type Message = {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

interface RoomInterfaceProps {
  roomId: string;
  prompt: string;
}

export default function RoomInterface({ roomId, prompt }: RoomInterfaceProps) {
  const [liveMessages, setLiveMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messageEndRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()

  // GPT Chat
  const { messages: gptMessages, append: appendGptMessage } = useChat({
    initialMessages: [
      { role: 'system', content: prompt, id: 'system-1' },
    ],
  });

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe('chat')
    channel.bind('message', (data: Message) => {
      setLiveMessages((prevMessages) => [...prevMessages, data])
    })

    return () => {
      pusher.unsubscribe('chat')
    }
  }, [])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [liveMessages, gptMessages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === '') return

    const userMessage: AIMessage = {
      role: 'user',
      content: newMessage,
      id: Date.now().toString(),
    };

    // Send user message to live chat
    await sendMessage({
      userId: user?.id ?? 'anonymous',
      userName: user?.firstName ?? 'Anonymous',
      content: newMessage,
    })

    // Send message to GPT chat and get response
    const gptResponse = await appendGptMessage(userMessage);

    // Send GPT response to live chat
    if (gptResponse && gptResponse.length > 0) {
      const assistantMessage = gptResponse[gptResponse.length - 1] as AIMessage;
      if (assistantMessage.role === 'assistant') {
        await sendMessage({
          userId: 'gpt',
          userName: 'Agent',
          content: assistantMessage.content,
        });
      }
    }

    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Display live messages */}
        {liveMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.userId === user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.userId === user?.id
                  ? 'bg-blue-500 text-white'
                  : message.userId === 'gpt'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              <p className="font-bold">{message.userName}</p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
