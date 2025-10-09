const express = require('express');
const { verifyToken } = require('./auth');
const router = express.Router();

// Mock symptoms database
const symptomsDatabase = {
  "headache": {
    possibleCauses: [
      "Tension headache",
      "Migraine",
      "Dehydration",
      "Eye strain",
      "Stress",
      "Lack of sleep",
      "Sinus congestion"
    ],
    recommendations: [
      "Rest in a quiet, dark room",
      "Apply cold or warm compress to head/neck",
      "Stay hydrated",
      "Consider over-the-counter pain relievers",
      "Practice relaxation techniques"
    ],
    severity: "mild-moderate",
    whenToSeeDoctor: "If headaches are severe, frequent, or accompanied by fever, neck stiffness, or vision changes"
  },
  "fever": {
    possibleCauses: [
      "Viral infection",
      "Bacterial infection",
      "Food poisoning",
      "Heat exhaustion",
      "Medication reaction"
    ],
    recommendations: [
      "Rest and get plenty of sleep",
      "Drink lots of fluids",
      "Take fever-reducing medication if needed",
      "Use cool compresses",
      "Wear light clothing"
    ],
    severity: "moderate",
    whenToSeeDoctor: "If fever is over 103°F (39.4°C) or persists for more than 3 days"
  },
  "cough": {
    possibleCauses: [
      "Common cold",
      "Flu",
      "Allergies",
      "Acid reflux",
      "Asthma",
      "Bronchitis"
    ],
    recommendations: [
      "Stay hydrated",
      "Use a humidifier",
      "Try honey or cough drops",
      "Avoid irritants like smoke",
      "Elevate your head while sleeping"
    ],
    severity: "mild-moderate",
    whenToSeeDoctor: "If cough persists for more than 2 weeks or is accompanied by blood, fever, or difficulty breathing"
  },
  "chest pain": {
    possibleCauses: [
      "Muscle strain",
      "Acid reflux",
      "Anxiety",
      "Costochondritis",
      "Heart-related issues"
    ],
    recommendations: [
      "Rest and avoid strenuous activity",
      "Apply heat or cold therapy",
      "Practice deep breathing",
      "Monitor symptoms closely"
    ],
    severity: "potentially serious",
    whenToSeeDoctor: "SEEK IMMEDIATE MEDICAL ATTENTION if accompanied by shortness of breath, sweating, nausea, or radiating pain"
  },
  "stomach pain": {
    possibleCauses: [
      "Indigestion",
      "Gas",
      "Food poisoning",
      "Stress",
      "Gastroenteritis",
      "Appendicitis"
    ],
    recommendations: [
      "Avoid solid foods temporarily",
      "Stay hydrated with clear fluids",
      "Apply heat to the area",
      "Avoid dairy and fatty foods",
      "Rest"
    ],
    severity: "mild-moderate",
    whenToSeeDoctor: "If pain is severe, persistent, or accompanied by fever, vomiting, or changes in bowel movements"
  },
  "fatigue": {
    possibleCauses: [
      "Lack of sleep",
      "Stress",
      "Poor diet",
      "Dehydration",
      "Viral infection",
      "Anemia",
      "Depression"
    ],
    recommendations: [
      "Get adequate sleep (7-9 hours)",
      "Maintain a regular sleep schedule",
      "Exercise regularly",
      "Eat a balanced diet",
      "Manage stress",
      "Stay hydrated"
    ],
    severity: "mild",
    whenToSeeDoctor: "If fatigue persists for more than 2 weeks or interferes with daily activities"
  }
};

// Check symptoms
router.post('/check', verifyToken, async (req, res) => {
  try {
    const { symptoms, severity, duration } = req.body;
    
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: 'Symptoms array is required' });
    }
    
    const results = [];
    const allRecommendations = new Set();
    let maxSeverity = 'mild';
    const doctorReasons = new Set();
    
    // Process each symptom
    symptoms.forEach(symptom => {
      const symptomKey = symptom.toLowerCase().trim();
      const symptomData = symptomsDatabase[symptomKey];
      
      if (symptomData) {
        results.push({
          symptom: symptom,
          found: true,
          possibleCauses: symptomData.possibleCauses,
          recommendations: symptomData.recommendations,
          severity: symptomData.severity,
          whenToSeeDoctor: symptomData.whenToSeeDoctor
        });
        
        // Collect recommendations
        symptomData.recommendations.forEach(rec => allRecommendations.add(rec));
        
        // Update max severity
        if (symptomData.severity.includes('serious') || symptomData.severity.includes('severe')) {
          maxSeverity = 'serious';
        } else if (symptomData.severity.includes('moderate') && maxSeverity === 'mild') {
          maxSeverity = 'moderate';
        }
        
        // Collect doctor consultation reasons
        doctorReasons.add(symptomData.whenToSeeDoctor);
      } else {
        results.push({
          symptom: symptom,
          found: false,
          message: "Symptom not found in database. Please consult a healthcare professional for evaluation."
        });
      }
    });
    
    // Generate overall assessment
    let overallAssessment = {
      severity: maxSeverity,
      urgency: maxSeverity === 'serious' ? 'high' : maxSeverity === 'moderate' ? 'medium' : 'low',
      generalRecommendations: Array.from(allRecommendations),
      whenToSeeDoctor: Array.from(doctorReasons)
    };
    
    // Add duration-based advice
    if (duration && duration >= 7) {
      overallAssessment.urgency = overallAssessment.urgency === 'low' ? 'medium' : overallAssessment.urgency;
      overallAssessment.generalRecommendations.push("Consider seeing a doctor as symptoms have persisted for a week or more");
    }
    
    // Generate disclaimer
    const disclaimer = "This symptom checker is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.";
    
    res.json({
      timestamp: new Date().toISOString(),
      inputSymptoms: symptoms,
      duration: duration,
      results: results,
      overallAssessment: overallAssessment,
      disclaimer: disclaimer
    });
    
  } catch (error) {
    console.error('Symptom check error:', error);
    res.status(500).json({ message: 'Failed to check symptoms', error: error.message });
  }
});

// Get available symptoms list
router.get('/available', (req, res) => {
  try {
    const availableSymptoms = Object.keys(symptomsDatabase).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: key,
      severity: symptomsDatabase[key].severity
    }));
    
    res.json({
      symptoms: availableSymptoms,
      total: availableSymptoms.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch symptoms', error: error.message });
  }
});

// Emergency symptoms that require immediate attention
router.get('/emergency', (req, res) => {
  try {
    const emergencySymptoms = [
      "Chest pain with shortness of breath",
      "Severe difficulty breathing",
      "Loss of consciousness",
      "Severe bleeding",
      "Signs of stroke (face drooping, arm weakness, speech difficulty)",
      "Severe allergic reaction",
      "Sudden severe headache",
      "High fever with neck stiffness",
      "Severe abdominal pain",
      "Suicidal thoughts"
    ];
    
    res.json({
      emergencySymptoms: emergencySymptoms,
      message: "If you are experiencing any of these symptoms, seek immediate medical attention or call emergency services."
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch emergency symptoms', error: error.message });
  }
});

module.exports = router;