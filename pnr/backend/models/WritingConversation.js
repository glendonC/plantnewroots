const mongoose = require('mongoose');

const writingConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{
    text: String,
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],
  conversationId: { type: String, required: true },
  name: { type: String, required: true },
  tag: { type: String, required: true },
  type: { type: String, required: true, default: 'writing' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WritingConversation', writingConversationSchema);
