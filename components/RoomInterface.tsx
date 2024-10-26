'use client'

import { useState, useEffect, useRef } from 'react'
import Pusher from 'pusher-js'
import { useUser } from '@clerk/nextjs'

type Message = {
  id: string
  content: string
  sender: string
}

interface RoomInterfaceProps {
  prompt: string;
}

export default function RoomInterface({ prompt }: RoomInterfaceProps) {
  const [liveMessages, setLiveMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messageEndRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()

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
  }, [liveMessages])

  const handleAgentResponse = async (userMessage: string) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const { response: aiResponse } = await response.json();
      
      // Send the AI response to the messages API
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: aiResponse,
          sender: 'agent',
        }),
      });
    } catch (error) {
      console.error('Error getting AI response:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === '') return

    // Send the user message to the messages API
    await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: newMessage,
        sender: user?.id ?? 'anonymous',
      }),
    });

    setNewMessage('')
    handleAgentResponse(newMessage)
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {liveMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === user?.id
                  ? 'bg-blue-500 text-white'
                  : message.sender === 'agent'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
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
