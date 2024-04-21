const express = require('express');
const router = express.Router();
const ListeningSession = require('../models/ListeningSession');
const { getListeningSessions, getListeningSessionDetails } = require('../controllers/listeningSessionController');
const { v4: uuidv4 } = require('uuid');

router.get('/', getListeningSessions);

router.get('/:id', getListeningSessionDetails);

router.post('/save', async (req, res) => {
  try {
    const { name, content, answers, feedback } = req.body;
    const conversationId = uuidv4();

    const newSession = new ListeningSession({
      conversationId,
      name,
      content,
      answers,
      feedback,
    });

    await newSession.save();
    res.status(201).json({ message: 'Listening session saved successfully', conversationId });
  } catch (error) {
    console.error('Error saving listening session:', error);
    res.status(500).json({ error: 'Failed to save listening session' });
  }
});
  
module.exports = router;
