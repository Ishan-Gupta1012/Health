const express = require('express');
const multer = require('multer');
const fs = require('fs');
const MedicalRecord = require('../models/MedicalRecord');
const { verifyToken } = require('./auth');
const router = express.Router();

// Ensure the 'uploads' directory exists
const uploadsDir = 'uploads/';
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${Date.now()}-${safeFilename}`);
  }
});

const upload = multer({ storage: storage });

// Create a new medical record
router.post('/', upload.single('report'), verifyToken, async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { recordType, date, details, doctor } = req.body;

    if (!recordType || !date) {
      return res.status(400).json({ message: 'Record type and date are required' });
    }

    const record = new MedicalRecord({
      userId: req.userId,
      recordType,
      date,
      details,
      doctor,
      fileUrl
    });

    await record.save();
    res.status(201).json({ message: 'Medical record created successfully', record });
  } catch (error) {
    console.error('Record creation error:', error);
    res.status(500).json({ message: 'Failed to create medical record', error: error.message });
  }
});

// GET all records for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ userId: req.userId }).sort({ date: -1 });
    res.json({ records });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medical records', error: error.message });
  }
});

// GET a single shared record
router.get('/share/:shareableLink', async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({ shareableLink: req.params.shareableLink });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medical record', error: error.message });
  }
});

// --- NEW DELETE ROUTE ---
// Deletes a medical record by its ID.
router.delete('/:recordId', verifyToken, async (req, res) => {
  try {
    const record = await MedicalRecord.findOneAndDelete({
      recordId: req.params.recordId,
      userId: req.userId // Ensures users can only delete their own records
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found or you do not have permission to delete it.' });
    }

    // Optional: If the record had a file, delete it from the server's file system
    if (record.fileUrl) {
      const filePath = record.fileUrl.substring(1); // Remove leading '/'
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
          // Don't block the response for this, just log the error
        }
      });
    }

    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({ message: 'Failed to delete medical record', error: error.message });
  }
});

module.exports = router;