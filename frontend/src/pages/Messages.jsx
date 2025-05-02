import React from 'react';
import Messages from '../components/Messages';
import { useAuthContext } from '../context/AuthContext'; // adjust the path as needed

const MessagesPage = () => {
  const { user } = useAuthContext(); // Access user from context
  console.log(user); // 👈 Put it here!

  if (!user) {
    return <p>Loading...</p>; // Or redirect to login if user is not authenticated
  }

  return <Messages userId={user.user.id} />;
};

export default MessagesPage;
