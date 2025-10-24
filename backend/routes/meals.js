const express = require('express');
const Meal = require('../models/Meal');
const { verifyToken } = require('./authMiddleware');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

// --- Initialize Gemini AI ---
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// --- Helper Function to get nutritional data ---
const getNutritionalData = async (foodItem, quantity) => {
  const defaultNutrition = { calories: 150, protein: 5, fat: 5, carbohydrates: 20 };
  
  if (!genAI) {
    console.warn('Gemini API key not found. Returning default nutritional data.');
    return defaultNutrition;
  }

  try {
    const prompt = `Provide a JSON object with nutritional estimates for "${quantity} of ${foodItem}". The JSON object should have four keys: "calories", "protein", "fat", and "carbohydrates". The values should be numbers only. Example: {"calories": 300, "protein": 20, "fat": 15, "carbohydrates": 25}`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    
    const text = response.text.trim();
    
    // Clean the response to ensure it's valid JSON
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '');
    const data = JSON.parse(jsonString);

    // Validate the response
    if (typeof data.calories !== 'number' || typeof data.protein !== 'number' || typeof data.fat !== 'number' || typeof data.carbohydrates !== 'number') {
      console.error('Invalid JSON structure from Gemini response:', data);
      return defaultNutrition;
    }
    
    return data;

  } catch (error) {
    console.error('Error fetching nutritional data from Gemini API:', error.message);
    return defaultNutrition;
  }
};


// --- API Routes ---

// Add a new meal
router.post('/', verifyToken, async (req, res) => {
  try {
    const { mealType, foodItem, quantity, time } = req.body;
    if (!mealType || !foodItem || !quantity || !time) {
      return res.status(400).json({ message: 'All meal fields are required.' });
    }

    const nutritionalData = await getNutritionalData(foodItem, quantity);

    const newMeal = new Meal({
      userId: req.userId,
      mealType,
      foodItem,
      quantity,
      time,
      ...nutritionalData // Spread the detailed nutritional data
    });

    await newMeal.save();
    res.status(201).json({ message: 'Meal added successfully', meal: newMeal });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add meal', error: error.message });
  }
});

// Update a meal
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { mealType, foodItem, quantity, time } = req.body;

        const meal = await Meal.findOne({ _id: req.params.id, userId: req.userId });
        if (!meal) {
            return res.status(404).json({ message: 'Meal not found.' });
        }

        const nutritionalData = await getNutritionalData(foodItem, quantity);

        meal.mealType = mealType;
        meal.foodItem = foodItem;
        meal.quantity = quantity;
        meal.time = time;
        meal.calories = nutritionalData.calories;
        meal.protein = nutritionalData.protein;
        meal.fat = nutritionalData.fat;
        meal.carbohydrates = nutritionalData.carbohydrates;

        const updatedMeal = await meal.save();
        res.json({ message: 'Meal updated successfully', meal: updatedMeal });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update meal', error: error.message });
    }
});


// NEW ROUTE: Get meals for a specific date (used by MealTracker.jsx)
// Endpoint: GET /api/meals/user?date=YYYY-MM-DD
router.get('/user', verifyToken, async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date query parameter is required.' });
    }

    // Set the start and end of the specified day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      userId: req.userId,
      // Query documents created within the 24-hour window of the selected date
      createdAt: { $gte: startOfDay, $lt: endOfDay } 
    }).sort({ createdAt: 'asc' });

    // Return the meals in a consistent format
    res.json(meals);
  } catch (error) {
    console.error('Failed to fetch user meals by date:', error.message);
    res.status(500).json({ message: 'Failed to fetch user meals by date', error: error.message });
  }
});


// Get today's meals
router.get('/today', verifyToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const meals = await Meal.find({
      userId: req.userId,
      createdAt: { $gte: today, $lt: tomorrow }
    }).sort({ createdAt: 'asc' });

    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch today\'s meals', error: error.message });
  }
});

// Get meal history for the last 7 days
router.get('/history', verifyToken, async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const meals = await Meal.find({
            userId: req.userId,
            createdAt: { $gte: sevenDaysAgo }
        }).sort({ createdAt: 'desc' });

        res.json(meals);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch meal history', error: error.message });
    }
});

// Get AI-powered health advice
router.get('/advice', verifyToken, async (req, res) => {
    if (!genAI) {
        return res.json({ advice: 'AI advice is currently unavailable. Please check your API key.' });
    }

    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
        const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

        const meals = await Meal.find({
            userId: req.userId,
            createdAt: { $gte: startOfYesterday, $lt: endOfYesterday }
        });

        if (meals.length === 0) {
            return res.json({ advice: "No meals logged yesterday. Log today's meals to get advice tomorrow!" });
        }

        const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
        const mealSummary = meals.map(m => `${m.mealType}: ${m.quantity} of ${m.foodItem} (~${m.calories} kcal)`).join('\n');

        const prompt = `You are a professional AI nutrition and wellness assistant. The user has logged their meals for the day.

### TASK:
Analyze the user's full-day meal data and generate a health summary in two short paragraphs.

1️⃣ In the **first paragraph**, briefly estimate:
- The user's approximate **blood sugar** and **blood pressure** fluctuation (increase, decrease, or stable) 
- Base this estimation on sugar, sodium, and fat content in the meals.

2️⃣ In the **second paragraph**, provide personalized **nutrition advice**, including:
- Which nutrients (protein, fiber, vitamins, carbs, fats) the user should increase or decrease
- What kind of foods would help improve balance (e.g., "add more leafy vegetables", "reduce fried foods", "include fruits with low glycemic index")

### OUTPUT FORMAT:
Keep the tone friendly and professional.
Output should be exactly two paragraphs — no bullet points, no numbering.
 Total calories consumed were ${totalCalories}.\n\nMeals:\n${mealSummary}\n\nAdvice:`;

        const response = await genAI.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: prompt,
        });
        const advice = response.text.trim();

        res.json({ advice });
    } catch (error) {
        console.error('Error fetching AI advice:', error.message);
        res.status(500).json({ message: 'Failed to generate AI advice.' });
    }
});


// Delete a meal
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found or you do not have permission to delete it.' });
    }
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete meal', error: error.message });
  }
});

module.exports = router;