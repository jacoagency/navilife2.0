'use client';

import { usePathname } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  
  // No mostrar navbar en la página principal o si no está autenticado
  if (pathname === '/' || !isSignedIn) return null;

  return (
    <nav className="bg-white shadow-sm h-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className={`text-gray-700 hover:text-gray-900 ${pathname === '/dashboard' ? 'font-semibold' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/chat" 
              className={`text-gray-700 hover:text-gray-900 ${pathname === '/chat' ? 'font-semibold' : ''}`}
            >
              Chat
            </Link>
            <Link 
              href="/history" 
              className={`text-gray-700 hover:text-gray-900 ${pathname === '/history' ? 'font-semibold' : ''}`}
            >
              History
            </Link>
            <Link 
              href="/integrations" 
              className={`text-gray-700 hover:text-gray-900 ${pathname === '/integrations' ? 'font-semibold' : ''}`}
            >
              Integrations
            </Link>
            <Link 
              href="/room" 
              className={`text-gray-700 hover:text-gray-900 ${pathname === '/room' ? 'font-semibold' : ''}`}
            >
              Room
            </Link>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
