import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthContext } from '../context/AuthContext';
import RealtimeChat from './RealtimeChat';
import { useTranslation } from 'react-i18next';

const ChatList = () => {
  const { user } = useAuthContext();
  const { t } = useTranslation();
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
    <div className="chat-list-container" style={{ background: '#F4F6F8', color: '#1C2526' }}>
      {!selectedChat ? (
        <div className="chat-list">
          <h2 style={{ color: '#26A69A' }}>{t('messages.conversations')}</h2>
          {chats.length === 0 ? (
            <p style={{ color: '#607D8B' }}>No conversations yet</p>
          ) : (
            chats.map(chat => {
              const otherUser = getOtherParticipant(chat);
              return (
                <div 
                  key={chat.id} 
                  className="chat-item"
                  style={{ background: '#fff', border: '1px solid #607D8B', color: '#1C2526' }}
                  onClick={() => setSelectedChat({ chat, otherUser })}
                >
                  <h3 style={{ color: '#26A69A' }}>{otherUser.name}</h3>
                  <p style={{ color: '#607D8B' }}>{chat.lastMessage}</p>
                  <small style={{ color: '#607D8B' }}>
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
            style={{ background: 'linear-gradient(135deg, #607D8B, #26A69A)', color: '#fff' }}
          >
            {t('back')}
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