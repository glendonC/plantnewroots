const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');
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
            const hashedPassword = await bcrypt.hash(password, 12);
            existingUser.password = hashedPassword;
        }

        existingUser = await existingUser.save();

        console.log('User profile updated:', existingUser);
        return res.json({ message: 'Profile updated successfully', user: existingUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/forgot-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

       // console.log('New password hashed:', hashedPassword);
        user.password = hashedPassword;
        await user.save();

        //console.log('Password reset successfully');
        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
