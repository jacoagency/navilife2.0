'use client'

import { useState, useEffect, useRef } from 'react'
import Pusher from 'pusher-js'
import { useUser } from '@clerk/nextjs'
import { sendMessage } from '../lib/actions'
import { generateResponse } from '@/lib/ai'
import { Message } from '@/types/chat'

interface RoomInterfaceProps {
  roomId: string;
  agentPrompt: string;
}

interface ExtendedMessage extends Message {
  userId?: string;
  userName?: string;
}

export default function RoomInterface({ roomId, agentPrompt }: RoomInterfaceProps) {
  const [liveMessages, setLiveMessages] = useState<ExtendedMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messageEndRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe('chat')
    channel.bind('message', (data: ExtendedMessage) => {
      setLiveMessages((prevMessages) => [...prevMessages, data])
      if (data.role === 'user' && data.userId === user?.id) {
        handleAgentResponse(data.content)
      }
    })

    return () => {
      pusher.unsubscribe('chat')
    }
  }, [user])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [liveMessages])

  const handleAgentResponse = async (userMessage: string) => {
    try {
      const selectedLLM = 'gemini';
      console.log('Using LLM:', selectedLLM);

      // Construir el mensaje completo incluyendo el prompt del agente
      const fullPrompt = `${agentPrompt}\n\nUser: ${userMessage}\nAssistant:`;
      console.log('Full prompt:', fullPrompt);

      const response = await generateResponse(selectedLLM, fullPrompt, liveMessages);

      let content: string;
      if (typeof response === 'object' && 'type' in response && response.type === 'image') {
        content = `Image generated: ${response.url}`;
      } else {
        content = response as string;
      }

      await sendMessage({
        userId: 'gpt',
        userName: 'Agent',
        content: content,
        role: 'assistant',
        llm: selectedLLM
      } as ExtendedMessage)
    } catch (error) {
      console.error('Error getting AI response:', error)
      await sendMessage({
        userId: 'gpt',
        userName: 'Agent',
        content: 'Sorry, there was an error processing your request.',
        role: 'assistant',
        llm: 'error'
      } as ExtendedMessage)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === '') return

    await sendMessage({
      userId: user?.id ?? 'anonymous',
      userName: user?.firstName ?? 'Anonymous',
      content: newMessage,
      role: 'user'
    } as ExtendedMessage)

    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {liveMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.userId === 'gpt'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              <p className="font-bold">{message.userName}</p>
              <p>{message.content}</p>
              {message.llm && (
                <p className="text-xs mt-1 opacity-75">via {message.llm.toUpperCase()}</p>
              )}
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
