import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, setDoc, updateDoc, limit } from 'firebase/firestore';

const Chat = ({ userId, contactId, userMap }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Validate inputs
  useEffect(() => {
    if (!userId || !contactId) {
      setError('Invalid user or contact ID.');
      setLoading(false);
    }
  }, [userId, contactId]);

  // Generate conversation ID
  const conversationId = [userId, contactId].sort().join('_');

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Move initializeConversation outside useEffect so it can be called by the Retry button
  const initializeConversation = async () => {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationDoc = await getDoc(conversationRef);

      if (!conversationDoc.exists()) {
        await setDoc(conversationRef, {
          participants: [userId, contactId],
          lastMessage: null,
          createdAt: serverTimestamp(),
        });
      }

      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(50));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        }));
        setMessages(messagesData);
        setLoading(false);
      }, (err) => {
        setError('Failed to fetch messages: ' + err.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError('Failed to initialize conversation: ' + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || !contactId) return;
    initializeConversation();
    // eslint-disable-next-line
  }, [conversationId, userId, contactId]);

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: userId,
        timestamp: serverTimestamp(),
      });

      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: {
          text: newMessage,
          timestamp: serverTimestamp(),
        },
      });

      setNewMessage('');
    } catch (err) {
      setError('Failed to send message: ' + err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (error) {
    return (
      <div className="p-4" style={{ color: '#E57373' }}>
        {error}
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            initializeConversation();
          }}
          className="ml-2 px-4 py-2 rounded-lg"
          style={{ background: '#2E4057', color: '#fff' }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div style={{ color: '#607D8B' }}>Loading messages...</div>
      </div>
    );
  }

  const contactName = userMap[contactId]
    ? `${userMap[contactId].firstName} ${userMap[contactId].lastName}`
    : 'Unknown User';

  return (
    <div className="flex flex-col h-full" style={{ background: '#F4F6F8', color: '#1C2526' }}>
      <div className="border-b p-4" style={{ borderColor: '#2E4057', background: '#F4F6F8', color: '#1C2526' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#2E4057' }}>←</button>
          <h2 className="main-title">Chat with {contactName}</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4" style={{ background: '#F4F6F8' }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full" style={{ color: '#607D8B' }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.senderId === userId
                    ? ''
                    : ''
                }`}
                style={{
                  background: msg.senderId === userId ? '#2E4057' : '#fff',
                  color: msg.senderId === userId ? '#fff' : '#1C2526',
                  border: msg.senderId === userId ? 'none' : '1px solid #607D8B',
                }}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs opacity-70 mt-1 block" style={{ color: '#607D8B' }}>
                  {msg.timestamp ? msg.timestamp.toLocaleTimeString() : 'Pending'}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4" style={{ borderColor: '#2E4057', background: '#fff' }}>
        <div className="flex gap-1">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-lg focus:outline-none"
            style={{ border: '1.5px solid #607D8B', color: '#1C2526', background: '#fff' }}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#2E4057', color: '#fff' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;