// backend/models/Disease.js

const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  symptoms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Symptom'
  }]
  // You can add more fields here later, like 'description', 'treatments', etc.
});

module.exports = mongoose.model('Disease', diseaseSchema);