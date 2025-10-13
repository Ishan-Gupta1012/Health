const express = require('express');
const Meal = require('../models/Meal');
const { verifyToken } = require('./authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// --- Initialize Gemini AI ---
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// --- Helper Functions ---

// Get calorie estimate from Gemini
const getCalorieEstimate = async (foodItem, quantity) => {
  if (!genAI) {
    console.warn('Gemini API key not found. Returning a default of 150 calories.');
    // Returning a non-zero default so it's obvious on the frontend if the API key is missing
    return 150;
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Provide a numerical estimate of the calories in "${quantity} of ${foodItem}". Respond with only the number, no units or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    const calories = parseInt(text, 10);
    // If parsing fails, return a default value and log the issue
    if (isNaN(calories)) {
      console.error('Failed to parse calories from Gemini response:', text);
      return 150;
    }
    return calories;
  } catch (error) {
    console.error('Error fetching calorie estimate from Gemini API:', error.message);
    // Return a default value in case of an API error
    return 150;
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

    const calories = await getCalorieEstimate(foodItem, quantity);

    const newMeal = new Meal({
      userId: req.userId,
      mealType,
      foodItem,
      quantity,
      time,
      calories
    });

    await newMeal.save();
    res.status(201).json({ message: 'Meal added successfully', meal: newMeal });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add meal', error: error.message });
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

    res.json({ meals });
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

        res.json({ meals });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch meal history', error: error.message });
    }
});


// Get AI-powered health advice based on yesterday's meals
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

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Based on the following meal log from yesterday, provide a short, single-paragraph of personalized health advice. Total calories consumed were ${totalCalories}.\n\nMeals:\n${mealSummary}\n\nAdvice:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const advice = response.text().trim();

        res.json({ advice });
    } catch (error) {
        console.error('Error fetching AI advice:', error.message);
        res.status(500).json({ message: 'Failed to generate AI advice.' });
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

        const calories = await getCalorieEstimate(foodItem, quantity);

        meal.mealType = mealType;
        meal.foodItem = foodItem;
        meal.quantity = quantity;
        meal.time = time;
        meal.calories = calories;

        const updatedMeal = await meal.save();
        res.json({ message: 'Meal updated successfully', meal: updatedMeal });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update meal', error: error.message });
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