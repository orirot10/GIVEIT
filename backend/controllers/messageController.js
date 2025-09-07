const ConversationModel = require('../models/Conversation');
const ConversationParticipant = require('../models/ConversationParticipant');
const Message = require('../models/Message');
const User = require('../models/User');
const pushService = require('../services/pushService');

// helper to ensure conversation exists and participants created
async function getOrCreateConversation(userId1, userId2) {
  const sorted = [userId1.toString(), userId2.toString()].sort();
  const pairKey = `${sorted[0]}:${sorted[1]}`;
  let conversation = await ConversationModel.findOne({ pairKey });
  if (!conversation) {
    conversation = await ConversationModel.create({ participants: sorted });
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

async function countUnreadTotal(userId) {
  const parts = await ConversationParticipant.find({ userId });
  let total = 0;
  for (const part of parts) {
    const lastReadAt = part.lastReadAt || new Date(0);
    total += await Message.countDocuments({
      conversationId: part.conversationId,
      senderId: { $ne: userId },
      createdAt: { $gt: lastReadAt },
    });
  }
  return total;
}

exports.openConversation = async (req, res) => {
  try {
    const userId = req.user.mongoUser?._id || req.user._id || req.user.id;
    const { participantId } = req.body;
    if (!participantId) {
      return res.status(400).json({ message: 'participantId required' });
    }
    const conversation = await getOrCreateConversation(userId, participantId);
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: 'Failed to open conversation' });
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
      conversations.push({
        id: conv._id,
        participant: { id: otherId, name: otherUser ? `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || otherUser.id : otherId },
        lastMessage: lastMessage ? lastMessage.text : null,
        lastMessageAt: lastMessage ? lastMessage.createdAt : null,
        unreadCount,
      });
    }
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.mongoUser?._id || req.user._id || req.user.id;
    const conv = await ConversationModel.findById(conversationId);
    if (!conv || !conv.participants.map(p=>p.toString()).includes(userId.toString())) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    const senderId = req.user.mongoUser?._id || req.user._id || req.user.id;
    if (!text) {
      return res.status(400).json({ message: 'text required' });
    }
    const conv = await ConversationModel.findById(conversationId);
    if (!conv || !conv.participants.map(p=>p.toString()).includes(senderId.toString())) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    const message = await Message.create({ conversationId, senderId, text });
    await ConversationParticipant.updateOne({ conversationId, userId: senderId }, { $set: { lastReadAt: new Date() } });
    const receiverId = conv.participants.find(p => p.toString() !== senderId.toString());
    const unreadTotal = await countUnreadTotal(receiverId);
    await pushService.sendMessageNotification(receiverId, senderId, text, unreadTotal, conversationId);
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.mongoUser?._id || req.user._id || req.user.id;
    await ConversationParticipant.updateOne({ conversationId, userId }, { $set: { lastReadAt: new Date() } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};

exports.getUnreadTotal = async (req, res) => {
  try {
    const userId = req.user.mongoUser?._id || req.user._id || req.user.id;
    const total = await countUnreadTotal(userId);
    res.json({ unread_total: total });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get unread total' });
  }
};

exports.debugUnread = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.mongoUser?._id || req.user._id || req.user.id;
    const participant = await ConversationParticipant.findOne({ conversationId, userId });
    const lastReadAt = participant?.lastReadAt || new Date(0);
    const unreadCount = await countUnread(conversationId, userId);
    res.json({ lastReadAt, unreadCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get debug info' });
  }
};

module.exports._internal = { getOrCreateConversation, countUnread, countUnreadTotal };

// --- Socket helpers for backward compatibility ---
exports.getConversations = async (socket, userId) => {
  try {
    const req = { user: { _id: userId, mongoUser: { _id: userId } } };
    const res = { json: (data) => socket.emit('loadConversations', data) };
    await exports.listConversations(req, res);
  } catch (err) {
    socket.emit('loadConversations', []);
  }
};


exports.getMessagesSocket = async (socket, { userId, receiverId }) => {
  try {
    const conversation = await getOrCreateConversation(userId, receiverId);
    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
    socket.emit('loadMessages', messages);
  } catch (err) {
    socket.emit('loadMessages', []);
  }
};

exports.sendMessageSocket = async (data) => {
  const { senderId, receiverId, text } = data;
  const conversation = await getOrCreateConversation(senderId, receiverId);
  const message = await Message.create({ conversationId: conversation._id, senderId, text });
  await ConversationParticipant.updateOne({ conversationId: conversation._id, userId: senderId }, { $set: { lastReadAt: new Date() } });
  const unreadTotal = await countUnreadTotal(receiverId);
  await pushService.sendMessageNotification(receiverId, senderId, text, unreadTotal, conversation._id);
  return { ...message.toObject(), receiverId };
};

