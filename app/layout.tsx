import './globals.css'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import Link from 'next/link';
import styles from './layout.module.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Novilife v0',
  description: 'Your personal health and productivity assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className={styles.container}>
            <SignedIn>
              <nav className={styles.navbar}>
                <Link href="/" className={styles.navItem}>Home</Link>
                <Link href="/dashboard" className={styles.navItem}>Dashboard</Link>
                <Link href="/chat" className={styles.navItem}>Chat</Link>
                <Link href="/integrations" className={styles.navItem}>Integrations</Link>
                <Link href="/history" className={styles.navItem}>History</Link>
              </nav>
            </SignedIn>
            <main className={styles.main}>
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}