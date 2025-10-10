// backend/models/Symptom.js

const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // This helps create a two-way relationship if you ever need it
  diseases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disease'
  }]
});

module.exports = mongoose.model('Symptom', symptomSchema);