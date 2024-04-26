const mongoose = require('mongoose');

const ReadingAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReadingSession',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  analysis: {
    generatedText: {
      type: String,
      required: true
    },
    analysisText: {
      type: String,
      optional: true
    },
    feedback: {
      type: String,
      optional: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ReadingAnalysis', ReadingAnalysisSchema);
