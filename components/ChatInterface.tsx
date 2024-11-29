'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { selectLLM, generateResponse } from '@/lib/ai';
// import { saveChat } from '@/lib/database'; // Uncomment if you plan to use saveChat later
import { getUserHistory } from '@/lib/database';
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

  const loadUserHistory = useCallback(async () => {
    if (user && isStudioChat) {
      try {
        const history = await getUserHistory(user.id, isStudioChat);
        setChatHistory(history);
      } catch (error) {
        console.error('Error loading user history:', error);
      }
    }
  }, [user, isStudioChat]);

  useEffect(() => {
    loadUserHistory();
  }, [loadUserHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

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
    recognition.lang = 'es-ES'; // Adjust language as needed

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
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-gray-200' 
                  : 'bg-navy-800 text-gray-200'
              }`}
            >
              <p>{message.content}</p>
              {message.llm && (
                <p className="text-xs mt-1 text-gray-400">via {message.llm.toUpperCase()}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400 mx-auto"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-navy-800">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-3 bg-navy-800 border border-navy-700 text-gray-200 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-400"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleVoiceNote}
            className={`p-3 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
            } text-white`}
            disabled={isLoading}
          >
            {isRecording ? <FiStopCircle size={20} /> : <FiMic size={20} />}
          </button>
          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                     hover:opacity-90 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
