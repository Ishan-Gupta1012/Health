const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const router = express.Router();

// --------------------
// Google OAuth Setup
// --------------------
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) return done(null, user);

      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.googleId = profile.id;
        user.avatar = profile.photos[0]?.value || '';
        await user.save();
        return done(null, user);
      }

      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0]?.value || ''
      });

      await user.save();
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
}

passport.serializeUser((user, done) => done(null, user.userId));
passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findOne({ userId });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// --------------------
// JWT Helper
// --------------------
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// --------------------
// Auth Routes
// --------------------

// Register
router.post('/register', async (req, res) => {
  try {
    // UPDATED: Include new profile fields
    const { email, password, name, phone, dateOfBirth, gender, heightFt, heightIn, weightKg } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });

    // UPDATED: Pass new fields to User constructor
    const user = new User({ email, password, name, phone, dateOfBirth, gender, heightFt, heightIn, weightKg });
    await user.save();

    const token = generateToken(user.userId);

    // Ensure all user data is returned to the frontend
    res.status(201).json({
      message: 'User registered successfully',
      user: { 
        userId: user.userId, 
        email: user.email, 
        name: user.name, 
        avatar: user.avatar, 
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        heightFt: user.heightFt,
        heightIn: user.heightIn,
        weightKg: user.weightKg,
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.userId);

    // UPDATED: Ensure all user data is returned to the frontend
    res.json({
      message: 'Login successful',
      user: { 
        userId: user.userId, 
        email: user.email, 
        name: user.name, 
        avatar: user.avatar,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        heightFt: user.heightFt,
        heightIn: user.heightIn,
        weightKg: user.weightKg,
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin' }),
  (req, res) => {
    const token = generateToken(req.user.userId);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token}`);
  }
);

// --------------------
// Token Middleware
// --------------------
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Get Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.userId }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Update Profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const updates = req.body;
    // Prevent sensitive fields from being updated via this route
    delete updates.password;
    delete updates.email;

    const user = await User.findOneAndUpdate(
      { userId: req.userId },
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
});

// --------------------
// Export
// --------------------
module.exports = router; 
module.exports.verifyToken = verifyToken;