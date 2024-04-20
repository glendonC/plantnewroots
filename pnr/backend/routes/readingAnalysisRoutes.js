const express = require('express');
const router = express.Router();
const { getReadingSessions, getReadingSessionDetails, getReadingSessionsByConversationId, getReadingAnalysisDetails, saveReadingAnalysis, fetchReadingAnalysis } = require('../controllers/readingAnalysisController');

router.get('/', getReadingSessions);
router.get('/:id', getReadingSessionDetails);
router.get('/by-conversation/:conversationId', getReadingSessionsByConversationId);
router.get('/reading-analysis/:id', getReadingAnalysisDetails);
router.post('/reading-analysis/save', saveReadingAnalysis);
router.get('/reading-analysis/fetch/:conversationId', fetchReadingAnalysis);

module.exports = router;
