import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import notificationService from '../services/notificationService';

const NotificationTest = () => {
  const [status, setStatus] = useState('');
  const [token, setToken] = useState('');
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    if (!Capacitor.isNativePlatform()) {
      setStatus('Web platform - notifications not available');
      return;
    }

    try {
      const perms = await PushNotifications.checkPermissions();
      setPermissions(perms);
      setStatus(`Permissions: ${perms.receive}`);
      
      const currentToken = notificationService.getToken();
      if (currentToken) {
        setToken(currentToken.substring(0, 20) + '...');
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const requestPermissions = async () => {
    try {
      const result = await PushNotifications.requestPermissions();
      setPermissions(result);
      setStatus(`Permission result: ${result.receive}`);
    } catch (error) {
      setStatus(`Permission error: ${error.message}`);
    }
  };

  const initializeNotifications = async () => {
    try {
      const success = await notificationService.initialize();
      setStatus(success ? 'Initialized successfully' : 'Failed to initialize');
      
      setTimeout(() => {
        const currentToken = notificationService.getToken();
        if (currentToken) {
          setToken(currentToken.substring(0, 20) + '...');
        }
      }, 2000);
    } catch (error) {
      setStatus(`Init error: ${error.message}`);
    }
  };

  const testNotification = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Test Notification', {
          body: 'This is a test notification from GiveIt',
          icon: '/icon.png'
        });
        setStatus('Test notification sent');
      } else {
        setStatus('Web notifications not permitted');
      }
    } else {
      setStatus('Web notifications not supported');
    }
  };

  if (!Capacitor.isNativePlatform()) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
        <h3>🔔 Notification Test (Web)</h3>
        <p>Status: {status}</p>
        <button onClick={testNotification}>Test Web Notification</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>🔔 Notification Test (Mobile)</h3>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Token:</strong> {token || 'No token'}</p>
      <p><strong>Permissions:</strong> {permissions ? JSON.stringify(permissions) : 'Unknown'}</p>
      
      <div style={{ marginTop: '10px' }}>
        <button onClick={checkStatus} style={{ margin: '5px' }}>
          Check Status
        </button>
        <button onClick={requestPermissions} style={{ margin: '5px' }}>
          Request Permissions
        </button>
        <button onClick={initializeNotifications} style={{ margin: '5px' }}>
          Initialize
        </button>
      </div>
    </div>
  );
};

export default NotificationTest;