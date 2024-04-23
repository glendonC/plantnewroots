const mongoose = require('mongoose');

const SpeakingAnalysisSchema = new mongoose.Schema({
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

const SpeakingAnalysis = mongoose.model('SpeakingAnalysis', SpeakingAnalysisSchema);

module.exports = SpeakingAnalysis;
