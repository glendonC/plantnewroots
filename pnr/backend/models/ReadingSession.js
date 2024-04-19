const mongoose = require('mongoose');

const readingSessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: {
    text: { type: String, required: true },
    questions: [
      {
        query: { type: String, required: true }
      }
    ]
  },
  answers: { type: Map, of: String },
  feedback: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ReadingSession', readingSessionSchema);
