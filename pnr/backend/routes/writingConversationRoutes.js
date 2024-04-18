const express = require('express');
const router = express.Router();
const WritingConversation = require('../models/WritingConversation');

const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');

const { v4: uuidv4 } = require('uuid');



router.get('/', async (req, res) => {
  try {
    const conversations = await WritingConversation.find({});
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).send("Failed to fetch conversations");
  }
});

router.post('/save', authenticate, async (req, res) => {
  const { participants, messages, name, tag } = req.body;
  const userId = req.user._id; // Get the userId from authenticated session

  if (!name || !tag || !participants || !messages) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const sessionId = uuidv4(); // Generate a UUID for this conversation session

    // Save full conversation with all messages
    const newConversation = new WritingConversation({
      sessionId,
      participants: participants.map(id => new mongoose.Types.ObjectId(id)),
      messages: messages.map(message => ({
        text: message.text,
        from: new mongoose.Types.ObjectId(message.from),
        timestamp: new Date()
      })),
      name,
      tag
    });
    await newConversation.save();

    // Optionally, save user messages separately if needed (can be skipped if not needed)
    const userMessages = messages.filter(msg => msg.from === userId.toString()).map(msg => ({
      text: msg.text,
      from: new mongoose.Types.ObjectId(userId),
      timestamp: new Date()
    }));
    if (userMessages.length > 0) {
      await new WritingConversation({
        sessionId,
        participants: [new mongoose.Types.ObjectId(userId)],
        messages: userMessages,
        name,
        tag,
        type: 'user' // If you need to distinguish this in your schema
      }).save();
    }

    res.status(201).json({ message: 'Conversation and user messages saved successfully', sessionId });
  } catch (error) {
    console.error("Error saving conversation and user messages:", error);
    res.status(500).json({ error: 'Failed to save data', details: error.message });
  }
});

router.post('/userMessages/save', authenticate, async (req, res) => {
  const { sessionId, messages, name, tag } = req.body;
  const userId = req.user._id;  // Assuming authenticate middleware adds user info

  if (!messages || messages.length === 0) {
      return res.status(400).json({ message: "No user messages provided" });
  }

  try {
      // Assuming you have a field for userMessages to store only the user's messages
      const conversation = await WritingConversation.findOneAndUpdate(
          { sessionId: sessionId },
          {
              $push: { userMessages: { $each: messages.map(text => ({ text, from: userId })) } },
              $set: { name: name, tag: tag, type: 'user' }  // Mark the type as 'user' if needed
          },
          { new: true, upsert: true }  // Creates a new document if no document matches the sessionId
      );

      res.status(201).json({ message: 'User messages saved successfully', data: conversation });
  } catch (error) {
      console.error("Error saving user messages:", error);
      res.status(500).json({ message: "Failed to save user messages", details: error.message });
  }
});




router.get('/userMessages/:sessionId', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;  // Ensure this is also expected to be a UUID if you're using UUIDs for users
    const conversation = await WritingConversation.findOne({ sessionId });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found.' });
    }

    const userMessages = conversation.messages.filter(message => message.from === userId.toString());
    res.json({ messages: userMessages });
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ error: 'Failed to fetch user messages', details: error.message });
  }
});





module.exports = router;
