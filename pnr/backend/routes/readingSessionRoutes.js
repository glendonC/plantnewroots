const express = require('express');
const router = express.Router();
const ReadingSession = require('../models/ReadingSession');
const { getReadingSessions, getReadingSessionDetails } = require('../controllers/readingSessionController');
const { v4: uuidv4 } = require('uuid');

router.get('/', getReadingSessions);

router.get('/:id', getReadingSessionDetails);

router.post('/save', async (req, res) => {
  try {
    const { name, content, answers, feedback } = req.body;
    const conversationId = uuidv4();

    const newSession = new ReadingSession({
      conversationId,
      name,
      content,
      answers,
      feedback,
    });

    await newSession.save();
    res.status(201).json({ message: 'Reading session saved successfully', conversationId });
  } catch (error) {
    console.error('Error saving reading session:', error);
    res.status(500).json({ error: 'Failed to save reading session' });
  }
});
  
module.exports = router;
