const mongoose = require('mongoose');

const writingConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{
    text: String,
    from: mongoose.Schema.Types.ObjectId,
    timestamp: Date
  }],
  name: String,
  tag: String,
  sessionId: { type: String, required: true },
  type: { type: String, enum: ['full', 'user'], default: 'full' } // Assuming 'full' is the default type for complete conversations
}, { collection: 'writingconversations' });

const WritingConversation = mongoose.model('WritingConversation', writingConversationSchema);

module.exports = WritingConversation;
