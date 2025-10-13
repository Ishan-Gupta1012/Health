const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const medicalRecordSchema = new mongoose.Schema({
  recordId: {
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
  recordType: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  doctor: {
    type: String,
    default: ''
  },
  // ADDED: To store the path of the uploaded file
  fileUrl: {
    type: String
  },
  // ADDED: To create a unique link for sharing
  shareableLink: {
    type: String,
    unique: true,
    default: () => nanoid(12) // Generates a unique 12-character ID
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);