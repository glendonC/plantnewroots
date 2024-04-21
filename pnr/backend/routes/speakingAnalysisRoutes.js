const express = require('express');
const router = express.Router();
const {
  getSpeakingAnalyses,
  getSpeakingAnalysisDetails,
  saveSpeakingAnalysis,
  fetchSpeakingAnalysis,
  analyzeSpeechQuality
} = require('../controllers/speakingAnalysisController');

router.get('/', getSpeakingAnalyses);

router.get('/:id', getSpeakingAnalysisDetails);

router.post('/save', saveSpeakingAnalysis);

router.get('/fetch/:conversationId', fetchSpeakingAnalysis);

router.post('/analyze', async (req, res) => {
    const { conversationId } = req.body;
    const session = await SpeakingSession.findById(conversationId);
  
    if (!session) {
      return res.status(404).json({ message: 'Speaking session not found' });
    }
    const analysisResults = session.messages.map(message => analyzeSpeech(message.text));
    res.json({ detailedAnalysis: analysisResults });
  });
  
module.exports = router;
