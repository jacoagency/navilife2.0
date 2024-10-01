export default function Dashboard() {
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
      }}>Dashboard</h1>
      <div style={{
        flexGrow: 1,
        overflow: 'hidden',
        backgroundColor: '#343541',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
      }}>
        <p style={{
          fontSize: '1.2rem',
          textAlign: 'center',
          color: '#ececf1',
        }}>Welcome to your NaviLife 2.0 dashboard.</p>
        {/* Add more dashboard content here */}
      </div>
    </div>
  );
}