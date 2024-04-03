const express = require('express');
const router = express.Router();
const WritingConversation = require('../models/WritingConversation');
const { analyzeSentiment } = require('../services/sentimentAnalysisService');

const findUserId = (req, res, next) => {
  req.userId = 'test';
  next();
};

router.get('/report', findUserId, async (req, res) => {
  try {
    const conversations = await WritingConversation.find({ participants: req.userId });
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

module.exports = router;
