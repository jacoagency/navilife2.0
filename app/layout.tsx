import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className} style={{ margin: 0, padding: 0 }}>
          <Navbar />
          <main style={{
            paddingTop: '64px',
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: '#343541',
          }}>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}