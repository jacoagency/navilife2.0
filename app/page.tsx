'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="mb-20">
            <Image
              src="/navi.png"
              alt="NaviLife Logo"
              width={400}
              height={400}
              className="drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
            />
          </div>
          
          <div className="flex justify-center space-x-8">
            <Link 
              href="/sign-up"
              className="w-40 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white 
                       font-bold text-xl hover:opacity-90 transition-all shadow-lg hover:shadow-blue-500/20
                       flex items-center justify-center"
            >
              Sign Up
            </Link>
            <Link 
              href="/sign-in"
              className="w-40 py-4 bg-navy-800 border-2 border-blue-500/30 rounded-lg text-gray-200
                       font-bold text-xl hover:bg-navy-700 transition-all shadow-lg hover:shadow-purple-500/20
                       flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
