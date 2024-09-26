"use client";

import { useState } from "react";
import { CheckCircle, Circle } from 'lucide-react';

export default function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Morning walk", completed: false },
    { id: 2, text: "Team meeting", completed: false },
    { id: 3, text: "Read for 30 minutes", completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Today's Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="flex items-center mb-2">
            <button onClick={() => toggleTask(task.id)} className="mr-2">
              {task.completed ? (
                <CheckCircle className="text-primary" size={20} />
              ) : (
                <Circle className="text-gray-300" size={20} />
              )}
            </button>
            <span className={task.completed ? "line-through text-gray-500" : ""}>
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}