const express = require('express');
const router = express.Router();
const ReadingSession = require('../models/ReadingSession');
const { analyzeReadingSession } = require('../services/ReadingAnalysisService');
const authenticate = require('../middleware/authenticate');

router.get('/report', authenticate, async (req, res) => {
  try {
    const readingSessions = await ReadingSession.find({ userId: req.user._id });
    const analysisResults = await analyzeReadingSession(readingSessions);
    res.json(analysisResults);
  } catch (error) {
    console.error('Error generating reading session report:', error);
    res.status(500).json({ error: 'Failed to generate reading session report' });
  }
});

router.get('/report/:sessionId', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const readingSession = await ReadingSession.findById(sessionId);

    if (!readingSession) {
      return res.status(404).json({ message: 'Reading session not found' });
    }

    const analysisResult = await analyzeReadingSession([readingSession]);
    res.json(analysisResult);
  } catch (error) {
    console.error('Error fetching specific reading session report:', error);
    res.status(500).json({ error: 'Failed to fetch specific reading session report' });
  }
});

router.post('/analyze', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const readingSession = await ReadingSession.findById(sessionId);

    const analysisResult = await analyzeReadingSession([readingSession]);
    res.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing reading session:', error);
    res.status(500).json({ error: 'Failed to analyze reading session' });
  }
});

router.post('/saveGeneratedText', authenticate, async (req, res) => {
  try {
    const { sessionId, generatedText } = req.body;

    if (!sessionId || !generatedText) {
      return res.status(400).json({ error: 'sessionId and generatedText are required' });
    }

    let analysis = await ReadingSession.findById(sessionId);
    if (analysis) {
      analysis.generatedText = generatedText;
      await analysis.save();
      res.json({ message: 'Generated text saved successfully' });
    } else {
      return res.status(404).json({ message: 'Reading session not found' });
    }
  } catch (error) {
    console.error('Error saving generated text for reading');
    res.status(500).json({ error: 'Failed to save generated text' });
  }
});



module.exports = router;