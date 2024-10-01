import ChatInterface from '../../components/ChatInterface';

export default function ChatPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 64px)',
      padding: '1rem',
      backgroundColor: '#343541',
    }}>
      <h1 style={{
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '1rem',
        fontSize: '2rem',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
      }}>Chat</h1>
      <ChatInterface />
    </div>
  );
}