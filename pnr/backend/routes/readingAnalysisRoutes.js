const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
    getReadingSessions,
    getReadingSessionDetails,
    getReadingSessionsByConversationId,
    getReadingAnalysisDetails,
    saveReadingAnalysis,
    fetchReadingAnalysis
} = require('../controllers/readingAnalysisController');

router.get('/', authenticate, getReadingSessions);
router.get('/:id', authenticate, getReadingSessionDetails);
router.get('/by-conversation/:conversationId', authenticate, getReadingSessionsByConversationId);
router.get('/reading-analysis/:id', authenticate, getReadingAnalysisDetails);
router.post('/reading-analysis/save', authenticate, saveReadingAnalysis);
router.get('/reading-analysis/fetch/:conversationId', authenticate, fetchReadingAnalysis);

module.exports = router;
