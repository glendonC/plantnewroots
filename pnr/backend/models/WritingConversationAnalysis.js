const mongoose = require('mongoose');

const WritingConversationAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WritingSession',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['full', 'user']
  },
  generatedText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

WritingConversationAnalysisSchema.index({ conversationId: 1, type: 1 }, { unique: true });

const WritingConversationAnalysis = mongoose.model('WritingConversationAnalysis', WritingConversationAnalysisSchema);

module.exports = WritingConversationAnalysis;
