import { useAuthContext } from '../../context/AuthContext';

const GoogleAuthTest = () => {
  const { signInWithGoogle, loading, error } = useAuthContext();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      console.log('Google sign-in successful');
    } catch (err) {
      console.error('Google sign-in failed:', err);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Google Sign-In Test</h3>
      <button 
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default GoogleAuthTest;