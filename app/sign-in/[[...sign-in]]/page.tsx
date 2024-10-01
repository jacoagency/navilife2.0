import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          textAlign: 'center',
        }}>Sign In to NaviLife 2.0</h1>
        <SignIn />
      </div>
    </div>
  );
}