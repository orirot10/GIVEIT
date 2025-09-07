const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const ConversationParticipant = require('../models/ConversationParticipant');
const User = require('../models/User');
const pushService = require('../services/pushService');

async function getOrCreateConversation(userId1, userId2) {
  const sorted = [userId1.toString(), userId2.toString()].sort();
  const pairKey = `${sorted[0]}:${sorted[1]}`;
  let conversation = await Conversation.findOne({ pairKey });
  if (!conversation) {
    conversation = await Conversation.create({ participants: sorted });
    await ConversationParticipant.create({ conversationId: conversation._id, userId: sorted[0] });
    await ConversationParticipant.create({ conversationId: conversation._id, userId: sorted[1] });
  }
  return conversation;
}

async function countUnread(conversationId, userId) {
  const participant = await ConversationParticipant.findOne({ conversationId, userId });
  const lastReadAt = participant?.lastReadAt || new Date(0);
  return Message.countDocuments({
    conversationId,
    senderId: { $ne: userId },
    createdAt: { $gt: lastReadAt },
  });
}

exports.getConversations = async (socket, userId) => {
  try {
    const parts = await ConversationParticipant.find({ userId }).populate('conversationId');
    const conversations = [];
    for (const part of parts) {
      const conv = part.conversationId;
      const otherId = conv.participants.find(p => p.toString() !== userId.toString());
      const otherUser = await User.findById(otherId);
      const lastMessage = await Message.findOne({ conversationId: conv._id }).sort({ createdAt: -1 });
      const unreadCount = await countUnread(conv._id, userId);
      const receiverName = otherUser
        ? `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || otherUser.id
        : otherId;
      conversations.push({
        conversationId: conv._id,
        receiverId: otherId,
        receiverName,
        lastMessage,
        unreadCount,
      });
    }
    socket.emit('loadConversations', conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    socket.emit('loadConversations', []);
  }
};

exports.listConversations = async (req, res) => {
  try {
    const userId = req.user.mongoUser?._id || req.user._id || req.user.id;
    const parts = await ConversationParticipant.find({ userId }).populate('conversationId');
    const conversations = [];
    for (const part of parts) {
      const conv = part.conversationId;
      const otherId = conv.participants.find(p => p.toString() !== userId.toString());
      const otherUser = await User.findById(otherId);
      const lastMessage = await Message.findOne({ conversationId: conv._id }).sort({ createdAt: -1 });
      const unreadCount = await countUnread(conv._id, userId);
      const receiverName = otherUser
        ? `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || otherUser.id
        : otherId;
      conversations.push({
        conversationId: conv._id,
        participant: { id: otherId, name: receiverName },
        lastMessage,
        unreadCount,
      });
    }
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

exports.getMessages = async (socket, { userId, receiverId }) => {
  try {
    const conversation = await getOrCreateConversation(userId, receiverId);
    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
    socket.emit('loadMessages', messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    socket.emit('loadMessages', []);
  }
};

exports.getMessagesHttp = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.mongoUser?._id || req.user._id || req.user.id;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.map(p=>p.toString()).includes(userId.toString())) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get messages' });
  }
};

exports.sendMessage = async (data) => {
  try {
    const { senderId, receiverId, content } = data;
    const conversation = await getOrCreateConversation(senderId, receiverId);
    const message = await Message.create({ conversationId: conversation._id, senderId, content });
    await ConversationParticipant.updateOne({ conversationId: conversation._id, userId: senderId }, { $set: { lastReadAt: new Date() } });
    await pushService.sendMessageNotification(receiverId, senderId, content);
    return { ...message.toObject(), receiverId };
  } catch (err) {
    throw new Error('Failed to send message');
  }
};

exports.sendMessageHttp = async (req, res) => {
  try {
    const senderId = req.user.mongoUser?._id || req.user._id || req.user.id;
    const { receiverId, content } = req.body;
    const conversation = await getOrCreateConversation(senderId, receiverId);
    const message = await Message.create({ conversationId: conversation._id, senderId, content });
    await ConversationParticipant.updateOne({ conversationId: conversation._id, userId: senderId }, { $set: { lastReadAt: new Date() } });
    await pushService.sendMessageNotification(receiverId, senderId, content);
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.mongoUser?._id || req.user._id || req.user.id; // extract user id
    await ConversationParticipant.updateOne({ conversationId, userId }, { $set: { lastReadAt: new Date() } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};

exports.unreadTotal = async (req, res) => {
  try {
    const userId = req.user.mongoUser?._id || req.user._id || req.user.id;
    const participants = await ConversationParticipant.find({ userId });
    let total = 0;
    for (const p of participants) {
      const count = await Message.countDocuments({
        conversationId: p.conversationId,
        senderId: { $ne: userId },
        createdAt: { $gt: p.lastReadAt || new Date(0) },
      });
      total += count;
    }
    res.json({ unreadTotal: total });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get unread total' });
  }
};
