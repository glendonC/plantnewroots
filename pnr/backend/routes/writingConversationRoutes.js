const express = require('express');
const router = express.Router();
const Conversation = require('../models/WritingConversation');

const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');

router.post('/save', async (req, res) => {
  try {
    const conversationId = uuidv4();

    const newConversation = new Conversation({
      ...req.body,
      conversationId,
    });

    await newConversation.save();
    res.status(201).send({ message: 'Conversation saved successfully', conversationId }); // Return the ID
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(400).send(error);
  }
});

router.post('/userMessages/save', async (req, res) => {
  try {
    const { userId, messages, conversationId } = req.body;
    const newUserMessageDoc = new Conversation({
      participants: [new mongoose.Types.ObjectId(userId)],
      messages: messages.map(text => ({
        text,
        from: new mongoose.Types.ObjectId(userId),
        timestamp: new Date(),
      })),
      conversationId,
    });

    await newUserMessageDoc.save();
    res.status(201).send({ message: 'User messages saved successfully' });
  } catch (error) {
    console.error("Error saving user messages:", error);
    res.status(400).send(error);
  }
});


module.exports = router;
