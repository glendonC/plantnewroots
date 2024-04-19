const express = require('express');
const router = express.Router();
const { getReadingSessions, getReadingSessionDetails } = require('../controllers/readingAnalysisController');

router.get('/', getReadingSessions);

router.get('/:id', getReadingSessionDetails);

module.exports = router;
