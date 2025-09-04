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
      // Force request permissions
      setStatus('🔄 Requesting permissions...');
      const requested = await PushNotifications.requestPermissions();
      setStatus(`Permission result: ${requested.receive}`);
      
      if (requested.receive !== 'granted') {
        setStatus('❌ Permissions denied. Check device settings.');
        return;
      }

      // Initialize service
      setStatus('🔄 Initializing service...');
      const success = await notificationService.initialize();
      setStatus(success ? '✅ Service initialized' : '❌ Service failed');
      
      // Get token
      const currentToken = notificationService.getToken();
      setToken(currentToken || 'Waiting for token...');
      
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error('Test error:', error);
    }
  };

  const reinitialize = async () => {
    setStatus('🔄 Reinitializing...');
    const success = await notificationService.reinitialize();
    setStatus(success ? '✅ Reinitialized' : '❌ Reinitialize failed');
    const currentToken = notificationService.getToken();
    setToken(currentToken || 'No token');
  };

  const requestPermissionsOnly = async () => {
    setStatus('🔄 Requesting permissions only...');
    try {
      const result = await PushNotifications.requestPermissions();
      setStatus(`Permission: ${result.receive}`);
    } catch (error) {
      setStatus(`❌ Permission error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Notification Test</h3>
      <button onClick={requestPermissionsOnly}>Request Permissions</button>
      <button onClick={testNotifications} style={{ marginLeft: '10px' }}>Test Notifications</button>
      <button onClick={reinitialize} style={{ marginLeft: '10px' }}>Reinitialize</button>
      <p>Status: {status}</p>
      <p>Token: {token ? token.substring(0, 50) + '...' : 'None'}</p>
    </div>
  );
};

export default NotificationTest;