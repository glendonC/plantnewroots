const mongoose = require('mongoose');

const ReadingAnalysisSchema = new mongoose.Schema({
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
      required: false
    },
    feedback: {
      type: String,
      required: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ReadingAnalysis', ReadingAnalysisSchema);