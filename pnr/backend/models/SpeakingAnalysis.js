const mongoose = require('mongoose');

const speakingAnalysisSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpeakingSession',
    required: true,
    unique: true
  },
  generatedText: {
    type: String,
    required: true,
  },
  accuracy: { type: Number, required: true },
  fluency: { type: Number, required: true },
  completeness: { type: Number, required: true },
  pronunciationScore: { type: Number, required: true },
  feedback: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('SpeakingAnalysis', speakingAnalysisSchema);
