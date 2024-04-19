const ReadingSession = require('../models/ReadingSession');

const getReadingSessions = async (req, res) => {
  try {
    const sessions = await ReadingSession.find({});
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reading sessions', error: error.message });
  }
};

const getReadingSessionDetails = async (req, res) => {
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

const getReadingSessionsByConversationId = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const sessions = await ReadingSession.find({ conversationId });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch reading sessions for conversation ID: ${req.params.conversationId}`, error: error.message });
  }
};

module.exports = { getReadingSessions, getReadingSessionDetails, getReadingSessionsByConversationId };
