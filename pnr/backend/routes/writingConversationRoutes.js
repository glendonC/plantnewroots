const express = require('express');
const router = express.Router();
const Conversation = require('../models/WritingConversation');

const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');

const { v4: uuidv4 } = require('uuid');



router.get('/', authenticate, async (req, res) => {
  try {
    console.log('Fetching conversations for user:', req.user.id);
    const conversations = await Conversation.find({ participants: req.user.id });
    console.log('Found conversations:', conversations);
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).send({ message: "Failed to fetch conversations", error: error.message });
  }
});


router.post('/save', authenticate, async (req, res) => {
  try {
    const { participants, messages, name, tag } = req.body;

    if (!name || !tag) {
      return res.status(400).send({ message: "Missing conversation name or tag." });
    }
    
    const conversationId = uuidv4();
    const newConversation = new Conversation({
      userId: req.user.id,  // Assuming this field is added to your model
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


router.post('/userMessages/save', authenticate, async (req, res) => {
  try {
    const { messages, name, tag } = req.body;
    const conversationId = uuidv4();
    const newConversation = new Conversation({
      userId: req.user.id,
      participants: [new mongoose.Types.ObjectId(req.user.id)],
      messages: messages.map(text => ({
        text,
        from: new mongoose.Types.ObjectId(req.user.id),
        timestamp: new Date(),
      })),
      name,
      tag,
      conversationId,
    });

    await newConversation.save();

    res.status(201).send({ message: 'User messages saved successfully', conversationId });
  } catch (error) {
    console.error("Error saving user messages:", error);
    res.status(400).send({ message: "Failed to save user messages", details: error.message });
  }
});

router.get('/userMessages/:conversationId', authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found.' });
    }

    const userMessages = conversation.messages.filter(message => message.from.toString() === userId);
    res.json({ messages: userMessages });
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ error: 'Failed to fetch user messages', details: error.message });
  }
});




module.exports = router;
