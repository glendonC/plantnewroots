const express = require('express');
const authenticate = require('../middleware/authenticate');
const User = require('../models/User');

const router = express.Router();

router.post('/update-profile', authenticate, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userId = req.user.id;

        let existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (username) {
            existingUser.username = username;
        }
        if (email) {
            existingUser.email = email;
        }
        if (password) {
            existingUser.password = password;
        }

        existingUser = await existingUser.save();

        console.log('User profile updated:', existingUser);
        return res.json({ message: 'Profile updated successfully', user: existingUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
