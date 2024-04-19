const express = require('express');
const router = express.Router();
const { getReadingSessions, getReadingSessionDetails, getReadingSessionsByConversationId, getReadingAnalysisDetails } = require('../controllers/readingAnalysisController');

router.get('/', getReadingSessions);

router.get('/:id', getReadingSessionDetails);

router.get('/by-conversation/:conversationId', getReadingSessionsByConversationId);
router.get('/reading-analysis/:id', getReadingAnalysisDetails);

module.exports = router;
