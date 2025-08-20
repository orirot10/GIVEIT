import { auth } from '../firebase';

const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

// API utility with automatic token refresh
export const apiRequest = async (url, options = {}) => {
  const makeRequest = async (token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return fetch(`${baseUrl}${url}`, {
      ...options,
      headers,
    });
  };
  
  // First attempt
  let token = null;
  if (auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch (error) {
      console.error('Failed to get token:', error);
    }
  }
  
  let response = await makeRequest(token);
  
  // If we get a 401 with token-expired, try to refresh and retry once
  if (response.status === 401 && auth.currentUser) {
    try {
      const errorData = await response.json();
      if (errorData.code === 'token-expired') {
        console.log('Token expired, refreshing...');
        // Force refresh the token
        const newToken = await auth.currentUser.getIdToken(true);
        response = await makeRequest(newToken);
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      // If refresh fails, sign out user
      try {
        await auth.signOut();
      } catch (signOutError) {
        console.error('Sign out failed:', signOutError);
      }
    }
  }
  
  return response;
};

export default apiRequest;