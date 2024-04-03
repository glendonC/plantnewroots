const mongoose = require('mongoose');

const writingConversationSchema = new mongoose.Schema({
  participants: [String],
  messages: [{
    text: String,
    from: String,
    timestamp: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WritingConversation', writingConversationSchema);
