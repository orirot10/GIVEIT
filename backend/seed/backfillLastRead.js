const mongoose = require('mongoose');
const ConversationParticipant = require('../models/ConversationParticipant');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI not set');
  }
  await mongoose.connect(uri);
  await ConversationParticipant.updateMany(
    { $or: [{ lastReadAt: { $exists: false } }, { lastReadAt: null }] },
    { $set: { lastReadAt: new Date() } }
  );
  console.log('Backfill complete');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Backfill failed', err);
  process.exit(1);
});
