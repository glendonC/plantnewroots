const express = require('express');
const router = express.Router();
const Conversation = require('../models/WritingConversation');

router.post('/save', async (req, res) => {
  try {
    const newConversation = new Conversation(req.body);
    await newConversation.save();
    res.status(201).send({ message: 'Conversation saved successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
