const mongoose = require('mongoose');

const ReadingSessionAnalysisSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReadingSession',
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
  },
});

const ReadingSessionAnalysis = mongoose.model('ReadingSessionAnalysis', ReadingSessionAnalysisSchema);

module.exports = ReadingSessionAnalysis;
