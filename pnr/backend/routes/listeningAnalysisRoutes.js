const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { 
    getListeningAnalysisDetails, 
    saveListeningAnalysis, 
    fetchListeningAnalysis 
} = require('../controllers/listeningAnalysisController');

router.get('/listening-analysis/:id', authenticate, getListeningAnalysisDetails);
router.post('/listening-analysis/save', authenticate, saveListeningAnalysis);
router.get('/listening-analysis/fetch/:conversationId', authenticate, fetchListeningAnalysis);

module.exports = router;
