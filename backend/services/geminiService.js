const { GoogleGenAI } = require("@google/genai");

// Use a specific environment variable for the Gemini key
const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY; // Added fallback for existing users

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the GEMINI_API_KEY environment variable.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Function from the previous Symptom Checker feature
const getHealthAdvice = async (diseaseName) => {
  if (!API_KEY || !ai) {
    throw new Error("Gemini API key is not configured.");
  }
  
  const prompt = `
    Provide short, friendly, medically safe lifestyle advice for managing ${diseaseName}.
    Include:
    - Recommended diet or foods
    - Helpful exercises or activities
    - Things to avoid (foods, habits, etc.)
    Keep it under 150 words and present it in a clear, easy-to-read format. 
    IMPORTANT: Do not provide any medical diagnosis, prescriptions, or tell the user to take specific medications. Start with a disclaimer that this is not a substitute for professional medical advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching health advice from Gemini API:", error);
    throw new Error("Failed to generate health advice.");
  }
};

// NEW FUNCTION: For MediSage Report Analysis
const analyzeMedicalText = async (medicalText) => {
  if (!API_KEY || !ai) {
    throw new Error("Gemini API key is not configured.");
  }
  
  const prompt = `
    Analyze the following extracted medical report text and provide:
    1. A concise, easy-to-understand **summary** of the findings.
    2. A list of 3-5 non-diagnostic **questions** a patient should ask their doctor based on this report.
    
    Format the output as a single JSON object:
    {
      "summary": "...",
      "questions": ["Question 1...", "Question 2...", ...]
    }
    
    Report Text to Analyze:
    ---
    ${medicalText}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    
    // Attempt to parse the JSON response from Gemini
    const jsonString = response.text.trim().replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
    
  } catch (error) {
    console.error("Error analyzing medical text with Gemini:", error);
    throw new Error("Failed to generate AI analysis from the report text.");
  }
};


module.exports = { getHealthAdvice, analyzeMedicalText };