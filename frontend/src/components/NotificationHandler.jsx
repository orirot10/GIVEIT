import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NotificationHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    // Track active conversation for foreground suppression
    if (location.pathname === '/messages' && location.state?.contactId) {
      setActiveConversation(location.state.contactId);
    } else if (location.pathname !== '/messages') {
      setActiveConversation(null);
    }
  }, [location]);

  useEffect(() => {
    const handleNewMessage = (event) => {
      const { title, body, data } = event.detail;
      
      // Suppress notification if conversation is currently open
      if (activeConversation && data?.senderId === activeConversation) {
        return;
      }
      
      // Show in-app notification for foreground messages
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body: body,
          icon: '/icon.png',
          tag: `message-${data?.senderId}`,
          data: data
        });
        
        notification.onclick = () => {
          handleNotificationClick(data);
          notification.close();
        };
      }
    };

    const handleNotificationTap = (event) => {
      const { data } = event.detail;
      handleNotificationClick(data);
    };

    const handleNotificationClick = (data) => {
      if (data?.senderId) {
        navigate('/messages', {
          state: {
            contactId: data.senderId,
            contactName: data.senderName || 'User'
          }
        });
      } else if (data?.action === 'openMessages') {
        navigate('/messages');
      }
    };

    window.addEventListener('newMessage', handleNewMessage);
    window.addEventListener('notificationTap', handleNotificationTap);

    return () => {
      window.removeEventListener('newMessage', handleNewMessage);
      window.removeEventListener('notificationTap', handleNotificationTap);
    };
  }, [navigate, activeConversation]);

  return null;
};

export default NotificationHandler;
