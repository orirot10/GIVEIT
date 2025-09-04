import React, { useState, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

const PermissionRequest = ({ onPermissionGranted }) => {
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [showRequest, setShowRequest] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      const result = await PushNotifications.checkPermissions();
      setPermissionStatus(result.receive);
      setShowRequest(result.receive !== 'granted');
    } catch (error) {
      console.error('Permission check failed:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const result = await PushNotifications.requestPermissions();
      setPermissionStatus(result.receive);
      setShowRequest(result.receive !== 'granted');
      
      if (result.receive === 'granted' && onPermissionGranted) {
        onPermissionGranted();
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  if (!Capacitor.isNativePlatform() || !showRequest) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        maxWidth: '300px'
      }}>
        <h3>Enable Notifications</h3>
        <p>Allow notifications to receive messages and updates.</p>
        <p>Status: {permissionStatus}</p>
        <button 
          onClick={requestPermissions}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          Allow Notifications
        </button>
        <button 
          onClick={() => setShowRequest(false)}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px'
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default PermissionRequest;