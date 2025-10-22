require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const symptomRoutes = require('./routes/symptoms');
const doctorRoutes = require('./routes/doctors');
const mealRoutes = require('./routes/meals');
const medisageRoutes = require('./routes/medisageRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes'); // Import prescription routes

const app = express();

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://127.0.0.1:3000',
  // Add other origins if needed
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', // Fallback secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/medisage', medisageRoutes);
app.use('/api/prescription', prescriptionRoutes); // Mount prescription routes


// Basic route
app.get('/', (req, res) => {
  res.send('Health App Backend Running');
});

// Error Handling Middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// Server Listening
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));