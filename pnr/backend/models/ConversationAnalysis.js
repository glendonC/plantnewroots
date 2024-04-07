const mongoose = require('mongoose');

const ConversationAnalysisSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    unique: true,
  },
  generatedText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ConversationAnalysis = mongoose.model('ConversationAnalysis', ConversationAnalysisSchema);

module.exports = ConversationAnalysis;
