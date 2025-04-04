const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./auth'); // Create this next

const app = express();
const port = 3010;

// Middleware
app.use(express.static('static'));
app.use(express.json()); // To parse JSON bodies

// Routes
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.use('/api', authRoutes); // API routes like /api/login

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/socialapp', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Start Server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
