// --------------------
// 🔹 Imports
// --------------------
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// --------------------
// 🔹 App Initialization
// --------------------
const app = express();
const PORT = process.env.PORT || 8001;

// --------------------
// 🔹 Security Middleware
// --------------------
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// --------------------
// 🔹 Rate Limiting
// --------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per 15 minutes
});
app.use('/api', limiter);

// --------------------
// 🔹 Body Parsers
// --------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --------------------
// 🔹 MongoDB Connection
// --------------------
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected successfully');
    } else {
      console.warn('⚠️  MongoDB URI not found in .env file');
      console.warn('📝 Add MONGODB_URI to backend/.env');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// --------------------
// 🔹 Health Check Route
// --------------------
app.get('/api/health', (req, res) => {
  res.json({
    message: 'HealthNest Backend API is running!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// --------------------
// 🔹 Route Imports
// --------------------
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const symptomRoutes = require('./routes/symptoms');
const reminderRoutes = require('./routes/reminders');
const recordRoutes = require('./routes/records');

// --------------------
// 🔹 Route Mounting
// --------------------
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/records', recordRoutes);

// --------------------
// 🔹 Static File Hosting
// --------------------
app.use('/api/uploads', express.static('uploads'));

// --------------------
// 🔹 Error Handling Middleware
// --------------------
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message,
  });
});

// --------------------
// 🔹 404 Handler
// --------------------
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// --------------------
// 🔹 Server Start
// --------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 HealthNest Backend Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
