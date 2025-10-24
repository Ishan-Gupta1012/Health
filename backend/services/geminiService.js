const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the GEMINI_API_KEY environment variable.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * A single, reliable function to run all Gemini queries using the correct library syntax.
 * @param {string} prompt The prompt to send to the AI.
 * @returns {Promise<string>} A promise that resolves with the AI's text response.
 */
const runGeminiQuery = async (prompt) => {
  if (!genAI) {
    throw new Error("Gemini API key is not configured.");
  }
  try {
    // Correct syntax for @google/generative-ai package
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error during Gemini API call:", error);
    throw new Error("Failed to get a response from the AI model. Please check your API key and model availability.");
  }
};

const analyzePrescription = async (prescriptionText) => {
  const prompt = `
    Analyze the following prescription text. Return a single, clean JSON object with a key "medicines", which is an array of objects.
    Each object must have "name", "dosage", "frequency", and "role".
    If a value is not found, use "Not specified".

    Prescription Text:
    ---
    ${prescriptionText}
    ---
  `;

  try {
    const jsonString = await runGeminiQuery(prompt);
    const cleanedJsonString = jsonString.trim().replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedJsonString);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    throw new Error("Failed to generate AI analysis from the prescription text.");
  }
};

const getHealthAdvice = async (diseaseName) => {
  const prompt = `Provide short, friendly, medically safe lifestyle advice for managing ${diseaseName}. Keep it under 150 words. Start with a disclaimer.`;
  return await runGeminiQuery(prompt);
};

const analyzeMedicalText = async (medicalText) => {
  const prompt = `Analyze the following medical text. Provide a JSON object with a "summary" and a "questions" array. Report Text: --- ${medicalText} ---`;
  const jsonString = await runGeminiQuery(prompt);
  const cleanedJsonString = jsonString.trim().replace(/```json|```/g, '').trim();
  return JSON.parse(cleanedJsonString);
};

module.exports = { 
  getHealthAdvice, 
  analyzeMedicalText, 
  analyzePrescription 
};