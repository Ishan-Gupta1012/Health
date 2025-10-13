const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import Existing and New Routes
const authRoutes = require('./routes/auth');
const reminderRoutes = require('./routes/reminders');
const recordsRoutes = require('./routes/records');
const symptomRoutes = require('./routes/symptoms');
const doctorRoutes = require('./routes/doctors'); // <-- 1. IMPORT THE NEW ROUTE

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware Setup
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/doctors', doctorRoutes); // <-- 2. ADD THE ROUTE TO THE APP

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});