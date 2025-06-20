import React from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthContext } from '../context/AuthContext';

const ContactButton = ({ ownerId, ownerName, listingTitle }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const startChat = async () => {
    if (!user) {
      navigate('/account');
      return;
    }

    if (user.uid === ownerId) {
      alert("You can't message yourself!");
      return;
    }

    try {
      // Create chat ID by sorting UIDs
      const chatId = [user.uid, ownerId].sort().join('_');
      
      // Create or update chat document
      const chatRef = doc(db, 'chats', chatId);
      await setDoc(chatRef, {
        participants: [user.uid, ownerId],
        participantNames: {
          [user.uid]: user.displayName || 'User',
          [ownerId]: ownerName || 'User'
        },
        lastMessage: `Interested in: ${listingTitle}`,
        lastMessageTime: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });

      // Navigate to messages
      navigate('/messages');
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  return (
    <button 
      onClick={startChat}
      className="contact-btn"
      style={{
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem'
      }}
    >
      Contact Owner
    </button>
  );
};

export default ContactButton;