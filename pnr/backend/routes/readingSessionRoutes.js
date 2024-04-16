const express = require('express');
const router = express.Router();
const ReadingSession = require('../models/ReadingSession');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user._id; 
        const readingSessions = await ReadingSession.find({ userId: userId });
        res.json(readingSessions);
    } catch (error) {
        console.error("Failed to fetch reading sessions:", error);
        res.status(500).send({ message: "Failed to fetch reading sessions" });
    }
});

router.get('/:id', authenticate, async (req, res) => {
    try {
        const session = await ReadingSession.findById(req.params.id);
        if (!session) {
            return res.status(404).send({ message: "Reading session not found" });
        }
        if (session.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: "Unauthorized access to this reading session" });
        }
        res.json(session);
    } catch (error) {
        console.error("Failed to fetch the reading session:", error);
        res.status(500).send({ message: "Failed to fetch the reading session" });
    }
});

router.post('/save', authenticate, async (req, res) => {
    try {
        const { name, text, questions, answers } = req.body;
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).send({ message: "User ID is required." });
        }

        const readingSession = new ReadingSession({
            name,
            userId,
            text,
            questions,
            answers
        });

        await readingSession.save();
        res.status(201).send({ message: 'Reading session saved successfully', sessionId: readingSession._id });
    } catch (error) {
        console.error('Save reading session failed:', error);
        res.status(500).send({ error: 'Failed to save reading session' });
    }
});


module.exports = router;
