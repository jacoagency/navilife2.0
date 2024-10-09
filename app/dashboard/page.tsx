import React from 'react';
import { FiActivity, FiHeart, FiCheckCircle } from 'react-icons/fi';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6 font-sans">
      {/* Header Section */}
      <div className="w-full max-w-lg text-left mb-6">
        <h1 className="text-4xl font-bold mb-1">Hello, Clari</h1>
        <p className="text-sm opacity-80">Mon, 17 Sep 2024</p>
      </div>

      {/* Health Section */}
      <div className="w-full max-w-lg mt-4">
        <h2 className="text-xl font-semibold mb-3">Salud</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-2xl p-4 shadow-lg flex flex-col items-center">
            <FiActivity size={28} className="text-blue-300 mb-2" />
            <p className="text-base text-gray-300">Steps</p>
            <p className="text-3xl font-bold">30%</p>
            <p className="text-xs text-gray-500">355 Steps pending 1000</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-4 shadow-lg flex flex-col items-center">
            <FiHeart size={28} className="text-red-400 mb-2" />
            <p className="text-base text-gray-300">Heart Rate</p>
            <p className="text-3xl font-bold">130 bpm</p>
            <p className="text-xs text-gray-500">30%</p>
          </div>
        </div>
      </div>

      {/* Task Section */}
      <div className="w-full max-w-lg mt-8">
        <h2 className="text-xl font-semibold mb-3">Tasks for today</h2>
        <div className="space-y-3">
          {['Clean the house', 'Study for test', 'Google Meet 11:00', 'Dr. Appointment'].map(
            (task, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-800 p-3 rounded-2xl shadow-lg"
              >
                <span className="text-white">{task}</span>
                <FiCheckCircle size={20} className={`text-${index < 2 ? 'green' : 'gray'}-400`} />
              </div>
            )
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-gray-900 p-4 flex justify-around items-center">
        <button className="text-white opacity-80 hover:opacity-100 transition duration-200 ease-in-out">
          <FiActivity size={28} />
        </button>
        <button className="text-white opacity-80 hover:opacity-100 transition duration-200 ease-in-out">
          <FiHeart size={28} />
        </button>
        <button className="text-white opacity-80 hover:opacity-100 transition duration-200 ease-in-out">
          <FiCheckCircle size={28} />
        </button>
        <button className="text-white opacity-80 hover:opacity-100 transition duration-200 ease-in-out">
          <FiHeart size={28} />
        </button>
      </div>
    </div>
  );
}
