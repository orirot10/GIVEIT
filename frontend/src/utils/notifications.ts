// Type declaration for Capacitor global
declare global {
  interface Window {
    Capacitor?: {
      Plugins: {
        LocalNotifications: {
          schedule: (options: { notifications: Array<{ title: string; body: string; id: number }> }) => Promise<void>;
          requestPermissions: () => Promise<{ display: string }>;
        };
      };
    };
  }
}

export const showNotification = async (title: string, body: string): Promise<void> => {
  // Check if running in Capacitor environment
  if (window.Capacitor) {
    try {
      // Request permissions first
      await window.Capacitor.Plugins.LocalNotifications.requestPermissions();
      
      // Schedule notification
      await window.Capacitor.Plugins.LocalNotifications.schedule({
        notifications: [{
          title,
          body,
          id: Date.now()
        }]
      });
    } catch (error) {
      console.error('Failed to show Capacitor notification:', error);
      // Fallback to web notification
      showWebNotification(title, body);
    }
  } else {
    showWebNotification(title, body);
  }
};

const showWebNotification = (title: string, body: string): void => {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  // Check permission
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body });
      }
    });
  }
};