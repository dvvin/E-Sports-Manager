const express = require('express');
const router = express.Router();
const Users = require('./LoginDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    const { email, username, password, role } = req.body; // Add role here

    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_])\S{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const usernameRegex = /^\S{3,}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }

    if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: 'Invalid username' });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = await Users.create({ email, username, password: hashedPassword, role });
        res.status(201).json({ message: 'Account Created' });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ username });
    const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !isPasswordValid)
        return res.status(401).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, username: user.username, role: user.role, message: 'You have logged in' });

});

// this route fetches the currently logged in user's data
router.get('/:username', async (req, res) => {
    const { username } = req.params;

    // Check if the user exists
    const userExists = await Users.findOne({ username });
    if (!userExists) {
        // User does not exist, send a 404 response
        return res.status(404).json({ message: 'User not found' });
    }

    const defaultProfilePic = Users.schema.path('profilePicture').defaultValue;
    if (!userExists.profilePicture) {
        userExists.profilePicture = Users.schema.path('profilePicture').defaultValue;
    }

    const defaultProfileBackground = Users.schema.path('profileBackground').defaultValue;
    if (!userExists.profileBackground) {
        userExists.profileBackground = Users.schema.path('profileBackground').defaultValue;
    }

    // Return user data
    res.json({ user: userExists, defaultProfilePic, defaultProfileBackground });
});

// Export the router
module.exports = router;
