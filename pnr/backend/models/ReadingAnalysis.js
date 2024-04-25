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
    grammar: {
      errors: { type: Number, default: 0 },
      suggestions: { type: String, default: '' }
    },
    vocabulary: {
      appropriateness: { type: String, default: '' },
      recommendations: { type: String, default: '' }
    },
    comprehension: {
      level: { type: String, default: '' },
      tips: { type: String, default: '' }
    },
    exercises: { type: String, default: '' },
    feedback: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('ReadingAnalysis', ReadingAnalysisSchema);