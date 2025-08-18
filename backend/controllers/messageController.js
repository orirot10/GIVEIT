const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose'); // Import mongoose to validate ObjectId
const admin = require('firebase-admin');

// Load all messages for a user (used in the join event)
exports.loadMessages = async (userId) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ timestamp: 1 });
    return messages;
  } catch (err) {
    throw new Error('Failed to load messages');
  }
};

// Fetch conversations for a user
exports.getConversations = async (socket, userId) => {
  try {
    console.log('Fetching conversations for user:', userId);

    // Find all messages involving the user
    const messages = await Message.find({
      $or: [
        { senderId: userId.toString() },
        { receiverId: userId.toString() },
      ],
    }).sort({ timestamp: -1 });

    console.log('Messages found:', messages);

    if (messages.length === 0) {
      console.log('No messages found for this user.');
      socket.emit('loadConversations', []);
      return;
    }

    // Group messages by conversation partner
    const conversationsMap = new Map();
    for (const msg of messages) {
      console.log('Processing message:', msg);
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      console.log('Partner ID:', partnerId);
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          receiverId: partnerId,
          lastMessage: msg,
        });
      }
    }

    console.log('Conversations map:', Array.from(conversationsMap.entries()));

    // Convert map to array and fetch receiver names
    const conversations = await Promise.all(
      Array.from(conversationsMap.values()).map(async (conv) => {
        let receiverName = conv.receiverId; // Default to receiverId
        try {
          // Check if receiverId is a valid ObjectId
          const isValidObjectId = mongoose.Types.ObjectId.isValid(conv.receiverId);
          if (isValidObjectId) {
            const receiver = await User.findById(conv.receiverId);
            if (receiver) {
              receiverName = `${receiver.firstName} ${receiver.lastName}`;
            }
          } else {
            console.log(`Skipping User lookup for invalid ObjectId: ${conv.receiverId}`);
            // Optionally, you could try to find the user by another field if needed
            // For now, we'll just use the receiverId as the name
          }
        } catch (err) {
          console.error(`Error fetching user ${conv.receiverId}:`, err);
        }
        return {
          receiverId: conv.receiverId,
          receiverName,
          lastMessage: conv.lastMessage,
        };
      })
    );

    console.log('Conversations to send:', conversations);
    socket.emit('loadConversations', conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    socket.emit('loadConversations', []);
  }
};

// Fetch messages for a specific conversation
exports.getMessages = async (socket, { userId, receiverId }) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    socket.emit('loadMessages', messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    socket.emit('loadMessages', []);
  }
};

// Send a message
exports.sendMessage = async (messageData) => {
  try {
    const message = new Message({
      ...messageData,
      timestamp: new Date(),
      isRead: false,
    });
    await message.save();
    
    // Send push notification
    await sendPushNotification(messageData.receiverId, messageData.senderId, messageData.content);
    
    return message;
  } catch (err) {
    throw new Error('Failed to send message');
  }
};

// Send push notification
const sendPushNotification = async (receiverId, senderId, messageContent) => {
  try {
    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);
    
    if (!receiver || !receiver.fcmToken || !sender) {
      return;
    }

    const message = {
      notification: {
        title: `${sender.firstName} ${sender.lastName}`,
        body: messageContent
      },
      data: {
        senderId: senderId.toString(),
        type: 'message'
      },
      token: receiver.fcmToken
    };

    await admin.messaging().send(message);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};