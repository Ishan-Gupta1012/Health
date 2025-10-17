const ocrService = require('../services/ocrService');
const { analyzeMedicalText } = require('../services/geminiService'); // Destructure the new function
const onnxService = require('../services/onnxService');
const fs = require('fs');

/**
 * Controller to handle medical report analysis (OCR + Gemini).
 */
const analyzeReportController = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No report file uploaded." });
  }

  try {
    // 1. Extract text from the uploaded image buffer
    const extractedText = await ocrService.extractTextFromImage(req.file.buffer);

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ message: "Could not extract any text from the report." });
    }
    
    // 2. Send the extracted text to Gemini for analysis
    const analysis = await analyzeMedicalText(extractedText);
    
    res.status(200).json({
      originalText: extractedText,
      analysis: analysis,
    });
  } catch (error) {
    console.error("Report analysis failed:", error);
    res.status(500).json({ message: error.message || "An internal server error occurred." });
  }
};

/**
 * Controller to handle radiology image analysis (ONNX).
 */
const analyzeImageController = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded." });
  }

  const filePath = req.file.path;

  try {
    // 1. Analyze the image using the ONNX service
    const result = await onnxService.analyzeRadiologyImage(filePath);
    res.status(200).json(result);
  } catch (error) {
    console.error("Image analysis failed:", error);
    res.status(500).json({ message: error.message || "An internal server error occurred." });
  } finally {
    // 2. Clean up the uploaded file from the server
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });
  }
};

module.exports = {
  analyzeReportController,
  analyzeImageController,
};