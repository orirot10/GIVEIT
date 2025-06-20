import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthContext } from '../context/AuthContext';
import RealtimeChat from './RealtimeChat';

const ChatList = () => {
  const { user } = useAuthContext();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getOtherParticipant = (chat) => {
    const otherUid = chat.participants.find(uid => uid !== user.uid);
    return {
      uid: otherUid,
      name: chat.participantNames?.[otherUid] || 'Unknown User'
    };
  };

  if (loading) return <div>Loading chats...</div>;

  return (
    <div className="chat-list-container">
      {!selectedChat ? (
        <div className="chat-list">
          <h2>Your Conversations</h2>
          {chats.length === 0 ? (
            <p>No conversations yet</p>
          ) : (
            chats.map(chat => {
              const otherUser = getOtherParticipant(chat);
              return (
                <div 
                  key={chat.id} 
                  className="chat-item"
                  onClick={() => setSelectedChat({ chat, otherUser })}
                >
                  <h3>{otherUser.name}</h3>
                  <p>{chat.lastMessage}</p>
                  <small>
                    {chat.lastMessageTime?.toDate?.()?.toLocaleString()}
                  </small>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="chat-view">
          <button 
            onClick={() => setSelectedChat(null)}
            className="back-button"
          >
            ← Back to Chats
          </button>
          <RealtimeChat 
            otherUserId={selectedChat.otherUser.uid}
            otherUserName={selectedChat.otherUser.name}
          />
        </div>
      )}
    </div>
  );
};

export default ChatList;