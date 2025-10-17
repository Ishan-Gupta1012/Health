const express = require('express');
const multer = require('multer');
const path = require('path');
const { analyzeReportController, analyzeImageController } = require('../controllers/medisageController');

const router = express.Router();

// --- Multer Configuration ---

// Storage engine for radiology images (saved to disk temporarily for ONNX)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure 'uploads' directory exists in '/backend'
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Storage engine for reports (kept in memory as a buffer for OCR)
const memoryStorage = multer.memoryStorage();

const uploadImage = multer({ storage: diskStorage });
const uploadReport = multer({ storage: memoryStorage });


// --- API Routes ---

// @route   POST /api/medisage/analyze-report
// @desc    Upload a medical report image for OCR and Gemini analysis
router.post('/analyze-report', uploadReport.single('report'), analyzeReportController);

// @route   POST /api/medisage/analyze-image
// @desc    Upload a radiology image for ONNX model analysis
router.post('/analyze-image', uploadImage.single('image'), analyzeImageController);


module.exports = router;