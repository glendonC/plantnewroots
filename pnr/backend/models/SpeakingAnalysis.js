const mongoose = require('mongoose');

const SpeakingAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpeakingSession',
    required: true,
    unique: true
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

const SpeakingAnalysis = mongoose.model('SpeakingAnalysis', SpeakingAnalysisSchema);

module.exports = SpeakingAnalysis;
