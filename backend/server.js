const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// --- Import Routes ---
const authRoutes = require('./routes/auth');
const reminderRoutes = require('./routes/reminders');
const recordRoutes = require('./routes/records');
const doctorRoutes = require('./routes/doctors');
const symptomRoutes = require('./routes/symptoms');
const mealRoutes = require('./routes/meals');
const chatbotRoutes = require('./routes/chatbot'); 
const medisageRoutes = require('./routes/medisageRoutes');

const app = express();
const PORT = process.env.PORT || 8001;

// --- Middleware ---
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Route Registration ---
app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/chatbot', chatbotRoutes); 
app.use('/api/medisage', medisageRoutes);

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Root Route ---
app.get('/', (req, res) => {
    res.send('Health App Backend is running!');
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
