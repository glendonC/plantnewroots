const ReadingSession = require('../models/ReadingSession');

exports.getReadingSessions = async (req, res) => {
  try {
    const sessions = await ReadingSession.find({});
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reading sessions', error: error.message });
  }
};

exports.getReadingSessionDetails = async (req, res) => {
  try {
    const session = await ReadingSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Reading session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reading session details', error: error.message });
  }
};

exports.saveReadingSession = async (req, res) => {
  try {
    const { conversationId, name, content, answers, feedback } = req.body;
    const newSession = new ReadingSession({
      conversationId,
      name,
      type: 'reading',
      content,
      answers,
      feedback
    });

    await newSession.save();
    res.status(201).json({ message: "Session saved successfully", session: newSession });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save session', error: error.message });
  }
};

