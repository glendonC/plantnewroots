const mongoose = require('mongoose');

const WritingConversationAnalysisSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // References to users involved
  messages: [{
    text: String,
    from: mongoose.Schema.Types.ObjectId, // Reference to the sender
    timestamp: Date
  }],
  generatedText: {
    type: String,
    required: true,
  },
  analysisType: {
    type: String,
    enum: ['sentiment', 'complexity', 'custom'], // Example types of analysis
    default: 'sentiment'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true // This automatically adds 'createdAt' and 'updatedAt' fields
});

const WritingConversationAnalysis = mongoose.model('WritingConversationAnalysis', WritingConversationAnalysisSchema);

module.exports = WritingConversationAnalysis;
