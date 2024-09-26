import styles from './chat.module.css';
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  return (
    <div className={styles.chatContainer}>
      <h1 className={styles.title}>Chat with NaviLife AI</h1>
      <ChatInterface />
    </div>
  );
}