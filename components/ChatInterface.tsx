"use client";

import { useState } from "react";
import { Send } from 'lucide-react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Here you would typically send the message to your AI backend
      // and then add the response to the messages array
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-t-lg">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-2 rounded-lg ${message.sender === "user" ? "bg-primary text-white" : "bg-white"}`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="bg-white p-4 rounded-b-lg">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-primary text-white p-2 rounded-r-lg hover:bg-primary/80 transition-colors">
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}