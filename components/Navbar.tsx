'use client';

import { usePathname } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  
  if (pathname === '/' || !isSignedIn) return null;

  return (
    <nav className="bg-navy-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                ${pathname === '/dashboard' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/chat" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                ${pathname === '/chat' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
            >
              Chat
            </Link>
            <Link 
              href="/studio" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                ${pathname === '/studio' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
            >
              Studio
            </Link>
            <Link 
              href="/history" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                ${pathname === '/history' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
            >
              History
            </Link>
            <Link 
              href="/integrations" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                ${pathname === '/integrations' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
            >
              Integrations
            </Link>
            <Link 
              href="/room" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                ${pathname === '/room' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
            >
              Room
            </Link>
          </div>
          <div className="flex items-center">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                  userButtonPopoverCard: "bg-navy-800 border border-navy-700",
                  userButtonPopoverText: "text-gray-300",
                }
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
