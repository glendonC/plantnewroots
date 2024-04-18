const express = require('express');
const router = express.Router();
const WritingConversationAnalysis = require('../models/WritingConversationAnalysis');
const { analyzeSentiment, analyzeText } = require('../services/sentimentAnalysisService');
const authenticate = require('../middleware/authenticate');

router.get('/report', authenticate, async (req, res) => {
  try {
    const conversations = await WritingConversationAnalysis.find({
      participants: req.user.id
    }).populate('participants messages.from');
    console.log('Fetched conversations:', conversations);

    const sentimentScores = [];

    for (let conversation of conversations) {
      for (let message of conversation.messages) {
        const sentiment = await analyzeSentiment(message.text);
        sentimentScores.push(sentiment.score);
      }
    }
    const averageSentimentScore = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;

    res.json({
      sentimentScoreAverage: averageSentimentScore.toFixed(2),
      analysisCount: sentimentScores.length
    });
  } catch (error) {
    console.error('Error generating analysis report:', error);
    res.status(500).json({ error: 'Failed to generate analysis report' });
  }
});

// Example: Adjusting findById to findOne for UUID sessionId
router.get('/report/:sessionId', authenticate, async (req, res) => {
  console.log("Requested session ID:", req.params.sessionId);  // Log the incoming session ID
  try {
      const { sessionId } = req.params;
      const conversation = await WritingConversationAnalysis.findOne({ sessionId }).populate('participants messages.from');
      console.log("Fetched conversation:", conversation);  // Log the fetched conversation

      if (!conversation) {
          console.log("No conversation found for ID:", sessionId);  // Log if not found
          return res.status(404).json({ message: 'Conversation not found' });
      }

      const sentimentScores = conversation.messages.map(message => analyzeSentiment(message.text));
      const averageSentimentScore = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;

      res.json({
          sentimentScoreAverage: averageSentimentScore.toFixed(2),
          analysisCount: sentimentScores.length
      });
  } catch (error) {
      console.error('Error fetching specific analysis report:', error);
      res.status(500).json({ error: 'Failed to fetch specific analysis report' });
  }
});

router.post('/analyze', authenticate, async (req, res) => {
  console.log("Analyzing session with ID:", req.body.sessionId);
  try {
      const { sessionId } = req.body;
      const conversation = await WritingConversationAnalysis.findOne({ sessionId });

      if (!conversation) {
          console.log("No conversation found for analysis with ID:", sessionId);
          return res.status(404).json({ message: 'Conversation not found' });
      }

      if (!conversation.messages || conversation.messages.length === 0) {
          console.log("No messages available for analysis in conversation with ID:", sessionId);
          return res.status(400).json({ message: 'No messages available for analysis' });
      }

      const analysisPromises = conversation.messages.map(message => analyzeText(message.text));
      const analysisResults = await Promise.all(analysisPromises);

      res.json({ detailedAnalysis: analysisResults });
  } catch (error) {
      console.error("Error analyzing conversation with ID:", req.body.sessionId, error);
      res.status(500).json({ error: 'Failed to analyze conversation', details: error.message });
  }
});


router.get('/:sessionId', authenticate, async (req, res) => {
  const { sessionId } = req.params;
  try {
    const analysis = await WritingConversationAnalysis.findOne({ sessionId });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis data not found for the specified session ID' });
    }
    res.json(analysis);
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    res.status(500).json({ error: 'Failed to fetch analysis data' });
  }
});




router.post('/saveGeneratedText', authenticate, async (req, res) => {
  try {
    const { sessionId, generatedText } = req.body;

    if (!sessionId || !generatedText) {
      return res.status(400).json({ error: 'sessionId and generatedText are required' });
    }

    let analysis = await WritingConversationAnalysis.findOne({ sessionId });
    if (!analysis) {
      analysis = new WritingConversationAnalysis({
        sessionId,
        generatedText,
      });
    } else {
      analysis.generatedText = generatedText;
    }

    await analysis.save();

    res.json({ message: 'Generated text saved successfully' });
  } catch (error) {
    console.error('Error saving generated text:', error);
    res.status(500).json({ error: 'Failed to save generated text' });
  }
});



module.exports = router;
