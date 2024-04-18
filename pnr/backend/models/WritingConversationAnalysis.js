const mongoose = require('mongoose');

const WritingConversationAnalysisSchema = new mongoose.Schema({
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

const WritingConversationAnalysis = mongoose.model('WritingConversationAnalysis', WritingConversationAnalysisSchema);

module.exports = WritingConversationAnalysis;
