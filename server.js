// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// MongoDB connection setup (replace 'myapp' with your database name)
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Endpoint for user registration (signup)
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  // Respond with success
  res.status(201).json({ message: 'User created successfully' });
});

// server.js (continued)
// Endpoint for user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Validate password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  // Generate JWT token for authentication
  const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

  // Respond with token
  res.json({ token });
});
