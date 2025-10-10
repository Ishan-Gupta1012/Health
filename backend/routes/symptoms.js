// backend/routes/symptoms.js

const express = require('express');
const { verifyToken } = require('./auth'); // Assuming you still need user authentication
const router = express.Router();
const Disease = require('../models/Disease'); // Use the Disease model
const Symptom = require('../models/Symptom'); // Use the Symptom model

// GET /api/symptoms/available
// This route will now fetch all diseases to be used as searchable terms.
router.get('/available', async (req, res) => {
  try {
    // Find all diseases and sort them alphabetically
    const diseases = await Disease.find().sort({ name: 1 });
    
    // Format the data for the frontend
    const availableSymptoms = diseases.map(disease => ({
      name: disease.name,
      value: disease._id, // Use the database ID as the value
    }));
    
    res.json({
      symptoms: availableSymptoms,
      total: availableSymptoms.length
    });
  } catch (error) {
    console.error('Failed to fetch available symptoms/diseases:', error);
    res.status(500).json({ message: 'Failed to fetch available symptoms', error: error.message });
  }
});

// POST /api/symptoms/check
// This route will find diseases based on the user's selection.
router.post('/check', verifyToken, async (req, res) => {
  try {
    const { symptoms } = req.body; // 'symptoms' will now be an array of Disease IDs
    
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: 'Symptoms array is required' });
    }
    
    // Find the diseases that match the IDs sent from the frontend
    const foundDiseases = await Disease.find({
      '_id': { $in: symptoms }
    });
    
    // This part is simplified for now, as we don't have symptom-to-disease linking yet.
    // It returns the selected diseases as the result.
    const results = foundDiseases.map(disease => ({
        symptom: disease.name,
        found: true,
        possibleCauses: [disease.name], // For now, the cause is the disease itself
        recommendations: ["Consult a healthcare professional for an accurate diagnosis."],
        whenToSeeDoctor: "If you are concerned about your symptoms, please see a doctor."
    }));
    
    const disclaimer = "This symptom checker is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.";
    
    res.json({
      timestamp: new Date().toISOString(),
      inputSymptoms: symptoms,
      results: results,
      disclaimer: disclaimer
    });
    
  } catch (error) {
    console.error('Symptom check error:', error);
    res.status(500).json({ message: 'Failed to check symptoms', error: error.message });
  }
});

module.exports = router;