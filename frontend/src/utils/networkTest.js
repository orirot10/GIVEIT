import { Capacitor } from '@capacitor/core';

const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

export const testNetworkConnection = async () => {
  console.log('Testing network connection...');
  console.log('Platform:', Capacitor.getPlatform());
  console.log('Base URL:', baseUrl);
  
  try {
    // Test health check endpoint
    const response = await fetch(`${baseUrl}/healthz`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Health check response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Health check data:', data);
      return { success: true, data };
    } else {
      console.error('Health check failed:', response.status, response.statusText);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('Network test failed:', error);
    return { success: false, error: error.message };
  }
};

export default testNetworkConnection;