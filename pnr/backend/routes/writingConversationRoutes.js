const express = require('express');
const router = express.Router();
const Conversation = require('../models/WritingConversation');

const mongoose = require('mongoose');

router.post('/save', async (req, res) => {
  try {
    req.body.participants = req.body.participants.map(id => new mongoose.Types.ObjectId(id));
    req.body.messages = req.body.messages.map(message => ({
      ...message,
      from: new mongoose.Types.ObjectId(message.from),
    }));

    const newConversation = new Conversation(req.body);
    await newConversation.save();
    res.status(201).send({ message: 'Conversation saved successfully' });
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(400).send(error);
  }
});

module.exports = router;
