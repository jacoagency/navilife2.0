'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { FiUsers, FiMessageCircle, FiClock, FiBox, FiArrowRight, FiActivity } from 'react-icons/fi';
import { getUserHistory } from '@/lib/database';
import { Message } from '@/types/chat';

interface Agent {
  _id: string;
  name: string;
  prompt: string;
}

interface DashboardStats {
  totalChats: number;
  totalAgents: number;
  averageResponseTime: string;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [recentChats, setRecentChats] = useState<Message[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalChats: 0,
    totalAgents: 0,
    averageResponseTime: '2.5s'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user) {
        try {
          // Cargar chats recientes
          const history = await getUserHistory(user.id, false);
          setRecentChats(history.slice(-5)); // Últimos 5 chats

          // Cargar agentes
          const agentsResponse = await fetch('/api/agents');
          const agentsData = await agentsResponse.json();
          setAgents(agentsData);

          // Actualizar estadísticas
          setStats({
            totalChats: history.length,
            totalAgents: agentsData.length,
            averageResponseTime: '2.5s'
          });
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-navy-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <div className="text-gray-400">
            Welcome back, {user?.firstName || 'User'}!
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-navy-800 rounded-lg p-6 border border-navy-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-1">Total Chats</p>
                <h3 className="text-2xl font-bold text-white">{stats.totalChats}</h3>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <FiMessageCircle className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-navy-800 rounded-lg p-6 border border-navy-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-1">Active Agents</p>
                <h3 className="text-2xl font-bold text-white">{stats.totalAgents}</h3>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <FiUsers className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
          <div className="bg-navy-800 rounded-lg p-6 border border-navy-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-1">Avg. Response Time</p>
                <h3 className="text-2xl font-bold text-white">{stats.averageResponseTime}</h3>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <FiActivity className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Agents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Chats */}
          <div className="bg-navy-800 rounded-lg p-6 border border-navy-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiClock className="text-blue-400" />
                Recent Conversations
              </h2>
              <Link 
                href="/history"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
              >
                View all <FiArrowRight />
              </Link>
            </div>
            <div className="space-y-4">
              {recentChats.map((chat, index) => (
                <div key={index} className="p-4 bg-navy-900 rounded-lg hover:bg-navy-700/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMessageCircle className="text-blue-400" />
                    <span className="text-gray-300 font-medium">
                      {chat.role === 'user' ? 'You' : 'AI'}
                    </span>
                    {chat.llm && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                        {chat.llm}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 truncate">{chat.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Agents */}
          <div className="bg-navy-800 rounded-lg p-6 border border-navy-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiBox className="text-purple-400" />
                Your AI Agents
              </h2>
              <Link 
                href="/room"
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
              >
                Manage agents <FiArrowRight />
              </Link>
            </div>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent._id} className="p-4 bg-navy-900 rounded-lg hover:bg-navy-700/50 transition-colors">
                  <h3 className="text-gray-200 font-medium mb-1">{agent.name}</h3>
                  <p className="text-gray-400 text-sm truncate">{agent.prompt}</p>
                  <Link 
                    href={`/chat/${agent._id}`}
                    className="mt-2 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    Chat with agent <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
