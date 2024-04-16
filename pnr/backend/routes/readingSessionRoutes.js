const express = require('express');
const router = express.Router();
const ReadingSession = require('../models/ReadingSession');
const authenticate = require('../middleware/authenticate');

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
