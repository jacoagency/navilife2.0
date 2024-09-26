import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <SignedIn>
        <h1 className={styles.title}>Welcome to NaviLife 2.0</h1>
        <div className={styles.grid}>
          <Link href="/dashboard" className={styles.card}>
            <h2>Dashboard &rarr;</h2>
            <p>View your personal dashboard and statistics.</p>
          </Link>
          <Link href="/chat" className={styles.card}>
            <h2>Chat &rarr;</h2>
            <p>Start a conversation with our AI assistant.</p>
          </Link>
          <Link href="/integrations" className={styles.card}>
            <h2>Integrations &rarr;</h2>
            <p>Manage your connected services and apps.</p>
          </Link>
          <Link href="/history" className={styles.card}>
            <h2>History &rarr;</h2>
            <p>Review your past interactions and data.</p>
          </Link>
        </div>
      </SignedIn>
      <SignedOut>
        <h1 className={styles.title}>Welcome to NaviLife 2.0</h1>
        <p className={styles.description}>Please sign in to access your personal health and productivity assistant.</p>
        <Link href="/sign-in" className={styles.signInButton}>Sign In</Link>
      </SignedOut>
    </div>
  );
}