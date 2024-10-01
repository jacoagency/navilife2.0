"use client";

import { useAuth, SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (isSignedIn) {
    return null; // This will be briefly shown before redirecting to dashboard
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#343541',
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        color: '#ffffff',
        marginBottom: '2rem',
      }}>Welcome to NaviLife 2.0</h1>
      <SignIn redirectUrl="/dashboard" />
    </div>
  );
}