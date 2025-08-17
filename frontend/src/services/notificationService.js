import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.token = null;
  }

  async initialize() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Push notifications not available on web');
      return;
    }

    try {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive === 'granted') {
        await PushNotifications.register();
        this.setupListeners();
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  setupListeners() {
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      this.token = token.value;
      this.sendTokenToServer(token.value);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification);
      this.handleForegroundNotification(notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
      this.handleNotificationTap(notification);
    });
  }

  async sendTokenToServer(token) {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';
      
      await fetch(`${baseUrl}/api/users/fcm-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ fcmToken: token })
      });
    } catch (error) {
      console.error('Error sending token to server:', error);
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
}

export default new NotificationService();