const router = require('express').Router();
const { parseSymptoms, getDiagnosis } = require('../services/infermedicaService.js');
const { getHealthAdvice } = require('../services/geminiService.js');
// const authMiddleware = require('./authMiddleware'); // Uncomment if you want to protect these routes

// Parse symptoms from text (Infermedica API)
router.post('/parse', async (req, res) => {
  try {
    const { text, age, sex } = req.body;
    if (!text || !age || !sex) {
      return res.status(400).json({ message: 'Missing text, age, or sex in request body.' });
    }
    const parsedData = await parseSymptoms(text, age, sex);
    res.json(parsedData);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
});

// Get diagnosis based on evidence (Infermedica API)
router.post('/diagnose', async (req, res) => {
  try {
    const diagnosisRequest = req.body;
    if (!diagnosisRequest || !diagnosisRequest.sex || !diagnosisRequest.age || !diagnosisRequest.evidence) {
        return res.status(400).json({ message: 'Missing required fields for diagnosis request.' });
    }
    const diagnosisData = await getDiagnosis(diagnosisRequest);
    res.json(diagnosisData);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
});

// Get health advice using Gemini (Gemini API)
router.post('/advice', async (req, res) => {
  try {
    const { diseaseName } = req.body;
    if (!diseaseName) {
      return res.status(400).json({ message: 'Missing diseaseName in request body.' });
    }
    const advice = await getHealthAdvice(diseaseName);
    res.json({ advice }); // Wrap the advice in an object for consistency
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
});

module.exports = router;