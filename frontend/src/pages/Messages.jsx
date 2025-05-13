import React from 'react';
import Messages from '../components/Messages';
import { useAuthContext } from '../context/AuthContext'; // adjust the path as needed

const MessagesPage = () => {
  const { user } = useAuthContext();
  console.log(user); // Debugging: log user info

  return (
    <div>
      <h2>Chat</h2>
      {!user ? (
        <p>Loading... you're not logged in yet.</p>
      ) : (
        <Messages userId={user.user.id} />
      )}
    </div>
  );
};

export default MessagesPage;
