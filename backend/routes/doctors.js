const express = require('express');
const Doctor = require('../models/Doctor');
const { verifyToken } = require('./auth');
const router = express.Router();

// Mock doctors data for seeding
const mockDoctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    qualification: "MD, FACC",
    experience: 12,
    location: {
      address: "123 Medical Center Drive",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    contact: {
      phone: "+1-555-0123",
      email: "sarah.johnson@healthcenter.com"
    },
    rating: 4.8,
    reviewCount: 156,
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: { start: "09:00", end: "17:00" }
    },
    consultationFee: 200
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    qualification: "MD, Board Certified",
    experience: 8,
    location: {
      address: "456 Health Plaza",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    contact: {
      phone: "+1-555-0124",
      email: "michael.chen@skincare.com"
    },
    rating: 4.6,
    reviewCount: 89,
    availability: {
      days: ["Monday", "Wednesday", "Friday", "Saturday"],
      hours: { start: "10:00", end: "18:00" }
    },
    consultationFee: 180
  },
  {
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    qualification: "MD, MPH",
    experience: 15,
    location: {
      address: "789 Children's Way",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },
    contact: {
      phone: "+1-555-0125",
      email: "emily.rodriguez@kidcare.com"
    },
    rating: 4.9,
    reviewCount: 203,
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      hours: { start: "08:00", end: "16:00" }
    },
    consultationFee: 150
  },
  {
    name: "Dr. Robert Wilson",
    specialty: "Orthopedic Surgeon",
    qualification: "MD, MS Orthopedics",
    experience: 20,
    location: {
      address: "321 Bone & Joint Center",
      city: "Houston",
      state: "TX",
      zipCode: "77001",
      coordinates: { lat: 29.7604, lng: -95.3698 }
    },
    contact: {
      phone: "+1-555-0126",
      email: "robert.wilson@orthocenter.com"
    },
    rating: 4.7,
    reviewCount: 142,
    availability: {
      days: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: { start: "07:00", end: "15:00" }
    },
    consultationFee: 300
  },
  {
    name: "Dr. Lisa Kim",
    specialty: "Neurologist",
    qualification: "MD, PhD Neuroscience",
    experience: 10,
    location: {
      address: "654 Brain Institute",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      coordinates: { lat: 42.3601, lng: -71.0589 }
    },
    contact: {
      phone: "+1-555-0127",
      email: "lisa.kim@neuroinstitute.com"
    },
    rating: 4.8,
    reviewCount: 98,
    availability: {
      days: ["Monday", "Tuesday", "Thursday", "Friday"],
      hours: { start: "09:00", end: "17:00" }
    },
    consultationFee: 250
  }
];

// Seed doctors (run once)
router.post('/seed', async (req, res) => {
  try {
    await Doctor.deleteMany({}); // Clear existing doctors
    await Doctor.insertMany(mockDoctors);
    res.json({ message: 'Mock doctors seeded successfully', count: mockDoctors.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to seed doctors', error: error.message });
  }
});

// Search doctors
router.get('/search', async (req, res) => {
  try {
    const { specialty, city, state, rating, sortBy = 'rating' } = req.query;
    
    let query = {};
    
    if (specialty) {
      query.specialty = new RegExp(specialty, 'i');
    }
    
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }
    
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { rating: -1, reviewCount: -1 };
        break;
      case 'experience':
        sortOptions = { experience: -1 };
        break;
      case 'fee':
        sortOptions = { consultationFee: 1 };
        break;
      default:
        sortOptions = { rating: -1 };
    }
    
    const doctors = await Doctor.find(query).sort(sortOptions).limit(20);
    
    res.json({
      doctors,
      total: doctors.length,
      query: { specialty, city, state, rating, sortBy }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search doctors', error: error.message });
  }
});

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const doctors = await Doctor.find()
      .sort({ rating: -1, reviewCount: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Doctor.countDocuments();
    
    res.json({
      doctors,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
});

// Get doctor by ID
router.get('/:doctorId', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ doctorId: req.params.doctorId });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch doctor', error: error.message });
  }
});

// Get specialties
router.get('/data/specialties', async (req, res) => {
  try {
    const specialties = await Doctor.distinct('specialty');
    res.json({ specialties: specialties.sort() });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch specialties', error: error.message });
  }
});

module.exports = router;