const express = require('express');
const router = express.Router();
const {
  getSpeakingAnalyses,
  getSpeakingAnalysisDetails,
  saveSpeakingAnalysis,
  fetchSpeakingAnalysis,
  saveGeneratedText,
  analyzeSpeakingSession,
  getSpecificSpeakingAnalysis,
  getGeneralSpeakingReport
} = require('../controllers/speakingAnalysisController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, getSpeakingAnalyses);

router.get('/details/:conversationId', authenticate, getSpeakingAnalysisDetails);


router.get('/fetch/:conversationId', authenticate, fetchSpeakingAnalysis);

router.get('/report', authenticate, getGeneralSpeakingReport);


router.get('/report/:conversationId', authenticate, getSpecificSpeakingAnalysis);

router.post('/analyze', authenticate, analyzeSpeakingSession);


router.post('/save', authenticate, saveSpeakingAnalysis);

router.post('/saveGeneratedText', authenticate, saveGeneratedText);

module.exports = router;
