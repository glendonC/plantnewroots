const ListeningSession = require('../models/ListeningSession');

exports.getListeningSessions = async (req, res) => {
  try {
    const sessions = await ListeningSession.find({});
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch listening sessions', error: error.message });
  }
};

exports.getListeningSessionDetails = async (req, res) => {
  try {
    const session = await ListeningSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Listening session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch listening session details', error: error.message });
  }
};

exports.saveListeningSession = async (req, res) => {
  try {
    const { conversationId, name, content, answers, feedback } = req.body;
    const newSession = new ListeningSession({
      conversationId,
      name,
      type: 'listening',
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
