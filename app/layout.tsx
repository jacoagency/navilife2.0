import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your app description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} font-sans bg-gradient-to-b from-blue-900 to-blue-700 text-white`}>
          <Navbar />
          <main className="min-h-screen p-6 flex flex-col items-center justify-center">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
