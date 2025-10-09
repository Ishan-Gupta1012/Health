const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const MedicalRecord = require('../models/MedicalRecord');
const { verifyToken } = require('./auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, JPG, and PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get file types
router.get('/data/types', (req, res) => {
  try {
    const types = [
      { value: 'prescription', label: 'Prescription' },
      { value: 'lab_report', label: 'Lab Report' },
      { value: 'xray', label: 'X-Ray' },
      { value: 'scan', label: 'CT/MRI Scan' },
      { value: 'document', label: 'Medical Document' },
      { value: 'other', label: 'Other' }
    ];
    
    res.json({ types });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch file types', error: error.message });
  }
});

module.exports = router;