"use client";

import { useState } from "react";
import { MessageSquare } from 'lucide-react';

export default function ChatHistory() {
  const [chats] = useState([
    { id: 1, title: "Health advice", date: "2023-07-20" },
    { id: 2, title: "Workout plan", date: "2023-07-19" },
    { id: 3, title: "Nutrition tips", date: "2023-07-18" },
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Recent Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="mb-4 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <div className="flex items-center">
              <MessageSquare className="text-primary mr-2" size={20} />
              <div>
                <h3 className="font-semibold">{chat.title}</h3>
                <p className="text-sm text-gray-500">{chat.date}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}