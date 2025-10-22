const express = require('express');
const multer = require('multer');
const { analyzePrescriptionController } = require('../controllers/prescriptionController');
const { verifyToken } = require('./authMiddleware'); // Import authentication middleware

const router = express.Router();

// Configure multer to use memory storage for processing files as buffers
const memoryStorage = multer.memoryStorage();
const upload = multer({
    storage: memoryStorage,
    limits: { fileSize: 10 * 1024 * 1024 } // Optional: Limit file size (e.g., 10MB)
});

/**
 * @route   POST /api/prescription/analyze
 * @desc    Upload a prescription image/pdf for OCR and AI analysis
 * @access  Private
 */
// Added verifyToken middleware to protect the route
router.post('/analyze', verifyToken, upload.single('prescription'), analyzePrescriptionController);

module.exports = router;