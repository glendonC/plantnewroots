const express = require('express');
const router = express.Router();
const { 
    getListeningAnalysisDetails, 
    saveListeningAnalysis, 
    fetchListeningAnalysis 
} = require('../controllers/listeningAnalysisController');

router.get('/listening-analysis/:id', getListeningAnalysisDetails);
router.post('/listening-analysis/save', saveListeningAnalysis);
router.get('/listening-analysis/fetch/:conversationId', fetchListeningAnalysis);

module.exports = router;
