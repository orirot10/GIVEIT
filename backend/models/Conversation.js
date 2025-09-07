const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  pairKey: { type: String, unique: true },
}, { timestamps: true });

conversationSchema.pre('validate', function(next) {
  if (!this.participants || this.participants.length !== 2) {
    return next(new Error('Conversation must have exactly 2 participants'));
  }
  const sorted = this.participants.map(id => id.toString()).sort();
  this.pairKey = `${sorted[0]}:${sorted[1]}`;
  this.participants = sorted; // store sorted to keep ordering
  next();
});

conversationSchema.index({ pairKey: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);
