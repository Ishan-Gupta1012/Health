const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected successfully');
    } else {
      console.log('⚠️  MongoDB URI not provided in .env file');
      console.log('📝 Please add MONGODB_URI to backend/.env file');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Don't exit process, let app run without DB for now
  }
};

connectDB();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'HealthNest Backend API is running!', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Import routes
const { router: authRoutes } = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const symptomRoutes = require('./routes/symptoms');
const reminderRoutes = require('./routes/reminders');
const recordRoutes = require('./routes/records');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/reminders', reminderRoutes);
// app.use('/api/records', recordRoutes);

// File uploads directory
app.use('/api/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 HealthNest Backend Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;