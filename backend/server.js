require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '12mb' }));

// Connect to MongoDB
const connect = ( ) => {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));
}

connect();

// Routes
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const goalRoutes = require('./routes/goalRoutes');
const dietLogRoutes = require('./routes/dietLogRoutes');
const progressLogRoutes = require('./routes/progressLogRoutes');
const todoRoutes = require('./routes/todoRoutes');
const profileRoutes = require('./routes/profileRoutes');
const visionRoutes = require('./routes/visionRoutes');
const postureRoutes = require('./routes/postureRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/dietlogs', dietLogRoutes);
app.use('/api/progresslogs', progressLogRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/vision', visionRoutes);
app.use('/api/posture', postureRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
