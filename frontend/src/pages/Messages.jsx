import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ChatList from '../components/ChatList';
import RealtimeChat from '../components/RealtimeChat';
import '../styles/Chat.css';
//import './Messages.css';

function Messages() {
    const { user } = useAuthContext();
    const location = useLocation();
    const [directChat, setDirectChat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle direct chat initialization from navigation state
    useEffect(() => {
        const initializeChat = async () => {
            if (!user || !location.state || !location.state.contactId) return;
            
            try {
                setLoading(true);
                const { contactId, contactName, itemTitle } = location.state;
                
                // Create chat ID by sorting UIDs
                const chatId = [user.uid, contactId].sort().join('_');
                
                // Check if chat already exists
                const chatsRef = collection(db, 'chats');
                const q = query(chatsRef, where('participants', 'array-contains', user.uid));
                const querySnapshot = await getDocs(q);
                
                let existingChat = null;
                querySnapshot.forEach(doc => {
                    const chatData = doc.data();
                    if (chatData.participants.includes(contactId)) {
                        existingChat = { id: doc.id, ...chatData };
                    }
                });
                
                // Create or update chat document
                const chatRef = doc(db, 'chats', chatId);
                await setDoc(chatRef, {
                    participants: [user.uid, contactId],
                    participantNames: {
                        [user.uid]: user.displayName || 'User',
                        [contactId]: contactName || 'User'
                    },
                    lastMessage: itemTitle ? `Interested in: ${itemTitle}` : 'New conversation',
                    lastMessageTime: serverTimestamp(),
                    createdAt: serverTimestamp()
                }, { merge: true });
                
                // Set direct chat
                setDirectChat({
                    otherUserId: contactId,
                    otherUserName: contactName || 'User'
                });
                
            } catch (err) {
                console.error('Error initializing chat:', err);
                setError('Failed to initialize chat');
            } finally {
                setLoading(false);
            }
        };
        
        initializeChat();
    }, [user, location.state]);

    if (!user) {
        return <div className="messages-container">Please log in to view messages.</div>;
    }
    
    if (loading) {
        return <div className="messages-container">Initializing chat...</div>;
    }
    
    if (error) {
        return <div className="messages-container">Error: {error}</div>;
    }

    return (
        <div className="messages-container">
            {directChat ? (
                <div className="chat-view">
                    <button 
                        onClick={() => setDirectChat(null)}
                        className="back-button"
                    >
                        ← Back to Chats
                    </button>
                    <RealtimeChat 
                        otherUserId={directChat.otherUserId}
                        otherUserName={directChat.otherUserName}
                        initialMessage={location.state?.itemTitle ? `Interested in: ${location.state.itemTitle}` : null}
                    />
                </div>
            ) : (
                <ChatList />
            )}
        </div>
    );
}

export default Messages;
