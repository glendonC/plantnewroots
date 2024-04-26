const ReadingSession = require('../models/ReadingSession');
const ReadingAnalysis = require('../models/ReadingAnalysis');

const getReadingSessions = async (req, res) => {
  try {
    const sessions = await ReadingSession.find({ userId: req.user.id });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reading sessions', error: error.message });
  }
};

const getReadingSessionDetails = async (req, res) => {
  try {
    const session = await ReadingSession.findOne({ _id: req.params.id, userId: req.user.id });
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
    const sessions = await ReadingSession.find({ conversationId, userId: req.user.id });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch reading sessions for conversation ID: ${req.params.conversationId}`, error: error.message });
  }
};

const getReadingAnalysisDetails = async (req, res) => {
  try {
    const session = await ReadingSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Reading session not found' });
    }

    const feedback = session.feedback || "No feedback available";

    res.json({
      text: session.content.text,
      feedback
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reading analysis details', error: error.message });
  }
};

const saveReadingAnalysis = async (req, res) => {
  const { conversationId, text, analysis } = req.body;

  if (!conversationId || !text || !analysis) {
    console.error("Validation Error: Top-level fields missing", { conversationId, text, analysis });
    return res.status(400).json({ message: "Required fields are missing or incomplete." });
  }

  try {
    let savedAnalysis;
    const existingAnalysis = await ReadingAnalysis.findOne({ conversationId, userId: req.user.id });

    if (existingAnalysis) {
      existingAnalysis.text = text;
      existingAnalysis.analysis = analysis;
      savedAnalysis = await existingAnalysis.save();
    } else {
      const newAnalysis = new ReadingAnalysis({
        userId: req.user.id,
        conversationId,
        text,
        analysis
      });
      savedAnalysis = await newAnalysis.save();
    }

    res.status(201).json({ message: 'Reading analysis saved successfully', analysis: savedAnalysis });
  } catch (error) {
    console.error("Error saving reading analysis:", error);
    res.status(500).json({ message: "Failed to save reading analysis", details: error.message });
  }
};


const fetchReadingAnalysis = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const analysis = await ReadingAnalysis.findOne({ conversationId, userId: req.user.id });
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analysis', error: error.message });
  }
};


module.exports = {
  getReadingSessions,
  getReadingSessionDetails,
  getReadingSessionsByConversationId,
  getReadingAnalysisDetails,
  saveReadingAnalysis,
  fetchReadingAnalysis
};
