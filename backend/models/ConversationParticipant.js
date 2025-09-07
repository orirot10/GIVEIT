const mongoose = require('mongoose');

const conversationParticipantSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastReadAt: { type: Date, default: null },
}, { timestamps: true });

// Ensure fast lookups by user and conversation while preventing duplicates
conversationParticipantSchema.index({ userId: 1, conversationId: 1 }, { unique: true });

module.exports = mongoose.model('ConversationParticipant', conversationParticipantSchema);
