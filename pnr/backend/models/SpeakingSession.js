const mongoose = require('mongoose');

const speakingSessionSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  name: { type: String, required: true },
  language: { type: String, required: true },
  level: { type: String, required: true },
  type: { type: String, required: true, default: 'speaking' },
  messages: [{
    text: String,
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SpeakingSession', speakingSessionSchema);
