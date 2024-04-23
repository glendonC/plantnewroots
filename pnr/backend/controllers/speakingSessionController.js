const SpeakingSession = require('../models/SpeakingSession');
const { v4: uuidv4 } = require('uuid');
exports.getSpeakingSessions = async (req, res) => {
  try {
    const sessions = await SpeakingSession.find({});
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch speaking sessions', error: error.message });
  }
};

exports.getSpeakingSession = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const speakingSession = await SpeakingSession.findOne({ conversationId });
    if (!speakingSession) {
      return res.status(404).json({ message: 'Speaking session not found' });
    }
    res.json(speakingSession);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch speaking session', error: error.message });
  }
};

exports.getSpeakingSessionDetails = async (req, res) => {
  try {
    const session = await SpeakingSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Speaking session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch speaking session details', error: error.message });
  }
};

exports.saveSpeakingSession = async (req, res) => {
  try {
    const { name, language, level, type, messages } = req.body;
    const conversationId = uuidv4();

    if (!Array.isArray(messages)) {
      throw new Error('Messages must be an array');
    }

    const newSession = new SpeakingSession({
      conversationId,
      name,
      language,
      level,
      type,
      messages: messages.map(message => ({
        text: message.text,
        from: new mongoose.Types.ObjectId(message.from),
        timestamp: message.timestamp || new Date(),
      })),
    });

    await newSession.save();
    res.status(201).json({ message: 'Speaking session saved successfully', conversationId });
  } catch (error) {
    console.error('Error saving speaking session:', error);
    res.status(500).json({ error: 'Failed to save speaking session' });
  }
};
