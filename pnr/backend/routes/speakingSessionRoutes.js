const express = require('express');
const router = express.Router();
const SpeakingSession = require('../models/SpeakingSession');
const { getSpeakingSession, getSpeakingSessions, getSpeakingSessionDetails, saveSpeakingSession, getUserMessages } = require('../controllers/speakingSessionController');
const { v4: uuidv4 } = require('uuid');
const authenticate = require('../middleware/authenticate');
const mongoose = require('mongoose');

router.get('/', getSpeakingSessions);

router.get('/:id', getSpeakingSessionDetails);

router.get('/:conversationId', authenticate, getSpeakingSession);

router.post('/save', async (req, res) => {
  try {
    const { name, language, level, type, messages } = req.body;
    const conversationId = uuidv4();
    if (!Array.isArray(messages)) {
      throw new Error('Messages must be an array');
    }

    const newSession = new SpeakingSession({
      conversationId,
      name,
      language,
      level,
      type,
      messages: messages.map(message => ({
        text: message.text,
        from: new mongoose.Types.ObjectId(message.from),
        timestamp: message.timestamp || new Date(),
      })),
      
    });

    await newSession.save();
    res.status(201).json({ message: 'Speaking session saved successfully', conversationId });
  } catch (error) {
    console.error('Error saving speaking session:', error);
    res.status(500).json({ error: 'Failed to save speaking session' });
  }
});

router.post('/userMessages/save', async (req, res) => {
  try {
      const { conversationId, messages } = req.body;

      const session = await SpeakingSession.findById(conversationId);
      if (!session) {
          return res.status(404).json({ message: 'Speaking session not found' });
      }
      session.messages.push(...messages.map(msg => ({
          text: msg.text,
          from: msg.from,
          timestamp: new Date()
      })));

      await session.save();
      res.status(201).json({ message: 'User messages added successfully', conversationId });
  } catch (error) {
      console.error('Error saving user messages:', error);
      res.status(500).json({ error: 'Failed to save user messages' });
  }
});


module.exports = router;
