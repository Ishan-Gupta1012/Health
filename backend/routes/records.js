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

// Create new medical record
router.post('/', verifyToken, upload.array('files', 5), async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      doctorName,
      hospitalName,
      date,
      tags
    } = req.body;
    
    if (!type || !title) {
      return res.status(400).json({ message: 'Type and title are required' });
    }
    
    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    })) : [];
    
    const record = new MedicalRecord({
      userId: req.userId,
      type,
      title,
      description,
      files,
      doctorName,
      hospitalName,
      date: date ? new Date(date) : new Date(),
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });
    
    await record.save();
    
    res.status(201).json({
      message: 'Medical record created successfully',
      record
    });
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ message: 'Failed to create medical record', error: error.message });
  }
});

// Get user's medical records
router.get('/', verifyToken, async (req, res) => {
  try {
    const { type, page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { userId: req.userId };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { doctorName: new RegExp(search, 'i') },
        { hospitalName: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const records = await MedicalRecord.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await MedicalRecord.countDocuments(query);
    
    res.json({
      records,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medical records', error: error.message });
  }
});

// Get record by ID
router.get('/:recordId', verifyToken, async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({ 
      recordId: req.params.recordId,
      userId: req.userId 
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    res.json({ record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medical record', error: error.message });
  }
});

// Update record
router.put('/:recordId', verifyToken, upload.array('newFiles', 5), async (req, res) => {
  try {
    const updates = req.body;
    
    // Handle new files if uploaded
    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      }));
      
      const record = await MedicalRecord.findOne({ 
        recordId: req.params.recordId,
        userId: req.userId 
      });
      
      if (record) {
        updates.files = [...record.files, ...newFiles];
      }
    }
    
    // Handle tags
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(tag => tag.trim());
    }
    
    const record = await MedicalRecord.findOneAndUpdate(
      { recordId: req.params.recordId, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    res.json({ 
      message: 'Medical record updated successfully', 
      record 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update medical record', error: error.message });
  }
});

// Delete record
router.delete('/:recordId', verifyToken, async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({ 
      recordId: req.params.recordId,
      userId: req.userId 
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    // Delete associated files
    record.files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    });
    
    await MedicalRecord.deleteOne({ recordId: req.params.recordId, userId: req.userId });
    
    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete medical record', error: error.message });
  }
});

// Delete specific file from record
router.delete('/:recordId/files/:filename', verifyToken, async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({ 
      recordId: req.params.recordId,
      userId: req.userId 
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    const fileIndex = record.files.findIndex(file => file.filename === req.params.filename);
    if (fileIndex === -1) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    const fileToDelete = record.files[fileIndex];
    
    // Delete file from filesystem
    try {
      fs.unlinkSync(fileToDelete.path);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
    
    // Remove from record
    record.files.splice(fileIndex, 1);
    await record.save();
    
    res.json({ message: 'File deleted successfully', record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete file', error: error.message });
  }
});

// Share record
router.post('/:recordId/share', verifyToken, async (req, res) => {
  try {
    const { email, accessType = 'view' } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const record = await MedicalRecord.findOne({ 
      recordId: req.params.recordId,
      userId: req.userId 
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    // Check if already shared with this email
    const existingShare = record.sharedWith.find(share => share.email === email);
    if (existingShare) {
      existingShare.accessType = accessType;
      existingShare.sharedDate = new Date();
    } else {
      record.sharedWith.push({
        email,
        accessType,
        sharedDate: new Date()
      });
    }
    
    record.isShared = true;
    await record.save();
    
    res.json({ 
      message: `Medical record shared with ${email}`, 
      record 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to share medical record', error: error.message });
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