const mongoose = require('mongoose');

const listeningSessionSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true, default: 'listening' },
  content: {
    text: { type: String, required: true },
    questions: [
      {
        query: { type: String, required: true }
      }
    ],
    audioUrl: { type: String }
  },
  answers: { type: Map, of: String },
  feedback: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ListeningSession', listeningSessionSchema);
