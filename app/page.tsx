'use client';

import Link from 'next/link';
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-0">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-12">
          NaviLife 2.0
        </h1>
        <div className="flex gap-6 justify-center">
          <Link 
            href="/sign-up"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Sign Up
          </Link>
          <Link 
            href="/sign-in"
            className="px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
