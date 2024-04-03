const mongoose = require('mongoose');

const writingConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{
    text: String,
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WritingConversation', writingConversationSchema);
