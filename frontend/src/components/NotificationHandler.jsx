import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNewMessage = (event) => {
      const { title, body } = event.detail;
      
      // Show in-app notification or toast
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: '/vite.svg'
        });
      }
    };

    const handleNotificationTap = (event) => {
      const { data } = event.detail;
      
      // Navigate to messages page
      if (data && data.senderId) {
        navigate('/messages');
      }
    };

    // Listen for notification events
    window.addEventListener('newMessage', handleNewMessage);
    window.addEventListener('notificationTap', handleNotificationTap);

    return () => {
      window.removeEventListener('newMessage', handleNewMessage);
      window.removeEventListener('notificationTap', handleNotificationTap);
    };
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default NotificationHandler;
