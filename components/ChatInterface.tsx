'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { selectLLM, generateResponse } from '@/lib/ai';
import { saveChat, getUserHistory } from '@/lib/database';
import { FiSend, FiMic, FiStopCircle } from 'react-icons/fi';
import { Message } from '@/types/chat';

interface ChatInterfaceProps {
  onNewMessage?: (message: Message, response: Message) => Promise<void>;
  isStudioChat: boolean;
}

interface ExtendedMessage extends Message {
  type?: 'text' | 'voice' | 'image';
}

export default function ChatInterface({ onNewMessage, isStudioChat }: ChatInterfaceProps) {
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (user) loadUserHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const loadUserHistory = async () => {
    try {
      const history = await getUserHistory(user!.id, isStudioChat);
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading user history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await sendMessage(input);
  };

  const sendMessage = async (content: string, type: 'text' | 'voice' = 'text') => {
    setIsLoading(true);
    try {
      const selectedLLM = await selectLLM(content);
      console.log('Selected LLM:', selectedLLM);
      
      const newMessage: ExtendedMessage = { role: 'user', content, type };
      setChatHistory((prev) => [...prev, newMessage]);

      const response = await generateResponse(selectedLLM, content, chatHistory);
      
      const newResponse: ExtendedMessage = { 
        role: 'assistant', 
        content: typeof response === 'string' ? response : 'Sorry, I couldn\'t process that request.', 
        llm: selectedLLM, 
        type: 'text' 
      };

      setChatHistory((prev) => [...prev, newResponse]);

      if (onNewMessage) {
        await onNewMessage(newMessage, newResponse);
      }

      setInput('');
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const errorMessage: ExtendedMessage = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        type: 'text'
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceNote = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition');
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES'; // Cambia esto al idioma que prefieras

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setInput(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error', event.error);
      stopRecording();
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((message, index) => (
          <div key={index} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block max-w-[70%] p-3 rounded-lg ${
                message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p>{message.content}</p>
              {message.llm && (
                <p className="text-xs mt-1 opacity-75">via {message.llm.toUpperCase()}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-center text-gray-500">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleVoiceNote}
            className={`p-2 ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white rounded hover:opacity-80 transition duration-150 ease-in-out`}
            disabled={isLoading}
          >
            {isRecording ? <FiStopCircle size={20} /> : <FiMic size={20} />}
          </button>
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:opacity-80 transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
