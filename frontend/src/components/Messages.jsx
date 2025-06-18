import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';

const socketUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';
const socket = io(socketUrl, { withCredentials: true });

const Messages = ({ userId }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const isSendingRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectConversation = useCallback(
    (receiverId) => {
      if (activeConversation?.id !== receiverId) {
        const selectedConv = conversations.find((conv) => conv.receiverId === receiverId);
        setActiveConversation({
          id: receiverId,
          name: selectedConv?.receiverName || receiverId,
        });
        setMessages([]);
        console.log(`Emitting getMessages for conversation with: ${receiverId}`);
        socket.emit('getMessages', { userId, receiverId });
      }
    },
    [userId, conversations, activeConversation]
  );

  const sendInitialSystemMessage = useCallback(
    async (receiverId, itemTitle) => {
      if (!userId || !receiverId || !itemTitle) return;
      const content = `Hi! I'm interested in your item: "${itemTitle}"`;
      console.log(`Sending initial message to ${receiverId}: ${content}`);
      const messageData = {
        senderId: userId,
        receiverId: receiverId,
        content: content,
        timestamp: new Date(),
        _id: `temp-${Date.now()}`,
      };
      setMessages((prev) => [...prev, messageData]);
      socket.emit('sendMessage', {
        senderId: userId,
        receiverId: receiverId,
        content: content,
      });
    },
    [userId]
  );

  useEffect(() => {
    if (!userId) return;
    console.log(`Emitting join for userId: ${userId}`);
    socket.emit('join', userId);
    console.log(`Emitting getConversations for userId: ${userId}`);
    socket.emit('getConversations', userId);

    const handleLoadConversations = (convs) => {
      console.log('Listener: Loaded Conversations:', convs);
      setConversations(convs);
    };
    const handleLoadMessages = (loadedMessages) => {
      console.log('Listener: Loaded Messages:', loadedMessages);
      setMessages(loadedMessages);
    };
    const handleReceiveMessage = (message) => {
      console.log('Listener: Received Message:', message);
      console.log('Active Conversation:', activeConversation);
      console.log('User ID:', userId);
      if (
        (message.senderId === activeConversation?.id && message.receiverId === userId) ||
        (message.senderId === userId && message.receiverId === activeConversation?.id)
      ) {
        setMessages((prevMessages) => {
          const tempMessageIndex = prevMessages.findIndex(
            (msg) => msg._id.startsWith('temp-') && msg.content === message.content && msg.senderId === message.senderId
          );
          if (tempMessageIndex !== -1) {
            const updatedMessages = [...prevMessages];
            updatedMessages[tempMessageIndex] = message;
            return updatedMessages;
          }
          const messageExists = prevMessages.some(
            (msg) =>
              msg._id === message._id ||
              (msg.content === message.content &&
                new Date(msg.timestamp).getTime() === new Date(message.timestamp).getTime())
          );
          if (!messageExists) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      }
      socket.emit('getConversations', userId);
    };

    socket.on('loadConversations', handleLoadConversations);
    socket.on('loadMessages', handleLoadMessages);
    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      console.log(`Cleaning up socket listeners for userId: ${userId}`);
      socket.off('loadConversations', handleLoadConversations);
      socket.off('loadMessages', handleLoadMessages);
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [userId, activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const contactIdToSelect = location.state?.contactId;
    const itemTitleForMessage = location.state?.itemTitle;
    const shouldSendMessage = location.state?.initialMessage;

    if (shouldSendMessage && itemTitleForMessage && contactIdToSelect) {
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => conv.receiverId === contactIdToSelect);
      
      if (existingConversation) {
        // If conversation exists, just select it and send the message
        selectConversation(contactIdToSelect);
        sendInitialSystemMessage(contactIdToSelect, itemTitleForMessage);
      } else {
        // If no conversation exists, it will be created when sending the first message
        selectConversation(contactIdToSelect);
        sendInitialSystemMessage(contactIdToSelect, itemTitleForMessage);
      }
      
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, activeConversation, sendInitialSystemMessage, navigate, conversations, selectConversation]);

  const getSenderName = (senderId) => {
    if (senderId === userId) return 'You';
    const conv = conversations.find((c) => c.receiverId === senderId);
    return conv?.receiverName || senderId;
  };

  const sendMessage = () => {
    if (newMessage.trim() && activeConversation && !isSendingRef.current) {
      isSendingRef.current = true;
      const messageData = {
        senderId: userId,
        receiverId: activeConversation.id,
        content: newMessage,
        timestamp: new Date(),
        _id: `temp-${Date.now()}`,
      };
      setMessages((prevMessages) => [...prevMessages, messageData]);
      socket.emit('sendMessage', {
        senderId: userId,
        receiverId: activeConversation.id,
        content: newMessage,
      });
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
<div style={{ display: 'flex', maxWidth: '1000px', margin: '0 auto', height: '90vh' }}>
  <div
    style={{
      width: '120px',
      borderRight: '1px solid #ccc',
      overflowY: 'auto',
      backgroundColor: '#f1f1f1',
    }}
  >
    <h6 style={{ padding: '10px', borderBottom: '1px solid #ccc', backgroundColor: '#8cc9f1' }}>Conversation</h6>
    {conversations.length === 0 ? (
      <p style={{ padding: '10px' }}>No conversations yet.</p>
    ) : (
          conversations.map((conv) => (
            <div
              key={conv.receiverId}
              onClick={() => selectConversation(conv.receiverId)}
              style={{
                padding: '5px',
                cursor: 'pointer',
                backgroundColor: activeConversation?.id === conv.receiverId ? '#E0E0FF' : 'transparent',
                borderBottom: '1px solid #eee',
                direction: 'rtl',
              }}
            >
              <strong style={{ color: '#6353B5' }}>{conv.receiverName || conv.receiverId}</strong>
              {conv.lastMessage && (
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                  {conv.lastMessage.content.length > 20
                    ? `${conv.lastMessage.content.substring(0, 20)}...`
                    : conv.lastMessage.content}
                </p>
              )}
              {conv.lastMessage && (
                <small style={{ color: '#999' }}>
                  {new Date(conv.lastMessage.timestamp).toLocaleTimeString('he-IL')}
                </small>
              )}
            </div>
          ))
        )}
      </div>
      <div
        style={{
          flex: activeConversation ? 3 : 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {activeConversation ? (
          <>
            <div style={{ padding: '10px', borderBottom: '1px solid #ccc', backgroundColor: '#8cc9f1' }}>
              <h3>Chat with {activeConversation.name}</h3>
            </div>
            <div style={{ flex: 1, overflowY: 'scroll', padding: '10px', backgroundColor: '#fff' }}>
              {messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  style={{ textAlign: msg.senderId === userId ? 'right' : 'left', marginBottom: '10px' }}
                >
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
                    <small style={{ display: 'block', opacity: 0.7 }}>
                      {new Date(msg.timestamp).toLocaleString()}
                    </small>
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