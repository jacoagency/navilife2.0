'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { selectLLM, generateResponse } from '@/lib/ai';
import { saveChat, getUserHistory } from '@/lib/database';
import { FiSend, FiMic, FiImage, FiStopCircle } from 'react-icons/fi';
import * as fal from "@fal-ai/serverless-client";

fal.config({
  credentials: process.env.FAL_KEY,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
  llm?: string;
  type: 'text' | 'voice' | 'image';
  url?: string;
}

interface FalResult {
  images?: { url: string }[];
}

interface ChatInterfaceProps {
  onNewMessage?: (message: Message, response: Message) => Promise<void>;
  isStudioChat: boolean;
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

    const imageKeywords = ['generate image', 'create image', 'make an image', 'draw'];
    const isImageRequest = imageKeywords.some(keyword => input.toLowerCase().includes(keyword));

    if (isImageRequest) {
      await generateImage(input);
    } else {
      await sendMessage(input);
    }
  };

  const sendMessage = async (content: string, type: 'text' | 'voice' | 'image' = 'text', url?: string) => {
    setIsLoading(true);
    try {
      const selectedLLM = await selectLLM(content);
      
      if (selectedLLM === 'image') {
        await generateImage(content);
      } else {
        const response = await generateResponse(selectedLLM, content, chatHistory);
        const newMessage: Message = { role: 'user', content, type, url };
        let newResponse: Message;

        if (typeof response === 'string') {
          newResponse = { role: 'assistant', content: response, llm: selectedLLM, type: 'text' };
        } else {
          newResponse = { 
            role: 'assistant', 
            content: 'Here\'s the image you requested:', 
            llm: selectedLLM,
            type: 'image',
            url: response.url
          };
        }

        setChatHistory((prev) => [...prev, newMessage, newResponse]);

        if (onNewMessage) {
          await onNewMessage(newMessage, newResponse);
        }
      }

      setInput('');
    } catch (error) {
      console.error('Error in sendMessage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (prompt: string) => {
    try {
      console.log('Generating image with prompt:', prompt);

      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt: prompt,
          image_size: "landscape_4_3",
        },
        logs: true,
        onQueueUpdate: (update) => {
          console.log('Queue update:', update);
          if (update.status === "IN_PROGRESS") {
            console.log("Generation in progress:", update.logs);
          }
        },
      }) as FalResult;

      console.log('Fal AI response:', result);

      if (result.images && result.images.length > 0) {
        console.log('Image generated:', result.images[0].url);
        const newMessage: Message = {
          role: 'user',
          content: `Generated image: ${prompt}`,
          type: 'image',
          url: result.images[0].url
        };
        const assistantMessage: Message = {
          role: 'assistant',
          content: 'Here\'s the image you requested:',
          type: 'text'
        };
        setChatHistory(prev => [...prev, newMessage, assistantMessage]);
      } else {
        throw new Error('No images generated');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I couldn\'t generate the image. Please try again.',
        type: 'text'
      };
      setChatHistory(prev => [...prev, errorMessage]);
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

    let finalTranscript = '';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      if (event.results) {
        for (let i = event.resultIndex || 0; i < event.results.length; ++i) {
          if (event.results[i] && event.results[i][0]) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        sendMessage('Image uploaded', 'image', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageGenerated = (imageUrl: string) => {
    console.log('Image generated:', imageUrl); // Add this log
    const newMessage: Message = {
      role: 'user',
      content: 'Generated image',
      type: 'image',
      url: imageUrl
    };
    setChatHistory(prev => [...prev, newMessage]);
    // You might want to send a message to the AI about the generated image
    sendMessage('I generated an image', 'text');
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
              {message.type === 'image' && message.url && (
                <img 
                  src={message.url} 
                  alt="Generated" 
                  className="mb-2 max-w-full h-auto rounded"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    e.currentTarget.src = 'path/to/fallback/image.jpg'; // Opcional: imagen de respaldo
                  }}
                />
              )}
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
            placeholder="Type your message or '/image' to generate an image..."
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
