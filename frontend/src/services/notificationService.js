import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.token = null;
    this.listeners = [];
  }

  async initialize() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Push notifications not available on web');
      return false;
    }

    if (this.isInitialized) {
      console.log('Push notifications already initialized');
      return true;
    }

    try {
      console.log('🔔 Starting push notification initialization...');
      
      // Check current permission status first
      const currentPermission = await PushNotifications.checkPermissions();
      console.log('Current permission status:', currentPermission);
      
      let permission = currentPermission;
      if (currentPermission.receive !== 'granted') {
        console.log('Requesting push notification permissions...');
        permission = await PushNotifications.requestPermissions();
        console.log('Permission result:', permission);
      }
      
      if (permission.receive === 'granted') {
        console.log('✅ Push notification permissions granted');
        this.setupListeners();
        console.log('Registering for push notifications...');
        await PushNotifications.register();
        this.isInitialized = true;
        console.log('✅ Push notifications initialized successfully');
        return true;
      } else {
        console.log('❌ Push notification permissions denied:', permission.receive);
        return false;
      }
    } catch (error) {
      console.error('❌ Error initializing push notifications:', error);
      return false;
    }
  }

  setupListeners() {
    // Clear existing listeners to prevent duplicates
    this.removeListeners();

    // Registration success
    const registrationListener = PushNotifications.addListener('registration', (token) => {
      console.log('✅ Push registration success, token: ' + token.value.substring(0, 20) + '...');
      this.token = token.value;
      this.sendTokenToServer(token.value);
    });
    this.listeners.push(registrationListener);

    // Registration error
    const registrationErrorListener = PushNotifications.addListener('registrationError', (error) => {
      console.error('❌ FCM registration error:', JSON.stringify(error));
    });
    this.listeners.push(registrationErrorListener);

    // Foreground notification received
    const notificationReceivedListener = PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification);
      this.handleForegroundNotification(notification);
    });
    this.listeners.push(notificationReceivedListener);

    // Notification tapped (background/killed app)
    const notificationActionListener = PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
      this.handleNotificationTap(notification);
    });
    this.listeners.push(notificationActionListener);

    // Listen for deep link events from MainActivity
    const handleNotificationTapped = (event) => {
      const customEvent = new CustomEvent('notificationTap', {
        detail: { data: event.detail }
      });
      window.dispatchEvent(customEvent);
    };
    window.addEventListener('notificationTapped', handleNotificationTapped);
    this.listeners.push(() => window.removeEventListener('notificationTapped', handleNotificationTapped));
  }

  removeListeners() {
    this.listeners.forEach(listener => {
      if (typeof listener === 'function') {
        listener();
      } else if (listener && listener.remove) {
        listener.remove();
      }
    });
    this.listeners = [];
  }

  async sendTokenToServer(token) {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        console.log('No user or token found, skipping FCM token update');
        return;
      }

      const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';
      console.log('📤 Sending FCM token to server:', token.substring(0, 20) + '...');
      
      const response = await fetch(`${baseUrl}/api/users/fcm-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ fcmToken: token })
      });
      
      if (response.ok) {
        console.log('✅ FCM token sent to server successfully');
      } else {
        const errorData = await response.text();
        console.error('❌ Failed to send FCM token:', response.status, errorData);
      }
    } catch (error) {
      console.error('❌ Error sending token to server:', error);
    }
  }

  handleForegroundNotification(notification) {
    const event = new CustomEvent('newMessage', {
      detail: {
        title: notification.title,
        body: notification.body,
        data: notification.data
      }
    });
    window.dispatchEvent(event);
  }

  handleNotificationTap(notification) {
    const event = new CustomEvent('notificationTap', {
      detail: {
        data: notification.notification.data
      }
    });
    window.dispatchEvent(event);
  }

  getToken() {
    return this.token;
  }

  async cleanup() {
    this.removeListeners();
    this.isInitialized = false;
    this.token = null;
  }

  async reinitialize() {
    await this.cleanup();
    return await this.initialize();
  }
}

export default new NotificationService();