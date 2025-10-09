const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  reminderId: {
    type: String,
    unique: true,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  medicineName: {
    type: String,
    required: true
  },
  dosage: {
    amount: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true,
      enum: ['mg', 'ml', 'tablet', 'capsule', 'drop', 'tsp', 'tbsp']
    }
  },
  frequency: {
    timesPerDay: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    times: [{
      type: String,
      required: true
    }]
  },
  duration: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  instructions: {
    type: String,
    default: ''
  },
  beforeFood: {
    type: Boolean,
    default: false
  },
  afterFood: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  completedDoses: [{
    date: Date,
    time: String,
    taken: Boolean
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Reminder', reminderSchema);