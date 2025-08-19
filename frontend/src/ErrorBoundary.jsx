import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>שגיאה בטעינת העמוד</h1>
          <p><strong>Error:</strong> {this.state.error?.message || 'Unknown error'}</p>
          <p><strong>Stack:</strong> {this.state.error?.stack}</p>
          <button onClick={() => window.location.reload()}>רענן דף</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;