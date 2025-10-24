const { analyzePrescription } = require('../services/geminiService');

/**
 * Controller to analyze prescription text using AI
 */
const analyzePrescriptionController = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { prescriptionText } = req.body;

    if (!prescriptionText || prescriptionText.trim() === '') {
      console.log('Missing or empty prescriptionText');
      return res.status(400).json({ 
        success: false, 
        error: 'Prescription text is required' 
      });
    }

    console.log('Analyzing prescription...');
    const analysis = await analyzePrescription(prescriptionText);

    return res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('--- ERROR DURING PRESCRIPTION ANALYSIS ---');
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze prescription'
    });
  }
};

module.exports = {
  analyzePrescriptionController
};