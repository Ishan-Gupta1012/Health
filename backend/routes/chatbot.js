const express = require('express');
const { verifyToken } = require('./authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// --- Initialize Gemini AI ---
let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  // Log a clear warning if the API key is missing
  console.warn("\n🔴 GEMINI_API_KEY is not set up in your backend/.env file. The chatbot will not work.\n");
}

// --- Helper: Get Gemini Model ---
const getModel = () => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured on the server.');
  }
  return genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
};

// --- Route for General Gemini Queries ---
router.post('/gemini', verifyToken, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  try {
    const model = getModel();
    const prompt = `
      You are HealthMate, a friendly and knowledgeable AI health assistant.
      Provide a concise, safe, and helpful response to the user's health question.
      User's question: "${message}"
    `;
    
    console.log("Sending prompt to Gemini for general query...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    res.json({ reply: text });

  } catch (error) {
    // Log detailed error and send a user-friendly message
    console.error('🔴 Error calling Gemini API:', error.message);
    res.status(500).json({ message: `Failed to get response from AI. ${error.message}` });
  }
});

// --- Route for Meal Analysis ---
router.post('/meal', verifyToken, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }
  
  try {
    const model = getModel();
    const prompt = `
      You are HealthMate, an AI nutrition and wellness assistant.
Provide answers in short, easy-to-read bullet points that are clear, friendly, and practical.
Focus on:
🍽️ Direct, useful advice based on the user’s question
🥦 Nutritional insights (protein, carbs, vitamins, etc.)
💡 Simple meal or food suggestions that fit the user’s goal
⚠️ Brief cautions or balance tips (if needed)
Keep responses under 6 concise bullet points and avoid long paragraphs.
Maintain a positive, expert tone that’s easy for everyone to understand. "${message}"
    `;
    
    console.log("Sending prompt to Gemini for meal analysis...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    res.json({ summary: text });

  } catch (error) {
    // Log detailed error and send a user-friendly message
    console.error('🔴 Error calling Gemini API for meal analysis:', error.message);
    res.status(500).json({ message: `Failed to analyze meal. ${error.message}` });
  }
});

module.exports = router;

