import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthContext } from '../context/AuthContext';

const RealtimeChat = ({ otherUserId, otherUserName, initialMessage, onMessagesRead }) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Create chat ID by sorting UIDs to ensure consistency
  const chatId = [user.uid, otherUserId].sort().join('_');

  useEffect(() => {
    if (!user || !otherUserId) return;

    // Create chat document if it doesn't exist
    const initializeChat = async () => {
      const chatRef = doc(db, 'chats', chatId);
      await setDoc(chatRef, {
        participants: [user.uid, otherUserId],
        participantNames: {
          [user.uid]: user.displayName || 'User',
          [otherUserId]: otherUserName || 'User'
        },
        lastMessage: initialMessage || '',
        lastMessageTime: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });
      
      // If there's an initial message, send it
      if (initialMessage) {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        await addDoc(messagesRef, {
          text: initialMessage,
          senderId: user.uid,
          senderName: user.displayName || 'User',
          timestamp: serverTimestamp()
        });
      }
    };

    initializeChat();

    // Listen for messages
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [user, otherUserId, chatId, otherUserName, initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      const lastTime = lastMsg.timestamp?.toMillis?.() || Date.now();

      onMessagesRead?.(lastTime);
    }

    return () => {
      if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        const lastTime = lastMsg.timestamp?.toMillis?.() || Date.now();
        onMessagesRead?.(lastTime);
      }
    };
  }, [messages, onMessagesRead]);


  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName || 'User',
        timestamp: serverTimestamp()
      });

      // Update last message in chat document
      const chatRef = doc(db, 'chats', chatId);
      await setDoc(chatRef, {
        lastMessage: newMessage,
        lastMessageTime: serverTimestamp()
      }, { merge: true });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat with {otherUserName}</h3>
      </div>
      
      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.senderId === user.uid ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <small>{message.timestamp?.toDate?.()?.toLocaleTimeString()}</small>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default RealtimeChat;