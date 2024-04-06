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

router.post('/userMessages/save', async (req, res) => {
  console.log("Received payload for user messages:", req.body);
  try {
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    const userMessages = req.body.messages.map(message => ({
      text: message,
      from: userId,
      timestamp: new Date()
    }));

    const newUserMessageDoc = new Conversation({
      participants: [userId],
      messages: userMessages,
    });
console.log("Received payload for user messages:", req.body);
    await newUserMessageDoc.save();
    res.status(201).send({ message: 'User messages saved successfully' });
  } catch (error) {
    console.error("Error saving user messages:", error);
    
    res.status(400).send(error);
    res.status(400).send({ message: "Error processing request", details: error.message });
  }
});

module.exports = router;
