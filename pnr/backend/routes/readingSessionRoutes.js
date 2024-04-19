const express = require('express');
const router = express.Router();
const ReadingSession = require('../models/ReadingSession');

router.post('/save', async (req, res) => {
    try {
      const { name, content, answers, feedback } = req.body;
      const newSession = new ReadingSession({ name, content, answers, feedback });
      await newSession.save();
      res.status(201).send({ message: "Session saved successfully", session: newSession });
    } catch (error) {
      console.error('Failed to save session:', error);
      res.status(500).send({ message: "Failed to save session", error: error.message });
    }
});
  
module.exports = router;
