const express = require('express');
const router = express.Router();
const WritingConversation = require('../models/WritingConversation');
const { analyzeSentiment, analyzeText } = require('../services/sentimentAnalysisService');
const authenticate = require('../middleware/authenticate');

router.get('/report', authenticate, async (req, res) => {
  try {
    const conversations = await WritingConversation.find({
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

router.post('/analyze', async (req, res) => {
  try {
    const { conversationId } = req.body;
    const conversation = await WritingConversation.findById(conversationId);

    const analysisPromises = conversation.messages.map(message =>
      analyzeText(message.text)
    );
    const analysisResults = await Promise.all(analysisPromises);

    // process analysisResults to identify mistakes, strengths, etc
    res.json({ detailedAnalysis: analysisResults });
  } catch (error) {
    console.error("Error analyzing conversation:", error);
    res.status(500).json({ error: 'Failed to analyze conversation' });
  }
});

module.exports = router;
