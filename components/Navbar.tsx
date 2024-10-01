"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();

  const navStyle: React.CSSProperties = {
    backgroundColor: '#1a1b26',
    padding: '0.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: '64px',
    boxSizing: 'border-box',
  };

  const linkContainerStyle = {
    display: 'flex',
    gap: '1.5rem',
  };

  const linkStyle = {
    color: '#8e8ea0',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'all 0.3s ease',
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#2d2e3a',
    color: '#ffffff',
  };

  const isActive = (path: string) => pathname === path;

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <nav style={navStyle}>
      {isSignedIn ? (
        <>
          <div style={linkContainerStyle}>
            <Link href="/dashboard" style={isActive('/dashboard') ? activeLinkStyle : linkStyle}>
              Dashboard
            </Link>
            <Link href="/chat" style={isActive('/chat') ? activeLinkStyle : linkStyle}>
              Chat
            </Link>
            <Link href="/chat2" style={isActive('/chat2') ? activeLinkStyle : linkStyle}>
              Chat2
            </Link>
            <Link href="/history" style={isActive('/history') ? activeLinkStyle : linkStyle}>
              History
            </Link>
          </div>
          <UserButton afterSignOutUrl="/" />
        </>
      ) : (
        <Link href="/" style={linkStyle}>Home</Link>
      )}
    </nav>
  );
}