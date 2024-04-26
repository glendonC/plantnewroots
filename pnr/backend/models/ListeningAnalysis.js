const mongoose = require('mongoose');

const listeningAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ListeningSession',
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

module.exports = mongoose.model('ListeningAnalysis', listeningAnalysisSchema);
