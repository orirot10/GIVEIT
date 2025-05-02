import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// Connect to Socket.IO server
const socket = io('http://localhost:5000', {
  withCredentials: true,
});
const Messages = ({ userId }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null); // { id, name }
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const isSendingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.emit('join', userId);
    socket.emit('getConversations', userId);

    socket.on('loadConversations', (convs) => {
      console.log('Loaded Conversations:', convs);
      setConversations(convs);
    });

    socket.on('loadMessages', (loadedMessages) => {
      console.log('Loaded Messages:', loadedMessages);
      setMessages(loadedMessages);
    });

    socket.on('receiveMessage', (message) => {
      console.log('Received Message:', message);
      if (
        (message.senderId === activeConversation?.id && message.receiverId === userId) ||
        (message.senderId === userId && message.receiverId === activeConversation?.id)
      ) {
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) => msg.content === message.content && msg.timestamp === message.timestamp
          );
          if (!messageExists) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      }
      socket.emit('getConversations', userId);
    });

    return () => {
      socket.off('loadConversations');
      socket.off('loadMessages');
      socket.off('receiveMessage');
    };
  }, [userId, activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const selectConversation = (receiverId) => {
    const selectedConv = conversations.find((conv) => conv.receiverId === receiverId);
    setActiveConversation({
      id: receiverId,
      name: selectedConv?.receiverName || receiverId, // Fallback to ID if name isn't available
    });
    setMessages([]);
    socket.emit('getMessages', { userId, receiverId });
  };

  const getSenderName = (senderId) => {
    if (senderId === userId) return 'You';
    const conv = conversations.find((c) => c.receiverId === senderId);
    return conv?.receiverName || senderId; // Fallback to ID if name isn't available
  };

  const sendMessage = () => {
    if (newMessage.trim() && activeConversation && !isSendingRef.current) {
      isSendingRef.current = true;
      const messageData = {
        senderId: userId,
        receiverId: activeConversation.id,
        content: newMessage,
      };
      socket.emit('sendMessage', messageData);
      setNewMessage('');
      setTimeout(() => {
        isSendingRef.current = false;
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', maxWidth: '1000px', margin: '0 auto', height: '80vh' }}>
      {/* Sidebar: Conversation List */}
      <div
  style={{
    width: '100px', // Keep sidebar width fixed
    borderRight: '1px solid #ccc',
    overflowY: 'auto',
    backgroundColor: '#f1f1f1',
  }}
>
        <h3 style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Conversations</h3>
        {conversations.length === 0 ? (
          <p style={{ padding: '10px' }}>No conversations yet.</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.receiverId}
              onClick={() => selectConversation(conv.receiverId)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: activeConversation?.id === conv.receiverId ? '#E0E0FF' : 'transparent',
                borderBottom: '1px solid #eee',
                direction: 'rtl',
              }}
            >
              <strong style={{ color: '#6353B5' }}>{conv.receiverName || conv.receiverId}</strong>
              {conv.lastMessage && (
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                  {conv.lastMessage.content.length > 20 ? `${conv.lastMessage.content.substring(0, 20)}...` : conv.lastMessage.content}
                </p>
              )}
              {conv.lastMessage && (
                <small style={{ color: '#999' }}>{new Date(conv.lastMessage.timestamp).toLocaleTimeString('he-IL')}</small>
              )}
            </div>
          ))
        )}
      </div>

      {/* Chat Window */}
      <div
  style={{
    flex: activeConversation ? 3 : 1, // Increase flex-grow when a conversation is active
    display: 'flex',
    flexDirection: 'column',
  }}>
        {activeConversation ? (
          <>
            <div style={{ padding: '10px', borderBottom: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
              <h3>Chat with {activeConversation.name}</h3>
            </div>
            <div style={{ flex: 1, overflowY: 'scroll', padding: '10px', backgroundColor: '#fff' }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ textAlign: msg.senderId === userId ? 'right' : 'left', marginBottom: '10px' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      backgroundColor: msg.senderId === userId ? '#007bff' : '#e0e0e0',
                      color: msg.senderId === userId ? 'white' : 'black',
                      maxWidth: '70%',
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      <strong>{getSenderName(msg.senderId)}:</strong> {msg.content}
                    </p>
                    <small style={{ display: 'block', opacity: 0.7 }}>{new Date(msg.timestamp).toLocaleString()}</small>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ display: 'flex', gap: '10px', padding: '10px', borderTop: '1px solid #ccc' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message"
                style={{ flex: 1, padding: '8px' }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;