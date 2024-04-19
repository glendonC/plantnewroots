const express = require('express');
const router = express.Router();
const { getReadingSessions, getReadingSessionDetails, getReadingSessionsByConversationId } = require('../controllers/readingAnalysisController');

router.get('/', getReadingSessions);

router.get('/:id', getReadingSessionDetails);

router.get('/by-conversation/:conversationId', getReadingSessionsByConversationId);

module.exports = router;
