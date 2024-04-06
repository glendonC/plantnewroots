const express = require('express');
const router = express.Router();
const Conversation = require('../models/WritingConversation');

const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');



router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.find({});
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).send("Failed to fetch conversations");
  }
});

router.post('/save', async (req, res) => {
  try {

    const { participants, messages, name, tag } = req.body;
  
    if (!name || !tag) {
      return res.status(400).send({ message: "Missing conversation name or tag." });
    }
    const conversationId = uuidv4();
    const newConversation = new Conversation({
      participants: participants.map(id => new mongoose.Types.ObjectId(id)),
      messages: messages.map(message => ({
        text: message.text,
        from: new mongoose.Types.ObjectId(message.from),
        timestamp: message.timestamp || new Date(),
      })),
      name,
      tag,
      conversationId,
    });

    await newConversation.save();
    res.status(201).send({ message: 'Conversation saved successfully', conversationId });
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(400).send({ message: "Error saving conversation", details: error.message });
  }
});

router.post('/userMessages/save', async (req, res) => {
  try {
    const { userId, conversationId, messages, name, tag } = req.body;
    const newConversation = new Conversation({
      participants: [new mongoose.Types.ObjectId(userId)],
      messages: messages.map(text => ({
        text,
        from: new mongoose.Types.ObjectId(userId),
        timestamp: new Date(),
      })),
      conversationId,
      name,
      tag,
    });

    await newConversation.save();

    res.status(201).send({ message: 'User messages saved successfully' });
  } catch (error) {
    console.error("Error saving user messages:", error);
    res.status(400).send({ message: "Failed to save user messages", details: error.message });
  }
});

module.exports = router;
