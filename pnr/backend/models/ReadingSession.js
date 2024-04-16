const mongoose = require('mongoose');

const readingSessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  questions: [{ query: String }],
  answers: [String]
});

const ReadingSession = mongoose.model('ReadingSession', readingSessionSchema);

module.exports = ReadingSession;
