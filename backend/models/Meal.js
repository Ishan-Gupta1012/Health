const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    required: true
  },
  foodItem: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  // Updated fields to store detailed nutritional info
  calories: {
    type: Number,
    default: 0
  },
  protein: {
    type: Number,
    default: 0
  },
  fat: {
    type: Number,
    default: 0
  },
  carbohydrates: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Meal', mealSchema);
