const express = require('express');
const router = express.Router();
const ListeningAnalysis = require('../models/ListeningAnalysis');
const { getListeningAnalyses, getListeningAnalysisDetails } = require('../controllers/listeningAnalysisController');

router.get('/', getListeningAnalyses);

router.get('/:id', getListeningAnalysisDetails);

router.post('/', async (req, res) => {
  try {
    const { conversationId, text, analysis } = req.body;
    const newAnalysis = new ListeningAnalysis({
      conversationId,
      text,
      analysis
    });

    await newAnalysis.save();
    res.status(201).json({ message: 'Listening analysis saved successfully', newAnalysis });
  } catch (error) {
    console.error('Error saving listening analysis:', error);
    res.status(500).json({ error: 'Failed to save listening analysis' });
  }
});

module.exports = router;
