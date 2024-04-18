const express = require('express');
const router = express.Router();
const WritingConversation = require('../models/WritingConversation');
const { analyzeSentiment, analyzeText } = require('../services/sentimentAnalysisService');
const authenticate = require('../middleware/authenticate');

const WritingConversationAnalysis = require('../models/WritingConversationAnalysis');

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

router.get('/report/:conversationId', authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await WritingConversation.findById(conversationId).populate('participants messages.from');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const sentimentScores = [];
    for (let message of conversation.messages) {
      const sentiment = await analyzeSentiment(message.text);
      sentimentScores.push(sentiment.score);
    }
    
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

router.get('/:conversationId', authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const analysis = await WritingConversationAnalysis.findOne({ conversationId });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis data not found for the specified conversation ID' });
    }

    res.json(analysis);
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    res.status(500).json({ error: 'Failed to fetch analysis data' });
  }
});


router.post('/saveGeneratedText', authenticate, async (req, res) => {
  try {
    const { conversationId, generatedText } = req.body;

    if (!conversationId || !generatedText) {
      return res.status(400).json({ error: 'conversationId and generatedText are required' });
    }

    let analysis = await WritingConversationAnalysis.findOne({ conversationId });
    if (!analysis) {
      analysis = new WritingConversationAnalysis({
        conversationId,
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
