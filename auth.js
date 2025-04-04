const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { mail, password } = req.body;

  // Validate input
  if (!mail || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      mail,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// login
router.post('/login', async (req, res) => {
  const { mail, password } = req.body;

  if (!mail || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ mail });  // 🔍 Check if user exists

    if (!user) {
      return res.status(404).json({ message: 'User does not exist.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);  // 🔐 Compare hashed password

    if (isMatch) {
      res.status(200).json({ message: 'Login successful', userId: user._id });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
