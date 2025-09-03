import React, { useState } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import notificationService from '../services/notificationService';

const NotificationTest = () => {
  const [status, setStatus] = useState('');
  const [token, setToken] = useState('');

  const testNotifications = async () => {
    setStatus('Testing...');
    
    if (!Capacitor.isNativePlatform()) {
      setStatus('❌ Not on native platform');
      return;
    }

    try {
      // Check permissions
      const permissions = await PushNotifications.checkPermissions();
      setStatus(`Permissions: ${permissions.receive}`);
      
      if (permissions.receive !== 'granted') {
        const requested = await PushNotifications.requestPermissions();
        setStatus(`Requested permissions: ${requested.receive}`);
      }

      // Initialize service
      const success = await notificationService.initialize();
      setStatus(success ? '✅ Service initialized' : '❌ Service failed');
      
      // Get token
      const currentToken = notificationService.getToken();
      setToken(currentToken || 'No token yet');
      
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  const reinitialize = async () => {
    setStatus('Reinitializing...');
    const success = await notificationService.reinitialize();
    setStatus(success ? '✅ Reinitialized' : '❌ Reinitialize failed');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Notification Test</h3>
      <button onClick={testNotifications}>Test Notifications</button>
      <button onClick={reinitialize} style={{ marginLeft: '10px' }}>Reinitialize</button>
      <p>Status: {status}</p>
      <p>Token: {token ? token.substring(0, 50) + '...' : 'None'}</p>
    </div>
  );
};

export default NotificationTest;