import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import './styles/global.css';
import { AuthProvider } from './context/AuthContext.jsx';
import notificationService from './services/notificationService';

// Initialize notifications
notificationService.initialize();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
